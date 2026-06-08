// src/ai/stressCalculator.js

// Les moyennes nationales du dataset pour le calcul des anomalies
const MEAN_T2M = 25.96;
const MEAN_PRECIP_DAILY = 4.36; // Moyenne par jour

/**
 * Convertit les valeurs des sliders météo en features pour le modèle IA
 * 
 * @param {number} temperature - Température moyenne (°C) [20 - 40]
 * @param {number} rainfall - Pluviométrie mensuelle (mm) [0 - 300]
 * @param {number} soilMoisture - Humidité du sol en pourcentage (%) [0 - 100]
 * @returns {Object} - Features prêts pour l'inférence
 */
export function calculateStressFeatures(temperature, rainfall, soilMoisture) {
  // 1. Calcul des anomalies
  const anomalyTemp = temperature - MEAN_T2M;
  
  // Pluie mensuelle (mm/mois) -> Pluie journalière (mm/jour) puis anomalie
  const rainfallDaily = rainfall / 30.0;
  const anomalyPrecip = rainfallDaily - MEAN_PRECIP_DAILY;
  
  // 2. Calcul de l'Indice de Stress Climatique (Formule du Notebook)
  // Indice_Stress = 0.000004 * Anomalie_Precip^2 + 0.05 * Anomalie_T2M^2
  let stressIndex = (0.000004 * Math.pow(anomalyPrecip, 2)) + (0.05 * Math.pow(anomalyTemp, 2));
  
  // On limite l'indice pour éviter des valeurs extrêmes aberrantes (max observé: 1.7)
  stressIndex = Math.min(Math.max(stressIndex, 0), 2.0);
  
  // 3. Calcul de GWETROOT (Humidité au niveau des racines)
  // Le modèle attend une valeur entre 0.53 et 0.77. On mappe le pourcentage 0-100% sur cette plage.
  const minGwet = 0.53;
  const maxGwet = 0.77;
  const gwetroot = (soilMoisture / 100.0) * (maxGwet - minGwet) + minGwet;
  
  // 4. Calcul de RH2M (Humidité relative de l'air à 2m)
  // Estimation basique: l'humidité baisse quand la temp monte, et monte quand il pleut.
  // Moyenne de RH2M = 77.28
  let rh2m = 77.28 - (anomalyTemp * 0.5) + (anomalyPrecip * 0.1);
  rh2m = Math.min(Math.max(rh2m, 70.0), 85.0); // Bornes réalistes
  
  return {
    stressIndex: Number(stressIndex.toFixed(6)),
    rh2m: Number(rh2m.toFixed(2)),
    gwetroot: Number(gwetroot.toFixed(4))
  };
}

/**
 * Traduit l'indice de stress en niveau textuel (pour l'UI)
 */
export function getStressLevelText(stressIndex) {
  if (stressIndex < 0.05) return 'Faible (Idéal)';
  if (stressIndex < 0.15) return 'Moyen';
  if (stressIndex < 0.5) return 'Élevé';
  return 'Critique';
}
