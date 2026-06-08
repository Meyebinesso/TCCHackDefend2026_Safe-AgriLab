"""
Export du modèle Random Forest (Pipeline Scikit-Learn) vers JSON
pour inférence JavaScript pure dans l'app mobile Tetou.

Auteur: Safe_AgriLab / Hackathon HACK-TECH2026
"""
import joblib
import json
import numpy as np
import pandas as pd
import os

def export_model_to_json():
    print("=" * 60)
    print("  EXPORT DU MODÈLE RANDOM FOREST → JSON")
    print("  Pour inférence JavaScript dans l'app Tetou")
    print("=" * 60)
    
    # Charger le pipeline
    print("\n1. Chargement du modèle pipeline...")
    pipeline = joblib.load('../models/random_forest_model.pkl')
    preprocessor = pipeline.named_steps['preprocessor']
    model = pipeline.named_steps['model']
    
    # Extraire les catégories OneHotEncoder
    print("2. Extraction des catégories OneHotEncoder...")
    ohe = preprocessor.transformers_[0][1]
    categories = ohe.categories_[0].tolist()
    print(f"   → {len(categories)} cultures trouvées")
    
    # Extraire les arbres de décision
    print(f"3. Extraction de {model.n_estimators} arbres de décision...")
    trees = []
    total_nodes = 0
    for i, estimator in enumerate(model.estimators_):
        tree = estimator.tree_
        total_nodes += tree.node_count
        trees.append({
            'n': tree.node_count,
            'l': tree.children_left.tolist(),    # left children
            'r': tree.children_right.tolist(),    # right children
            'f': tree.feature.tolist(),           # feature index
            't': tree.threshold.tolist(),         # threshold
            'v': [round(v[0][0], 2) for v in tree.value.tolist()]  # prediction values
        })
    print(f"   → {total_nodes} nœuds totaux extraits")
    
    # Calculer les rendements moyens par culture (pour le % national)
    print("4. Calcul des rendements moyens par culture...")
    df = pd.read_csv('../data/master_dataset/Togo_Agriculture_Augmented_Data.csv')
    mean_yields = {}
    for culture in categories:
        culture_data = df[df['Produit'] == culture]['Rendement_kg_ha']
        if len(culture_data) > 0:
            mean_yields[culture] = round(culture_data.mean(), 2)
        else:
            mean_yields[culture] = 0
    
    # Calculer les stats des features pour normalisation / sliders
    print("5. Calcul des statistiques des features...")
    feature_stats = {
        'RH2M': {
            'min': round(df['RH2M'].min(), 2),
            'max': round(df['RH2M'].max(), 2),
            'mean': round(df['RH2M'].mean(), 2),
            'std': round(df['RH2M'].std(), 2)
        },
        'GWETROOT': {
            'min': round(df['GWETROOT'].min(), 4),
            'max': round(df['GWETROOT'].max(), 4),
            'mean': round(df['GWETROOT'].mean(), 4),
            'std': round(df['GWETROOT'].std(), 4)
        },
        'Indice_Stress_Climatique': {
            'min': round(df['Indice_Stress_Climatique'].min(), 6),
            'max': round(df['Indice_Stress_Climatique'].max(), 6),
            'mean': round(df['Indice_Stress_Climatique'].mean(), 6),
            'std': round(df['Indice_Stress_Climatique'].std(), 6),
            'q25': round(df['Indice_Stress_Climatique'].quantile(0.25), 6),
            'q75': round(df['Indice_Stress_Climatique'].quantile(0.75), 6)
        },
        'T2M': {
            'min': round(df['T2M'].min(), 2),
            'max': round(df['T2M'].max(), 2),
            'mean': round(df['T2M'].mean(), 2)
        },
        'PRECTOTCORR': {
            'min': round(df['PRECTOTCORR'].min(), 2),
            'max': round(df['PRECTOTCORR'].max(), 2),
            'mean': round(df['PRECTOTCORR'].mean(), 2)
        },
        'Rendement_kg_ha': {
            'min': round(df['Rendement_kg_ha'].min(), 2),
            'max': round(df['Rendement_kg_ha'].max(), 2),
            'mean': round(df['Rendement_kg_ha'].mean(), 2)
        }
    }
    
    # Assembler le JSON final
    model_json = {
        'version': '1.0.0',
        'app': 'Tetou',
        'team': 'Safe_AgriLab',
        'model_type': 'RandomForestRegressor',
        'categories': categories,
        'n_categories': len(categories),
        'n_features_total': model.n_features_in_,
        'n_estimators': len(trees),
        'feature_order': {
            'description': 'Les 36 premières features sont le OneHot de Produit, puis 3 features numériques',
            'numeric_features': ['Indice_Stress_Climatique', 'RH2M', 'GWETROOT'],
            'numeric_start_index': len(categories)
        },
        'trees': trees,
        'mean_yields': mean_yields,
        'feature_stats': feature_stats
    }
    
    # Sauvegarder
    os.makedirs('../models', exist_ok=True)
    output_path = '../models/random_forest_model.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(model_json, f, ensure_ascii=False)
    
    file_size = os.path.getsize(output_path)
    print(f"\n{'=' * 60}")
    print(f"  ✅ MODÈLE EXPORTÉ AVEC SUCCÈS !")
    print(f"  📁 Fichier : {output_path}")
    print(f"  📏 Taille  : {file_size / 1024:.1f} KB ({file_size / (1024*1024):.2f} MB)")
    print(f"  🌾 Cultures: {len(categories)}")
    print(f"  🌳 Arbres  : {len(trees)}")
    print(f"  📊 Nœuds   : {total_nodes}")
    print(f"{'=' * 60}")
    
    # Vérification : prédictions de référence
    print("\n6. Vérifications de cohérence (Python vs futur JS)...")
    test_cases = [
        {'Produit': 'Maïs', 'Indice_Stress_Climatique': 0.08, 'RH2M': 77.0, 'GWETROOT': 0.66},
        {'Produit': 'Ignames', 'Indice_Stress_Climatique': 0.02, 'RH2M': 78.0, 'GWETROOT': 0.70},
        {'Produit': 'Riz', 'Indice_Stress_Climatique': 0.50, 'RH2M': 75.0, 'GWETROOT': 0.55},
        {'Produit': 'Manioc, frais', 'Indice_Stress_Climatique': 0.15, 'RH2M': 77.5, 'GWETROOT': 0.65},
    ]
    
    reference_predictions = {}
    for tc in test_cases:
        test_df = pd.DataFrame([tc])
        pred = pipeline.predict(test_df)[0]
        culture = tc['Produit']
        reference_predictions[culture] = round(pred, 2)
        stress_level = "🟢 Bon" if tc['Indice_Stress_Climatique'] < 0.05 else ("🟡 Moyen" if tc['Indice_Stress_Climatique'] < 0.15 else "🔴 Critique")
        print(f"   {culture:20s} | Stress: {tc['Indice_Stress_Climatique']:.2f} ({stress_level}) | Rendement: {pred:,.0f} kg/ha")
    
    # Sauvegarder les prédictions de référence pour vérification côté JS
    ref_path = '../models/reference_predictions.json'
    with open(ref_path, 'w', encoding='utf-8') as f:
        json.dump(reference_predictions, f, ensure_ascii=False, indent=2)
    print(f"\n   Prédictions de référence sauvegardées dans {ref_path}")
    
    print(f"\n{'=' * 60}")
    print(f"  🎉 PRÊT POUR L'APP MOBILE TETOU !")
    print(f"{'=' * 60}")

if __name__ == '__main__':
    export_model_to_json()
