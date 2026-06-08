# 🌾 Mofiala (Safe_AgriLab)
### L'Intelligence Artificielle au service des producteurs togolais — 100% autonome et accessible.

[![Status](https://img.shields.io/badge/Status-Hackathon_HACK--TECH2026-orange)](#)
[![Stack](https://img.shields.io/badge/Stack-React_Native_|_Expo_|_Python-blue)](#)
[![Offline](https://img.shields.io/badge/Offline-70%25_Hors--Ligne-green)](#)

**Mofiala** ("Le Conseiller" ou "L'Enseignant" en Éwé) — initialement nommé *Safe_AgriLab* — est une application mobile native d'aide à la décision agricole conçue spécifiquement pour les petits exploitants au Togo. 

L'application intègre un moteur de Machine Learning (Random Forest) embarqué fonctionnant localement sur le téléphone. Elle permet aux agriculteurs d'obtenir des recommandations de cultures optimales et d'anticiper les rendements selon leur sol et le micro-climat, **sans avoir besoin de connexion internet dans leurs champs**.

---

## 🛑 Problématique & Track

* **Track du Hackathon :** Track 1 — Agriculture & Agro-technologie
* **Le défi concret :** 
  Dans les zones rurales du Togo, les agriculteurs travaillent à l'aveugle. Ils manquent d'informations scientifiques sur la santé de leurs sols et font face à un climat de plus en plus instable. Résultat : des récoltes imprévisibles et un "mur de la vente" (cultiver sans savoir si le marché va acheter, entraînant des pertes post-récolte colossales). De plus, **la couverture internet est faible ou inexistante dans les champs**, rendant les solutions cloud classiques inutilisables.

---

## 💡 Notre Solution : Mofiala

Mofiala résout ce problème en combinant la puissance de l'IA et une philosophie **Offline-First (70% des fonctionnalités hors-ligne)** :
1. **Recommandation Intelligente :** L'agriculteur saisit ses paramètres de sol (N, P, K, pH) et l'IA locale lui recommande la culture la plus rentable.
2. **Prédiction de Rendement Météo :** En fonction des prévisions climatiques locales, le modèle de Machine Learning calcule le rendement attendu et prévient des risques de stress hydrique ou thermique.
3. **Assistance Vocale Multilingue :** L'agriculteur peut interagir avec l'application par la voix. Un mode hors-ligne prend en charge le français, tandis qu'une version connectée permet de parler dans les langues locales (Éwé, Kabyè) pour éliminer la barrière de l'analphabétisme.
4. **Visibilité sur le Marché :** Suivi des cours des marchés togolais pour planifier les ventes et sécuriser les revenus avant même de planter.

---

## 🧠 Le Défi Technique : La "Corrélation Fantôme" & L'Indice de Stress

Lors de la phase de R&D (Data Science), nous avons fait face à un problème majeur : la corrélation mathématique directe entre les anomalies climatiques brutes et le rendement des cultures était de **0.00**. L'IA ne parvenait pas à apprendre.

**Notre solution :** Plutôt que de jeter des données brutes au modèle, nous avons créé l'**Indice de Stress Climatique (ISC)**. Cet indice combine et normalise l'écart absolu des températures et des précipitations par rapport aux moyennes historiques du Togo (calculé à partir des données réelles de la NASA POWER et de la FAOSTAT). 
Cette étape de *Feature Engineering* a permis de redonner de la linéarité à nos données. En bridant la profondeur de notre modèle Random Forest (`max_depth=10`), nous avons obtenu un modèle léger, ultra-précis (**R² de 0.89**) et totalement protégé contre le surapprentissage (*overfitting*).

---

## 🧬 Architecture Technique

```mermaid
graph TD
    subgraph Data Science & IA (Python)
        A[FAOSTAT + NASA POWER + BM] --> B[Feature Engineering: Indice de Stress]
        B --> C[Entraînement RandomForestRegressor]
        C --> D[Export du modèle en JSON compact]
    end

    subgraph Application Mobile (React Native / Expo)
        D -->|Intégration Assets| E[Moteur d'inférence JS Offline]
        F[Saisie Agriculteur: voix / manuel] --> E
        E --> G[Recommandation & Prédiction de Rendement]
        H[Firebase Auth / Firestore] -.->|Synchronisation en ligne| I[Profil & Sauvegardes]
    end
```

Le modèle de Machine Learning est traduit en un algorithme d'arbre de décision en pur JavaScript (`mobile_app/src/ai/inference.js`). Il pèse moins de 100 Ko et s'exécute en moins de 2 millisecondes sur le processeur du smartphone, sans aucune requête réseau.

---

## 💻 Prérequis

Pour installer et lancer le projet localement :

### 📱 Partie Mobile (React Native & Expo)
* **Node.js** (version 18 ou supérieure recommandée)
* **npm** ou **yarn**
* Un smartphone avec l'application **Expo Go** installée (disponible sur [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) et [iOS App Store](https://apps.apple.com/app/expo-go/id984023705)) ou un émulateur Android/iOS.

### 🐍 Partie IA (Python - Optionnel, pour réentraîner le modèle)
* **Python 3.10+**
* Les bibliothèques : `pandas`, `numpy`, `scikit-learn`, `nbformat`.

---

## ⚙️ Installation & Lancement

### 1. Cloner le projet
```bash
git clone https://github.com/votre-compte/Safe_AgriLab.git
cd Safe_AgriLab
```

### 2. Lancer l'Application Mobile
1. Rendez-vous dans le dossier de l'application :
   ```bash
   cd mobile_app
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Démarrez le serveur de développement Expo :
   ```bash
   npm start
   ```
4. **Scanner le QR Code** affiché dans le terminal avec l'appareil photo de votre téléphone (iOS) ou via l'application **Expo Go** (Android). L'application se chargera instantanément.

### 3. Exécuter la partie Data Science (Optionnel)
Si vous souhaitez réentraîner le modèle ou voir la démarche scientifique :
```bash
cd ai_core
pip install pandas numpy scikit-learn nbformat
python train_model.py
```
Le script va générer les fichiers du modèle et mettre à jour le notebook d'évaluation.

---

## 🔑 Identifiants de Test (Compte Démo)

L'application utilise l'authentification Firebase liée aux numéros de téléphone des producteurs. 

* **Pour vous inscrire :** Vous pouvez créer un compte directement dans l'application en saisissant n'importe quel numéro de téléphone à 8 chiffres de votre choix (ex: `90123456`) et un mot de passe (minimum 6 caractères).
* **Compte de test préconfiguré :**
  * **Numéro de téléphone :** `90000000`
  * **Mot de passe :** `password123`

*(Note : Si vous êtes hors-ligne lors du premier lancement, l'application utilise un profil invité local automatique pour que l'agriculteur ne soit jamais bloqué).*

---

## 👥 L'Équipe

Nous sommes une équipe complémentaire unie pour transformer l'agriculture togolaise :

* **DJANTA Samuel** — *Chef de groupe & Développeur Web*
* **KAMBIA Irénée** — *Leader Technique, Spécialiste Intelligence Artificielle & Big Data*
* **DJANTA Jean** — *Ingénieur en Sciences de l'Ingénieur & Intégration Matériel*

---
*Fait avec passion pendant le Hackathon HACK-TECH2026. 🇹🇬*
