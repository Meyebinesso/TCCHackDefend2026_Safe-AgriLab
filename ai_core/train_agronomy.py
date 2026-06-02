import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

DATA_PATH = "../data/agronomy_dataset.csv"
MODEL_DIR = "../model"
MODEL_PATH = os.path.join(MODEL_DIR, "agronomy_rf_model.pkl")

def train_model():
    print(f"Chargement des données depuis {DATA_PATH}...")
    try:
        df = pd.read_csv(DATA_PATH)
    except FileNotFoundError:
        print("Erreur: Le fichier dataset n'existe pas. Veuillez lancer data_generator_agronomy.py d'abord.")
        return

    # Séparation des features (X) et de la target (y)
    X = df[['N_azote', 'P_phosphore', 'K_potassium', 'pH', 'temperature_C', 'humidite_pourcentage', 'precipitations_mm']]
    y = df['culture_recommandee']

    # Split train/test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Entraînement du modèle RandomForestClassifier...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)

    print("Évaluation du modèle...")
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Précision (Accuracy) : {acc * 100:.2f}%\n")
    print("Rapport de classification :")
    print(classification_report(y_test, y_pred))

    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)

    print(f"Sauvegarde du modèle dans {MODEL_PATH}...")
    joblib.dump(clf, MODEL_PATH)
    print("Entraînement terminé avec succès !")

if __name__ == "__main__":
    train_model()
