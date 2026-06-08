// src/ai/inference.js
// Moteur d'inférence Random Forest 100% JavaScript (Offline)

// Chargement du modèle JSON statique depuis les assets
const modelData = require('../../assets/data/model.json');

class RandomForestInference {
  constructor(model) {
    this.model = model;
    this.categories = model.categories;
    this.n_features = model.n_features_total;
    this.trees = model.trees;
    this.mean_yields = model.mean_yields;
  }

  /**
   * Prédit le rendement pour une culture et des conditions météo
   * @param {string} cultureName - Nom FAOSTAT de la culture (ex: 'Ignames')
   * @param {number} stressIndex - Indice de stress calculé
   * @param {number} rh2m - Humidité relative air
   * @param {number} gwetroot - Humidité sol
   * @returns {Object} - Résultat de la prédiction
   */
  predict(cultureName, stressIndex, rh2m, gwetroot) {
    // 1. Construire le vecteur de features (39 entrées)
    // Les 36 premières sont le OneHotEncoder de la culture
    // Les 3 dernières sont: stressIndex, rh2m, gwetroot
    const features = new Array(this.n_features).fill(0.0);
    
    // OneHot Encoding
    const cultureIndex = this.categories.indexOf(cultureName);
    if (cultureIndex !== -1) {
      features[cultureIndex] = 1.0;
    }
    
    // Valeurs numériques
    const numStart = this.model.feature_order.numeric_start_index; // 36
    features[numStart] = stressIndex;
    features[numStart + 1] = rh2m;
    features[numStart + 2] = gwetroot;
    
    // 2. Parcourir tous les arbres de décision
    let sumPredictions = 0;
    
    for (let i = 0; i < this.trees.length; i++) {
      const tree = this.trees[i];
      let node = 0; // Commencer à la racine
      
      // Tant qu'on n'est pas sur une feuille (feature != -2)
      while (tree.f[node] !== -2) {
        const featureIdx = tree.f[node];
        const threshold = tree.t[node];
        
        if (features[featureIdx] <= threshold) {
          node = tree.l[node]; // Aller à gauche
        } else {
          node = tree.r[node]; // Aller à droite
        }
      }
      
      // Ajouter la valeur de la feuille
      sumPredictions += tree.v[node];
    }
    
    // 3. Moyenne de tous les arbres
    const rendement = sumPredictions / this.trees.length;
    
    // 4. Calculer les pourcentages par rapport à la moyenne nationale
    const moyenneNationale = this.mean_yields[cultureName] || rendement;
    let pourcentageMoyenne = 100;
    if (moyenneNationale > 0) {
      pourcentageMoyenne = (rendement / moyenneNationale) * 100;
    }
    
    // 5. Définir le niveau de qualité (Bon, Moyen, Critique)
    let niveau = 'moyen';
    if (pourcentageMoyenne >= 80) niveau = 'bon';
    else if (pourcentageMoyenne < 50) niveau = 'critique';
    
    return {
      rendement: Math.round(rendement),
      moyenneNationale: Math.round(moyenneNationale),
      pourcentageMoyenne: Math.round(pourcentageMoyenne),
      niveau,
      stressIndex
    };
  }
}

// Exporter une instance prête à l'emploi
export const AI_Engine = new RandomForestInference(modelData);
