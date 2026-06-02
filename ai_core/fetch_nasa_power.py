import requests
import os
import pandas as pd
from datetime import datetime

# Coordonnées pour Kpalimé, Togo (Région des plateaux, zone très agricole)
LATITUDE = 8.61
LONGITUDE = 0.82
START_DATE = "20150101" # Format YYYYMMDD
END_DATE = "20231231"

# Paramètres: 
# T2M = Temperature at 2 Meters
# PRECTOTCORR = Precipitation Corrected
# RH2M = Relative Humidity at 2 Meters
PARAMETERS = "T2M,PRECTOTCORR,RH2M"

OUTPUT_DIR = "../data"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "nasa_power_togo.csv")

def fetch_nasa_data():
    print(f"Recuperation des donnees NASA POWER pour le Togo (Lat: {LATITUDE}, Lon: {LONGITUDE})...")
    print(f"Periode : {START_DATE} a {END_DATE}")
    
    # URL de l'API NASA POWER (Community AG = Agroclimatology)
    url = f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters={PARAMETERS}&community=AG&longitude={LONGITUDE}&latitude={LATITUDE}&start={START_DATE}&end={END_DATE}&format=CSV"
    
    response = requests.get(url)
    
    if response.status_code == 200:
        if not os.path.exists(OUTPUT_DIR):
            os.makedirs(OUTPUT_DIR)
            
        with open(OUTPUT_FILE, "wb") as f:
            f.write(response.content)
            
        print(f"Succes ! Les donnees ont ete sauvegardees dans {OUTPUT_FILE}")
        print("Note : Le fichier CSV de la NASA contient un en-tête de métadonnées de plusieurs lignes. Les données commencent plus bas.")
    else:
        print(f"Erreur lors de la recuperation des donnees : Code HTTP {response.status_code}")

if __name__ == "__main__":
    fetch_nasa_data()
