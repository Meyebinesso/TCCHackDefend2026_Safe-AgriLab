import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

DATA_PATH = "../data/market_dataset.csv"
MODEL_DIR = "../model"
MODEL_PATH = os.path.join(MODEL_DIR, "market_rf_model.pkl")

def train_model():
    print(f"Chargement des données depuis {DATA_PATH}...")
    try:
        df = pd.read_csv(DATA_PATH)
    except FileNotFoundError:
        print("Erreur: dataset introuvable.")
        return

    # Encodage One-Hot pour la culture (variable catégorielle)
    df_encoded = pd.get_dummies(df, columns=['culture'])
    
    # Variables prédictives : mois, demande estimée, et la culture encodée
    features = [col for col in df_encoded.columns if col not in ['date', 'prix_fcfa_kg']]
    
    X = df_encoded[features]
    y = df_encoded['prix_fcfa_kg']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Entraînement du RandomForestRegressor (Prédiction de prix)...")
    reg = RandomForestRegressor(n_estimators=100, random_state=42)
    reg.fit(X_train, y_train)

    print("Évaluation du modèle...")
    y_pred = reg.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Erreur Absolue Moyenne (MAE) : {mae:.2f} FCFA")
    print(f"Score R2 : {r2:.4f}")

    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)

    print(f"Sauvegarde du modèle dans {MODEL_PATH}...")
    
    # Pour le modèle marché, il faut aussi sauvegarder les noms des colonnes (features)
    # car l'encodage One-Hot crée de nouvelles colonnes.
    model_data = {
        'model': reg,
        'features': features
    }
    joblib.dump(model_data, MODEL_PATH)
    print("Entraînement terminé avec succès !")

if __name__ == "__main__":
    train_model()
