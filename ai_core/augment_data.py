import pandas as pd
import numpy as np
import os

def augment_with_agronomic_laws(input_file, output_file, target_rows=5000):
    print(f"Chargement des données réelles depuis {input_file}...")
    df_real = pd.read_csv(input_file)
    
    # 1. Extraire les métriques de base de la réalité pour rester réaliste
    crop_means = df_real.groupby('Produit')['Rendement_kg_ha'].mean().to_dict()
    cultures_list = list(crop_means.keys())
    
    t2m_mean_historique = df_real['T2M'].mean()
    precip_mean_historique = df_real['PRECTOTCORR'].mean()
    rh2m_mean = df_real['RH2M'].mean()
    gwetroot_mean = df_real['GWETROOT'].mean()
    wb_mean = df_real['Valeur_Ajoutee_Agricole'].mean()
    
    print("Génération de 5000 scénarios climatiques et agronomiques...")
    augmented_data = []
    
    for _ in range(target_rows):
        # Tirer une culture au hasard parmi celles qui existent vraiment
        culture = np.random.choice(cultures_list)
        
        # Simuler un scénario climatique RÉALISTE
        # La température varie généralement de +/- 1.5°C autour de la moyenne au Togo
        anomalie_t2m = np.random.normal(0, 0.8) # 68% des années sont entre -0.8 et +0.8, avec quelques extrêmes à +/- 2.0
        # La pluie varie d'environ 200mm (sécheresses) à +300mm (inondations)
        anomalie_precip = np.random.normal(0, 150) 
        
        # LOI AGRONOMIQUE (La parabole de rendement)
        # 1.0 = 100% de rendement (idéal). 
        # Si anomalie_precip = 200mm (manque d'eau ou inondation), 200^2 * 0.000004 = 0.16 -> Perte de 16% de rendement.
        # Si anomalie_t2m = 1.5°C (trop chaud ou trop froid), 1.5^2 * 0.05 = 0.11 -> Perte de 11% de rendement.
        impact_pluie = 0.000004 * (anomalie_precip ** 2)
        impact_temp = 0.05 * (anomalie_t2m ** 2)
        
        # Création de l'Indice de Stress Climatique (normalisé approximativement entre 0 et 1)
        # 0 = Climat parfait. 1.0 ou + = Stress maximal (perte de rendement sévère)
        indice_stress = impact_pluie + impact_temp
        
        # Rendement théorique selon la loi mathématique
        rendement_relatif_theorique = 1.0 - indice_stress
        
        # On empêche le rendement d'être négatif en cas de catastrophe extrême (seuil minimal à 10%)
        rendement_relatif_theorique = max(0.1, rendement_relatif_theorique)
        
        # Ajout du bruit naturel (la vraie vie n'est pas une équation parfaite) +/- 5%
        bruit_naturel = np.random.normal(0, 0.05)
        rendement_relatif_final = rendement_relatif_theorique + bruit_naturel
        
        # Calcul des valeurs brutes pour le dataset
        t2m_brut = t2m_mean_historique + anomalie_t2m
        precip_brut = precip_mean_historique + anomalie_precip
        rendement_brut = rendement_relatif_final * crop_means[culture]
        
        # On simule l'humidité (RH2M et GWETROOT) proportionnellement à la pluie (s'il pleut, c'est humide)
        rh2m_brut = rh2m_mean + (anomalie_precip * 0.01)
        gwetroot_brut = gwetroot_mean + (anomalie_precip * 0.0002)
        
        # Valeur marchande globale : on la fait un peu corréler au rendement relatif global
        wb_brut = wb_mean * (1.0 + (rendement_relatif_final - 1.0) * 0.5) + np.random.normal(0, wb_mean*0.02)
        
        # Sauvegarde de la ligne
        augmented_data.append({
            'Produit': culture,
            'Année': np.random.randint(2010, 2025), # Années simulées
            'Rendement_kg_ha': rendement_brut,
            'T2M': t2m_brut,
            'PRECTOTCORR': precip_brut,
            'RH2M': rh2m_brut,
            'GWETROOT': gwetroot_brut,
            'Valeur_Ajoutee_Agricole': wb_brut,
            'Rendement_Relatif': rendement_relatif_final,
            'Anomalie_T2M': anomalie_t2m,
            'Anomalie_Precip': anomalie_precip,
            'Indice_Stress_Climatique': indice_stress
        })
        
    df_augmented = pd.DataFrame(augmented_data)
    df_augmented.to_csv(output_file, index=False)
    print(f"Simulation Agronomique terminée avec succès ! Lignes: {len(df_augmented)}")

if __name__ == "__main__":
    DATA_DIR = '../data/master_dataset'
    INPUT = f'{DATA_DIR}/Togo_Agriculture_Real_Data.csv'
    OUTPUT = f'{DATA_DIR}/Togo_Agriculture_Augmented_Data.csv'
    
    os.makedirs(DATA_DIR, exist_ok=True)
    augment_with_agronomic_laws(INPUT, OUTPUT, 5000)
