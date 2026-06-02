import pandas as pd
import os

DATA_DIR = r"C:\Users\kambi\Documents\HACK-TECH2026\Safe_AgriLab\data\production - FAOSTAT"
CULTURES_FILE = os.path.join(DATA_DIR, "Cultures_Togo.csv")
INDICE_FILE = os.path.join(DATA_DIR, "Indice_de_production_brut_Togo.csv")
VALEUR_FILE = os.path.join(DATA_DIR, "Valeur_de_la_Production_Agricole_Brute_Togo.csv")

def analyze_cultures():
    print("--- Analyse de Cultures_Togo.csv ---")
    try:
        df = pd.read_csv(CULTURES_FILE)
        print(f"Total lignes : {len(df)}")
        produits = df['Produit'].unique()
        print(f"Nombre de cultures distinctes : {len(produits)}")
        print(f"Exemples de cultures : {produits[:5]}")
        
        # Isoler les rendements
        df_rendement = df[df['Élément'] == 'Rendement']
        print(f"\nDonnées de rendement disponibles pour {len(df_rendement['Produit'].unique())} cultures.")
    except Exception as e:
        print(f"Erreur : {e}")

if __name__ == "__main__":
    analyze_cultures()
