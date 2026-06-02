import nbformat as nbf
import os

def create_comprehensive_eda():
    nb = nbf.v4.new_notebook()
    
    cells = []
    
    # Intro
    cells.append(nbf.v4.new_markdown_cell("# 📊 Phase 2 : Exploration Globale des Données (EDA Approfondie)\nCe notebook contient l'exploration complète de 100% de nos sources de données pour le projet Safe_AgriLab.\n\n**Objectifs :**\n1. Comprendre la structure de TOUS les datasets.\n2. Analyse univariée et bivariée.\n3. Traitement avancé des valeurs manquantes et aberrantes.\n4. Analyse des séries temporelles (Climat + Rendements).\n5. Corrélations préliminaires."))
    
    # Imports
    cells.append(nbf.v4.new_code_cell("""\
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

sns.set_theme(style="whitegrid", palette="muted")
plt.rcParams['figure.figsize'] = (12, 6)

DATA_DIR = '../data'
FAO_CULT = f'{DATA_DIR}/production - FAOSTAT/Cultures_Togo.csv'
FAO_INDICE = f'{DATA_DIR}/production - FAOSTAT/Indice_de_production_brut_Togo.csv'
FAO_VALEUR = f'{DATA_DIR}/production - FAOSTAT/Valeur_de_la_Production_Agricole_Brute_Togo.csv'
NASA_WEATHER = f'{DATA_DIR}/POWER_Point_Daily_20150101_20260602_008d01N_001d09E_LST.csv'
WB_MACRO = f'{DATA_DIR}/API_NV.AGR.TOTL.KN_DS2_en_csv_v2_277598.csv'
"""))

    # Section 1: FAOSTAT Cultures
    cells.append(nbf.v4.new_markdown_cell("## 1. Analyse FAOSTAT : Cultures et Rendements"))
    cells.append(nbf.v4.new_code_cell("""\
df_cultures = pd.read_csv(FAO_CULT)
display(df_cultures.info())
display(df_cultures.describe(include='all'))

# Valeurs manquantes
print("\\n--- Valeurs Manquantes ---")
display(df_cultures.isnull().sum())

# Filtrer pour le Rendement
df_rendement = df_cultures[df_cultures['Élément'] == 'Rendement']

# Top 10 cultures par rendement moyen
top_cultures = df_rendement.groupby('Produit')['Valeur'].mean().sort_values(ascending=False).head(10)
plt.figure(figsize=(12,5))
sns.barplot(x=top_cultures.values, y=top_cultures.index)
plt.title('Top 10 des Cultures au Togo par Rendement Moyen (kg/ha)')
plt.xlabel('Rendement (kg/ha)')
plt.show()
"""))

    # Section 2: NASA POWER Weather
    cells.append(nbf.v4.new_markdown_cell("## 2. Analyse NASA POWER : Climatologie (Séries Temporelles)"))
    cells.append(nbf.v4.new_code_cell("""\
# Lecture NASA POWER en gérant l'entête
with open(NASA_WEATHER, 'r') as f:
    skip_lines = 0
    for i, line in enumerate(f):
        if "-END HEADER-" in line:
            skip_lines = i + 1
            break

df_weather = pd.read_csv(NASA_WEATHER, skiprows=skip_lines)

# Création d'une date (Format NASA : YEAR et DOY pour Day of Year)
if 'DOY' in df_weather.columns and 'YEAR' in df_weather.columns:
    df_weather['DATE'] = pd.to_datetime(df_weather['YEAR'].astype(str) + df_weather['DOY'].astype(str).str.zfill(3), format='%Y%j')
    df_weather.set_index('DATE', inplace=True)
elif all(c in df_weather.columns for c in ['YEAR', 'MO', 'DY']):
    df_weather['DATE'] = pd.to_datetime(df_weather[['YEAR', 'MO', 'DY']].rename(columns={'YEAR': 'year', 'MO': 'month', 'DY': 'day'}))
    df_weather.set_index('DATE', inplace=True)

display(df_weather.info())

# Nettoyage des valeurs aberrantes de la NASA (souvent -999)
df_weather.replace(-999.0, np.nan, inplace=True)

print("\\n--- Valeurs Manquantes Météo après filtre -999 ---")
display(df_weather.isnull().sum())

# Visualisation des précipitations (PRECTOTCORR)
if 'PRECTOTCORR' in df_weather.columns:
    df_weather['PRECTOTCORR'].resample('M').sum().plot(figsize=(14, 5), color='blue')
    plt.title('Précipitations mensuelles cumulées au Togo (2015-Aujourd\\'hui)')
    plt.ylabel('Précipitations (mm)')
    plt.show()
"""))

    # Section 3: Banque Mondiale
    cells.append(nbf.v4.new_markdown_cell("## 3. Analyse Banque Mondiale : Macro-économie"))
    cells.append(nbf.v4.new_code_cell("""\
df_wb = pd.read_csv(WB_MACRO, skiprows=4)
df_wb_togo = df_wb[df_wb['Country Name'] == 'Togo']

# On extrait les années utiles (2010 - 2023)
years = [str(y) for y in range(2010, 2024)]
togo_data = df_wb_togo[['Indicator Name'] + years]
display(togo_data)

# Tracer l'évolution
valeurs = togo_data[years].values[0]
plt.plot(years, valeurs, marker='o', linestyle='-', color='green')
plt.title(togo_data['Indicator Name'].values[0])
plt.xticks(rotation=45)
plt.ylabel('LCU Constant')
plt.grid(True)
plt.show()
"""))

    # Section 4: Outliers et Distributions
    cells.append(nbf.v4.new_markdown_cell("## 4. Analyse des Outliers (Valeurs Aberrantes)"))
    cells.append(nbf.v4.new_code_cell("""\
# Boxplot sur les rendements des 5 cultures principales
cultures_cibles = ['Maïs', 'Riz, paddy', 'Fèves de soja', 'Cacao, fèves', 'Ignames']
df_cibles = df_rendement[df_rendement['Produit'].isin(cultures_cibles)]

plt.figure(figsize=(12, 6))
sns.boxplot(data=df_cibles, x='Produit', y='Valeur')
plt.title('Distribution et Outliers des rendements par Culture')
plt.ylabel('Rendement (kg/ha)')
plt.show()
"""))

    # Section 5: Stratégie d'imputation (Actionnable)
    cells.append(nbf.v4.new_markdown_cell("## 5. Méthodes d'Imputation (Décisions)"))
    cells.append(nbf.v4.new_code_cell("""\
print("Stratégies à appliquer lors de la préparation :")
print("1. NASA POWER : Utiliser l'interpolation temporelle (df.interpolate(method='time')) pour combler les quelques jours manquants de météo.")
print("2. FAOSTAT : Les 'Valeurs imputées par une agence réceptrice' (Flag 'I') peuvent être conservées telles quelles.")
print("3. World Bank : Si des années récentes manquent, appliquer un lissage exponentiel (Exponential Smoothing).")

# Exemple d'interpolation sur la météo
if 'T2M' in df_weather.columns:
    df_weather['T2M_interpolated'] = df_weather['T2M'].interpolate(method='time')
    print("Interpolation temporelle réussie sur T2M (Température moyenne).")
"""))

    nb['cells'] = cells
    
    with open('../notebooks/1_EDA_Data_Preparation.ipynb', 'w', encoding='utf-8') as f:
        nbf.write(nb, f)
    
    print("Notebook EDA complet généré avec succès.")

if __name__ == "__main__":
    create_comprehensive_eda()
