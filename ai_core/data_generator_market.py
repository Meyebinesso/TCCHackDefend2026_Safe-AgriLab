import pandas as pd
import numpy as np
import random
import os
from datetime import datetime, timedelta

# Configuration
NUM_DAYS = 730 # 2 ans d'historique
OUTPUT_DIR = "../data"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "market_dataset.csv")

# Liste des cultures
CROPS = ['Maïs', 'Riz', 'Sorgho', 'Igname', 'Manioc', 'Soja', 'Coton', 'Cacao', 'Café']

def generate_market_data(start_date, num_days):
    """
    Génère des données de prix du marché avec des tendances saisonnières et des chocs.
    """
    data = []
    
    # Prix de base approximatif en Francs CFA par Kg
    base_prices = {
        'Maïs': 200, 'Riz': 400, 'Sorgho': 250, 'Igname': 300, 
        'Manioc': 150, 'Soja': 350, 'Coton': 500, 'Cacao': 1500, 'Café': 1200
    }
    
    current_date = start_date
    
    for day in range(num_days):
        date_str = current_date.strftime("%Y-%m-%d")
        month = current_date.month
        
        for crop in CROPS:
            bp = base_prices[crop]
            
            # Saisonnalité (ex: les prix montent pendant la saison sèche, baissent après les récoltes)
            # Une onde sinus en fonction du mois
            season_effect = np.sin((month / 12.0) * 2 * np.pi) * 0.15
            
            # Tendance globale (inflation légère)
            trend_effect = (day / 365.0) * 0.05
            
            # Bruit aléatoire (fluctuations quotidiennes)
            noise = np.random.normal(0, 0.05)
            
            # Choc d'offre ou de demande aléatoire (1% de chance chaque jour)
            shock = 0
            if random.random() < 0.01:
                shock = random.choice([-0.2, 0.2, 0.3]) # Chute ou hausse drastique
            
            final_price = bp * (1 + season_effect + trend_effect + noise + shock)
            final_price = max(10, int(final_price)) # Prix minimum et arrondi
            
            # Calcul du volume vendu estimé (loi de l'offre et la demande)
            # Si le prix est bas, le volume demandé est haut
            demand_index = max(1, int(1000 * (bp / final_price) + np.random.normal(0, 100)))
            
            data.append({
                'date': date_str,
                'culture': crop,
                'mois': month,
                'prix_fcfa_kg': final_price,
                'demande_estimee_kg': demand_index
            })
            
        current_date += timedelta(days=1)
        
    return data

if __name__ == "__main__":
    print("Génération du dataset marché synthétique...")
    
    start = datetime(2024, 1, 1)
    dataset = generate_market_data(start, NUM_DAYS)
    
    df = pd.DataFrame(dataset)
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    df.to_csv(OUTPUT_FILE, index=False)
    print(f"Dataset généré avec succès ({len(df)} lignes) : {OUTPUT_FILE}")
