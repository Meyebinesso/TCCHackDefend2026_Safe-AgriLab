import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import os

def train_and_save_model():
    print("Chargement des données augmentées...")
    df = pd.read_csv('../data/master_dataset/Togo_Agriculture_Augmented_Data.csv')
    
    # Nos features magiques
    # On utilise Produit (OneHot), Indice_Stress_Climatique, RH2M, et GWETROOT
    features = ['Produit', 'Indice_Stress_Climatique', 'RH2M', 'GWETROOT']
    target = 'Rendement_kg_ha'
    
    X = df[features]
    y = df[target]
    
    # Split Train/Test (80% / 20%)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Preprocessing : OneHotEncoding pour le nom de la culture
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['Produit'])
        ],
        remainder='passthrough'
    )
    
    # Modèle avec protection contre l'overfitting (max_depth=10, min_samples_leaf=5)
    model = RandomForestRegressor(
        n_estimators=100, 
        max_depth=10, 
        min_samples_leaf=5, 
        random_state=42,
        n_jobs=-1
    )
    
    # Pipeline
    pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                               ('model', model)])
    
    print("Entraînement de l'Intelligence Artificielle (Random Forest)...")
    pipeline.fit(X_train, y_train)
    
    # Évaluation
    print("\n--- Évaluation du Modèle ---")
    y_pred_train = pipeline.predict(X_train)
    y_pred_test = pipeline.predict(X_test)
    
    r2_train = r2_score(y_train, y_pred_train)
    r2_test = r2_score(y_test, y_pred_test)
    mae_test = mean_absolute_error(y_test, y_pred_test)
    
    print(f"R² Score (Train) : {r2_train:.4f}")
    print(f"R² Score (Test)  : {r2_test:.4f}")
    print(f"Mean Absolute Error (Test) : {mae_test:.2f} kg/ha")
    
    # Si R² Test est proche de R² Train, c'est qu'il n'y a pas de surapprentissage !
    
    # Sauvegarde
    os.makedirs('../models', exist_ok=True)
    joblib.dump(pipeline, '../models/random_forest_model.pkl')
    print("\nModèle sauvegardé avec succès dans 'models/random_forest_model.pkl' !")

if __name__ == "__main__":
    train_and_save_model()
