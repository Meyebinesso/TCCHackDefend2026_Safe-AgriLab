import pandas as pd
import numpy as np

def merge_datasets():
    DATA_DIR = '../data'
    
    # 1. Charger et nettoyer FAOSTAT
    print("Chargement de FAOSTAT...")
    df_fao = pd.read_csv(f'{DATA_DIR}/production - FAOSTAT/Cultures_Togo.csv')
    # Garder uniquement les rendements pour la prédiction agronomique
    df_fao = df_fao[df_fao['Élément'] == 'Rendement']
    # Sélection des attributs retenus
    df_fao = df_fao[['Produit', 'Année', 'Valeur']].rename(columns={'Valeur': 'Rendement_kg_ha'})
    
    # 2. Charger et nettoyer NASA POWER
    print("Chargement de NASA POWER...")
    NASA_WEATHER = f'{DATA_DIR}/POWER_Point_Daily_20150101_20260602_008d01N_001d09E_LST.csv'
    with open(NASA_WEATHER, 'r') as f:
        lines = f.readlines()
    skip_lines = [i for i, l in enumerate(lines) if '-END HEADER-' in l][0] + 1
    df_weather = pd.read_csv(NASA_WEATHER, skiprows=skip_lines)
    
    # Remplacer les outliers météo
    df_weather.replace(-999.0, np.nan, inplace=True)
    
    # Stratégie d'imputation : Interpolation
    cols_to_interpolate = ['T2M', 'PRECTOTCORR', 'RH2M', 'GWETROOT', 'GWETTOP']
    for col in cols_to_interpolate:
        if col in df_weather.columns:
            df_weather[col] = df_weather[col].interpolate(method='linear')
            
    # Agréger par année pour correspondre à FAOSTAT
    df_weather_yearly = df_weather.groupby('YEAR')[cols_to_interpolate].mean().reset_index()
    df_weather_yearly.rename(columns={'YEAR': 'Année'}, inplace=True)
    
    # 3. Charger Banque Mondiale (Valeur ajoutée)
    print("Chargement de la Banque Mondiale...")
    WB_MACRO = f'{DATA_DIR}/API_NV.AGR.TOTL.KN_DS2_en_csv_v2_277598.csv'
    df_wb = pd.read_csv(WB_MACRO, skiprows=4)
    # Filtrer pour le Togo (le fichier contient normalement le monde entier)
    # L'indicateur : NV.AGR.TOTL.KN
    df_wb = df_wb[df_wb['Indicator Code'] == 'NV.AGR.TOTL.KN']
    df_wb = df_wb[df_wb['Country Code'] == 'TGO']
    
    # Les années sont en colonnes, on doit les transformer en lignes (Melt)
    years = [str(y) for y in range(2010, 2024)]
    existing_years = [y for y in years if y in df_wb.columns]
    
    df_wb_melted = df_wb.melt(id_vars=['Country Name'], value_vars=existing_years, var_name='Année', value_name='Valeur_Ajoutee_Agricole')
    df_wb_melted['Année'] = df_wb_melted['Année'].astype(int)
    df_wb_melted = df_wb_melted[['Année', 'Valeur_Ajoutee_Agricole']]
    
    # 4. FUSION DES DONNEES (MERGE)
    print("Fusion des datasets...")
    # On merge FAO avec NASA
    df_merged = pd.merge(df_fao, df_weather_yearly, on='Année', how='inner')
    # On merge avec Banque Mondiale
    df_merged = pd.merge(df_merged, df_wb_melted, on='Année', how='inner')
    
    # Sauvegarde
    output_path = f'{DATA_DIR}/merged_agrilab_dataset.csv'
    df_merged.to_csv(output_path, index=False)
    print(f"Fusion terminée avec succès ! Lignes: {len(df_merged)}")
    print(f"Fichier sauvegardé dans : {output_path}")

if __name__ == "__main__":
    merge_datasets()
