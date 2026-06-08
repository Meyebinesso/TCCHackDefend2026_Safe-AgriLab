"""
Conversion du modèle Random Forest (Pipeline Scikit-Learn) vers ONNX.
Note: L'inférence principale dans l'app Tetou utilise le JSON export (inference JS pure).
L'ONNX est un bonus pour une éventuelle migration vers onnxruntime-react-native.

Auteur: Safe_AgriLab / Hackathon HACK-TECH2026
"""
import joblib
import numpy as np
import os

def convert_to_onnx():
    print("=" * 60)
    print("  CONVERSION DU MODÈLE RANDOM FOREST → ONNX")
    print("=" * 60)
    
    try:
        from skl2onnx import convert_sklearn
        from skl2onnx.common.data_types import StringTensorType, FloatTensorType
    except ImportError:
        print("\n⚠️  skl2onnx n'est pas installé.")
        print("   Installez-le avec: pip install skl2onnx")
        print("   Cette étape est OPTIONNELLE. L'app utilise l'export JSON.")
        return
    
    # Charger le pipeline
    print("\n1. Chargement du modèle pipeline...")
    pipeline = joblib.load('../models/random_forest_model.pkl')
    
    # Définir les types d'entrée
    # Le pipeline attend: Produit (string), Indice_Stress (float), RH2M (float), GWETROOT (float)
    initial_types = [
        ('Produit', StringTensorType([None, 1])),
        ('Indice_Stress_Climatique', FloatTensorType([None, 1])),
        ('RH2M', FloatTensorType([None, 1])),
        ('GWETROOT', FloatTensorType([None, 1]))
    ]
    
    print("2. Conversion en ONNX...")
    try:
        onnx_model = convert_sklearn(
            pipeline,
            initial_types=initial_types,
            target_opset=12,
            options={id(pipeline): {'zipmap': False}}
        )
        
        os.makedirs('../models', exist_ok=True)
        output_path = '../models/random_forest_model.onnx'
        with open(output_path, 'wb') as f:
            f.write(onnx_model.SerializeToString())
        
        file_size = os.path.getsize(output_path)
        print(f"\n✅ ONNX exporté: {output_path} ({file_size/1024:.1f} KB)")
        
    except Exception as e:
        print(f"\n⚠️  Erreur de conversion ONNX: {e}")
        print("   Ce n'est pas bloquant. L'app utilise l'export JSON pour l'inférence.")

if __name__ == '__main__':
    convert_to_onnx()
