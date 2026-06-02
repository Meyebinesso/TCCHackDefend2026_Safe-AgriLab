# Sources de Données - Safe_AgriLab

Ce fichier centralise l'ensemble des sources de données récoltées par l'équipe pour l'entraînement de nos modèles d'IA.

## Répartition de l'équipe (Sources Locales et Internationales)

### SAM
- [Ministère de l'Agriculture du Togo](https://agriculture.gouv.tg/)
- [Data Portal for Africa](https://dataportal.opendataforafrica.org/)

### IRENEE
- [ANAMET Togo (Agence Nationale de la Météorologie)](https://anamet.tg/)
- [Banque Mondiale - Données Agricoles](https://data.worldbank.org/)

### JEAN
- [INSEED Togo (Institut National de la Statistique et des Etudes Economiques et Démographiques)](https://inseed.tg/)
- [FAOSTAT (Food and Agriculture Organization of the United Nations)](https://www.fao.org/faostat/en/#home)

## Sources Additionnelles Suggérées (Pour Data Generation & Features)
- **Kaggle Crop Recommendation Datasets :** Modèles de sols mondiaux (N, P, K, pH) pour pré-entraîner le modèle sur des comportements de cultures.
- **NASA POWER :** Données climatiques et météorologiques historiques mondiales pour compléter ANAMET.
- **OpenWeatherMap :** (Non utilisé en production hors-ligne, mais utile pour collecter des données d'entraînement).

*Note: En attendant l'extraction complète des CSV par l'équipe, nous utiliserons des scripts Python pour générer des données synthétiques basées sur les plages de valeurs réelles de ces sources.*
