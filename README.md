# 🌾 Safe_AgriLab : L'Intelligence Décisionnelle pour la Chaîne de Valeur Agricole

![Status](https://img.shields.io/badge/Status-En_Développement_(Hackathon)-orange)
![Phase](https://img.shields.io/badge/Phase-1_CRISP--DM-blue)
![AI](https://img.shields.io/badge/IA-Machine_Learning_(RandomForest)-brightgreen)
![Mobile](https://img.shields.io/badge/App-Flutter_(Hors--Ligne)-blue)

> **Projet Hackathon 72h** visant à révolutionner l'agriculture rurale en connectant intelligemment la terre au marché, **sans nécessiter de connexion internet sur le terrain**.

---

## 🛑 La Problématique (Le "Pourquoi")
Dans les zones rurales, l'agriculture reste une activité à haut risque et peu rentable pour deux raisons majeures :
1. **L'Opacité Agronomique :** Les agriculteurs manquent de données précises sur la santé de leurs sols (N, P, K, pH) ou les variations climatiques, entraînant des rendements faibles et une perte de ressources.
2. **L'Incertitude Commerciale (Le "Mur de la vente") :** Produire est une chose, vendre en est une autre. Cultiver sans visibilité sur la demande du marché conduit à des pertes post-récolte massives et à la précarité financière.

## 💡 Notre Solution
**Safe_AgriLab** est une plateforme d'Intelligence Artificielle "End-to-End" embarquée dans une application mobile 100% autonome (hors-ligne).
- 🚜 **Volet Agronomique :** Le moteur IA analyse les paramètres du sol et de la météo pour recommander la culture la plus optimale (Garantie de rendement).
- 📈 **Volet Marché :** Analyse prédictive des tendances et fixation des prix pour garantir un profit avant même de planter (Briser le mur de la vente).

### ✨ Points Forts & Innovation
- **100% Hors-Ligne (Offline First) :** L'IA est directement intégrée dans le téléphone (via Flutter et modèles exportés). Aucune connexion requise après le téléchargement initial.
- **Approche End-to-End :** De la graine jusqu'à la vente, toute la chaîne de valeur est optimisée.
- **Souveraineté Alimentaire :** Sécuriser les revenus encourage la production locale.

---

## 🧬 Architecture Technique
Notre projet est divisé en deux grandes phases :
1. **L'Intelligence Artificielle (Core) :** Entraînement de modèles de Machine Learning (Random Forest Classifier & Regressor) en Python via Scikit-Learn avec des jeux de données locaux et internationaux.
2. **L'Application Mobile :** Application Flutter qui exécute les modèles de prédiction de manière native via traduction en Dart (`m2cgen`) ou TFLite.

---

## 📊 Méthodologie CRISP-DM (Le Sprint de 72h)

Nous appliquons de manière rigoureuse la norme de l'industrie **CRISP-DM** :

- [x] **1. Compréhension Métier :** Maximiser le rendement et sécuriser la vente finale.
- [ ] **2. Compréhension des Données :** *[EN COURS]* Collecte des données réelles du Togo (ANAMET, Ministère de l'Agriculture, INSEED, Banque Mondiale, NASA POWER).
- [ ] **3. Préparation des Données :** Nettoyage, fusion des sources réelles et traitement des valeurs manquantes.
- [ ] **4. Modélisation :** Entraînement des modèles Random Forest pour l'agronomie et le marché.
- [ ] **5. Évaluation :** Vérification de la précision des modèles (actuellement 93% sur les données de tests simulées en attendant l'intégration finale des vraies données).
- [ ] **6. Déploiement :** Intégration de l'IA dans l'App Flutter et compilation Android (.apk).

---

## 👥 L'Équipe
- **Sam** : Stratégie & Data Sourcing (Ministère de l'Agriculture TG, OpenDataAfrica)
- **Irénée** : Climatologie & Macro-économie (ANAMET Togo, Banque Mondiale)
- **Jean** : Statistiques & Marché (INSEED, FAOSTAT)
- **[Votre Nom / Rôle]** : Intégration technique et Modélisation IA

---
*Ce dépôt est mis à jour en continu durant le Hackathon.*
