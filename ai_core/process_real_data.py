import pandas as pd
import os

DATA_DIR = "../data"
WB_AGR_FILE = os.path.join(DATA_DIR, "API_NV.AGR.TOTL.KN_DS2_en_csv_v2_277598.csv")
WB_RD_FILE = os.path.join(DATA_DIR, "API_GB.XPD.RSDV.GD.ZS_DS2_en_csv_v2_265869.csv")
NASA_FILE = os.path.join(DATA_DIR, "nasa_power_togo.csv")

def analyze_world_bank():
    print("--- Analyse des données de la Banque Mondiale (TOGO) ---")
    
    # Les fichiers World Bank ont souvent 4 lignes d'en-tête à ignorer (skiprows=4)
    try:
        df_agr = pd.read_csv(WB_AGR_FILE, skiprows=4)
        togo_agr = df_agr[df_agr['Country Name'] == 'Togo']
        
        if not togo_agr.empty:
            print(f"\n[OK] Indicateur trouve : {togo_agr['Indicator Name'].values[0]}")
            # Afficher les 5 dernieres annees disponibles
            years = [str(y) for y in range(2018, 2024)]
            print("Valeurs recentes (2018-2023) :")
            for y in years:
                if y in togo_agr.columns:
                    val = togo_agr[y].values[0]
                    print(f" - {y} : {val}")
        else:
            print("[WARN] Togo introuvable dans le fichier Agriculture.")
            
    except Exception as e:
        print(f"Erreur lecture WB Agriculture : {e}")

def analyze_nasa():
    print("\n--- Analyse des donnees NASA POWER (TOGO) ---")
    try:
        # Les fichiers NASA POWER ont un en-tete dynamique. On cherche la ligne "-END HEADER-"
        with open(NASA_FILE, 'r') as f:
            lines = f.readlines()
            skip_lines = 0
            for i, line in enumerate(lines):
                if "-END HEADER-" in line:
                    skip_lines = i + 1
                    break
        
        df_nasa = pd.read_csv(NASA_FILE, skiprows=skip_lines)
        print(f"[OK] Fichier NASA charge : {len(df_nasa)} jours de donnees meteorologiques.")
        print("Apercu des 3 premiers jours :")
        print(df_nasa[['YEAR', 'MO', 'DY', 'T2M', 'PRECTOTCORR', 'RH2M']].head(3))
        
    except Exception as e:
        print(f"Erreur lecture NASA POWER : {e}")

if __name__ == "__main__":
    analyze_world_bank()
    analyze_nasa()
