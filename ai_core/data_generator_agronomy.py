import pandas as pd
import numpy as np
import random
import os

# Configuration
NUM_SAMPLES = 2000
OUTPUT_DIR = "../data"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "agronomy_dataset.csv")

# Liste des cultures adaptées au climat tropical (ex: Togo)
CROPS = ['Maïs', 'Riz', 'Sorgho', 'Igname', 'Manioc', 'Soja', 'Coton', 'Cacao', 'Café']

def generate_crop_data(crop, num_samples):
    """
    Génère des données de sol et de météo réalistes pour une culture spécifique.
    Les plages de valeurs (N, P, K, température, etc.) sont adaptées pour être "logiques".
    """
    data = []
    
    # Définition de plages "idéales" approximatives par culture
    # Format: [Min, Max]
    profiles = {
        'Maïs': {'N': [60, 100], 'P': [35, 60], 'K': [15, 30], 'pH': [5.5, 7.5], 'Temp': [20, 30], 'Rain': [500, 1000]},
        'Riz': {'N': [50, 90], 'P': [35, 60], 'K': [30, 50], 'pH': [5.0, 7.0], 'Temp': [20, 35], 'Rain': [1000, 2000]},
        'Sorgho': {'N': [30, 60], 'P': [20, 40], 'K': [20, 40], 'pH': [5.5, 8.0], 'Temp': [25, 35], 'Rain': [400, 800]},
        'Igname': {'N': [40, 80], 'P': [30, 50], 'K': [40, 60], 'pH': [5.5, 6.5], 'Temp': [25, 30], 'Rain': [1000, 1500]},
        'Manioc': {'N': [30, 60], 'P': [15, 30], 'K': [30, 50], 'pH': [5.0, 6.5], 'Temp': [25, 32], 'Rain': [800, 1200]},
        'Soja': {'N': [20, 40], 'P': [40, 70], 'K': [20, 40], 'pH': [6.0, 7.5], 'Temp': [20, 30], 'Rain': [600, 1000]},
        'Coton': {'N': [100, 140], 'P': [40, 60], 'K': [30, 50], 'pH': [5.5, 7.0], 'Temp': [25, 35], 'Rain': [600, 1200]},
        'Cacao': {'N': [50, 80], 'P': [30, 50], 'K': [30, 60], 'pH': [5.0, 6.5], 'Temp': [22, 28], 'Rain': [1500, 2500]},
        'Café': {'N': [60, 90], 'P': [20, 40], 'K': [40, 70], 'pH': [5.0, 6.0], 'Temp': [18, 25], 'Rain': [1500, 2000]},
    }
    
    prof = profiles.get(crop, profiles['Maïs'])
    
    for _ in range(num_samples):
        # Ajouter un peu de bruit pour rendre le dataset plus réaliste (valeurs parfois sous/sur optimales)
        n = max(0, int(np.random.normal(np.mean(prof['N']), (prof['N'][1] - prof['N'][0])/4)))
        p = max(0, int(np.random.normal(np.mean(prof['P']), (prof['P'][1] - prof['P'][0])/4)))
        k = max(0, int(np.random.normal(np.mean(prof['K']), (prof['K'][1] - prof['K'][0])/4)))
        ph = round(max(0, np.random.normal(np.mean(prof['pH']), (prof['pH'][1] - prof['pH'][0])/4)), 1)
        temp = round(np.random.normal(np.mean(prof['Temp']), (prof['Temp'][1] - prof['Temp'][0])/4), 1)
        rain = round(max(0, np.random.normal(np.mean(prof['Rain']), (prof['Rain'][1] - prof['Rain'][0])/4)), 1)
        
        # Humidité simulée basée sur la pluie et la température
        humidity = round(min(100, max(20, (rain / 20) + np.random.uniform(-10, 10))), 1)

        data.append({
            'N_azote': n,
            'P_phosphore': p,
            'K_potassium': k,
            'pH': ph,
            'temperature_C': temp,
            'humidite_pourcentage': humidity,
            'precipitations_mm': rain,
            'culture_recommandee': crop
        })
    return data

if __name__ == "__main__":
    print("Génération du dataset agronomique synthétique...")
    all_data = []
    
    samples_per_crop = NUM_SAMPLES // len(CROPS)
    
    for c in CROPS:
        all_data.extend(generate_crop_data(c, samples_per_crop))
        
    df = pd.DataFrame(all_data)
    
    # Mélanger les lignes (Shuffle)
    df = df.sample(frac=1).reset_index(drop=True)
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    df.to_csv(OUTPUT_FILE, index=False)
    print(f"Dataset généré avec succès ({len(df)} lignes) : {OUTPUT_FILE}")
