/**
 * database.js — Service de base de données SQLite
 * 
 * Gère la persistance locale des prédictions et des favoris
 * en utilisant l'API moderne expo-sqlite (SDK 52+).
 * 
 * @module services/database
 * @author Safe_AgriLab
 */

import * as SQLite from 'expo-sqlite';

// ─────────────────────────────────────────────
// Instance de la base de données
// ─────────────────────────────────────────────

/** Base de données SQLite synchrone */
let db = null;

/**
 * Obtient l'instance de la base de données, la crée si nécessaire.
 * 
 * @returns {SQLiteDatabase} Instance de la base de données
 */
function getDatabase() {
  if (!db) {
    db = SQLite.openDatabaseSync('tetou.db');
  }
  return db;
}

// ─────────────────────────────────────────────
// Initialisation
// ─────────────────────────────────────────────

/**
 * Initialise la base de données : crée les tables si elles n'existent pas.
 * Doit être appelé au démarrage de l'application.
 * 
 * Tables créées :
 * - predictions : historique des prédictions de rendement
 * - favorites : cultures favorites de l'utilisateur
 */
export function initDatabase() {
  const database = getDatabase();

  try {
    // Activer le mode WAL pour de meilleures performances
    database.execSync('PRAGMA journal_mode = WAL;');

    // Table des prédictions
    database.execSync(`
      CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        culture TEXT NOT NULL,
        culture_display TEXT NOT NULL,
        rendement REAL NOT NULL,
        stress_index REAL NOT NULL,
        rh2m REAL NOT NULL,
        gwetroot REAL NOT NULL,
        niveau TEXT NOT NULL,
        conseil TEXT,
        temperature REAL,
        rainfall REAL,
        soil_moisture REAL,
        date TEXT NOT NULL
      );
    `);

    // Table des favoris
    database.execSync(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        culture_id TEXT UNIQUE NOT NULL
      );
    `);

    // Index pour accélérer les requêtes fréquentes
    database.execSync(`
      CREATE INDEX IF NOT EXISTS idx_predictions_date ON predictions(date DESC);
    `);
    database.execSync(`
      CREATE INDEX IF NOT EXISTS idx_predictions_culture ON predictions(culture);
    `);

    console.log('[Database] Base de données initialisée avec succès');
  } catch (error) {
    console.error('[Database] Erreur d\'initialisation :', error.message);
    throw new Error(`Impossible d'initialiser la base de données : ${error.message}`);
  }
}

// ─────────────────────────────────────────────
// Prédictions — CRUD
// ─────────────────────────────────────────────

/**
 * Enregistre une nouvelle prédiction dans l'historique.
 * 
 * @param {Object} data - Données de la prédiction
 * @param {string} data.culture - Nom FAOSTAT de la culture
 * @param {string} data.cultureDisplay - Nom d'affichage de la culture
 * @param {number} data.rendement - Rendement prédit (kg/ha)
 * @param {number} data.stressIndex - Indice de stress climatique
 * @param {number} data.rh2m - Humidité relative (%)
 * @param {number} data.gwetroot - Humidité racinaire du sol
 * @param {string} data.niveau - Niveau de rendement ('bon', 'moyen', 'critique')
 * @param {string} [data.conseil] - Conseil agricole associé
 * @param {number} [data.temperature] - Température saisie (°C)
 * @param {number} [data.rainfall] - Précipitations saisies (mm/mois)
 * @param {number} [data.soilMoisture] - Humidité du sol saisie (%)
 * @returns {number} ID de la prédiction insérée
 */
export function savePrediction(data) {
  const database = getDatabase();
  const now = new Date().toISOString();

  try {
    const result = database.runSync(
      `INSERT INTO predictions 
        (culture, culture_display, rendement, stress_index, rh2m, gwetroot, niveau, conseil, temperature, rainfall, soil_moisture, date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.culture,
        data.cultureDisplay || data.culture,
        data.rendement,
        data.stressIndex,
        data.rh2m,
        data.gwetroot,
        data.niveau,
        data.conseil || null,
        data.temperature || null,
        data.rainfall || null,
        data.soilMoisture || null,
        now,
      ]
    );

    console.log(`[Database] Prédiction enregistrée (ID: ${result.lastInsertRowId})`);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('[Database] Erreur d\'enregistrement :', error.message);
    throw new Error(`Impossible d'enregistrer la prédiction : ${error.message}`);
  }
}

/**
 * Récupère les prédictions récentes avec pagination.
 * 
 * @param {number} [limit=20] - Nombre maximum de résultats
 * @param {number} [offset=0] - Décalage pour la pagination
 * @returns {Object[]} Tableau de prédictions triées par date décroissante
 */
export function getPredictions(limit = 20, offset = 0) {
  const database = getDatabase();

  try {
    const rows = database.getAllSync(
      `SELECT * FROM predictions ORDER BY date DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return rows.map(formatPredictionRow);
  } catch (error) {
    console.error('[Database] Erreur de lecture :', error.message);
    return [];
  }
}

/**
 * Récupère les prédictions filtrées par culture.
 * 
 * @param {string} cultureName - Nom FAOSTAT de la culture
 * @param {number} [limit=20] - Nombre maximum de résultats
 * @returns {Object[]} Tableau de prédictions pour cette culture
 */
export function getPredictionsByCulture(cultureName, limit = 20) {
  const database = getDatabase();

  try {
    const rows = database.getAllSync(
      `SELECT * FROM predictions WHERE culture = ? ORDER BY date DESC LIMIT ?`,
      [cultureName, limit]
    );

    return rows.map(formatPredictionRow);
  } catch (error) {
    console.error('[Database] Erreur de lecture par culture :', error.message);
    return [];
  }
}

/**
 * Récupère une prédiction par son ID.
 * 
 * @param {number} id - ID de la prédiction
 * @returns {Object|null} La prédiction ou null
 */
export function getPredictionById(id) {
  const database = getDatabase();

  try {
    const row = database.getFirstSync(
      `SELECT * FROM predictions WHERE id = ?`,
      [id]
    );

    return row ? formatPredictionRow(row) : null;
  } catch (error) {
    console.error('[Database] Erreur de lecture par ID :', error.message);
    return null;
  }
}

/**
 * Supprime une prédiction par son ID.
 * 
 * @param {number} id - ID de la prédiction
 * @returns {boolean} true si la suppression a réussi
 */
export function deletePrediction(id) {
  const database = getDatabase();

  try {
    const result = database.runSync(
      `DELETE FROM predictions WHERE id = ?`,
      [id]
    );

    return result.changes > 0;
  } catch (error) {
    console.error('[Database] Erreur de suppression :', error.message);
    return false;
  }
}

/**
 * Formate une ligne brute de la base de données en objet structuré.
 * 
 * @param {Object} row - Ligne brute SQLite
 * @returns {Object} Objet formaté avec des noms de propriétés en camelCase
 */
function formatPredictionRow(row) {
  return {
    id: row.id,
    culture: row.culture,
    cultureDisplay: row.culture_display,
    rendement: row.rendement,
    stressIndex: row.stress_index,
    rh2m: row.rh2m,
    gwetroot: row.gwetroot,
    niveau: row.niveau,
    conseil: row.conseil,
    temperature: row.temperature,
    rainfall: row.rainfall,
    soilMoisture: row.soil_moisture,
    date: row.date,
  };
}

// ─────────────────────────────────────────────
// Statistiques
// ─────────────────────────────────────────────

/**
 * Calcule les statistiques globales des prédictions.
 * 
 * @returns {{
 *   totalPredictions: number,
 *   averageYield: number,
 *   culturesAnalyzed: number,
 *   bestCulture: string|null,
 *   lastPredictionDate: string|null,
 *   niveauDistribution: { bon: number, moyen: number, critique: number }
 * }}
 */
export function getStats() {
  const database = getDatabase();

  try {
    // Nombre total de prédictions
    const countRow = database.getFirstSync(
      `SELECT COUNT(*) as total FROM predictions`
    );
    const totalPredictions = countRow?.total || 0;

    if (totalPredictions === 0) {
      return {
        totalPredictions: 0,
        averageYield: 0,
        culturesAnalyzed: 0,
        bestCulture: null,
        lastPredictionDate: null,
        niveauDistribution: { bon: 0, moyen: 0, critique: 0 },
      };
    }

    // Rendement moyen
    const avgRow = database.getFirstSync(
      `SELECT AVG(rendement) as avg_yield FROM predictions`
    );
    const averageYield = Math.round((avgRow?.avg_yield || 0) * 100) / 100;

    // Nombre de cultures distinctes analysées
    const culturesRow = database.getFirstSync(
      `SELECT COUNT(DISTINCT culture) as count FROM predictions`
    );
    const culturesAnalyzed = culturesRow?.count || 0;

    // Meilleure culture (rendement moyen le plus élevé)
    const bestRow = database.getFirstSync(
      `SELECT culture_display, AVG(rendement) as avg_r 
       FROM predictions 
       GROUP BY culture 
       ORDER BY avg_r DESC 
       LIMIT 1`
    );
    const bestCulture = bestRow?.culture_display || null;

    // Date de la dernière prédiction
    const lastRow = database.getFirstSync(
      `SELECT date FROM predictions ORDER BY date DESC LIMIT 1`
    );
    const lastPredictionDate = lastRow?.date || null;

    // Distribution des niveaux
    const niveauRows = database.getAllSync(
      `SELECT niveau, COUNT(*) as count FROM predictions GROUP BY niveau`
    );
    const niveauDistribution = { bon: 0, moyen: 0, critique: 0 };
    niveauRows.forEach(row => {
      if (row.niveau in niveauDistribution) {
        niveauDistribution[row.niveau] = row.count;
      }
    });

    return {
      totalPredictions,
      averageYield,
      culturesAnalyzed,
      bestCulture,
      lastPredictionDate,
      niveauDistribution,
    };
  } catch (error) {
    console.error('[Database] Erreur de calcul des statistiques :', error.message);
    return {
      totalPredictions: 0,
      averageYield: 0,
      culturesAnalyzed: 0,
      bestCulture: null,
      lastPredictionDate: null,
      niveauDistribution: { bon: 0, moyen: 0, critique: 0 },
    };
  }
}

// ─────────────────────────────────────────────
// Favoris
// ─────────────────────────────────────────────

/**
 * Ajoute une culture aux favoris.
 * 
 * @param {string} cultureId - Identifiant court de la culture (ex: 'mais')
 * @returns {boolean} true si l'ajout a réussi
 */
export function addFavorite(cultureId) {
  const database = getDatabase();

  try {
    database.runSync(
      `INSERT OR IGNORE INTO favorites (culture_id) VALUES (?)`,
      [cultureId]
    );

    console.log(`[Database] Favori ajouté : ${cultureId}`);
    return true;
  } catch (error) {
    console.error('[Database] Erreur d\'ajout aux favoris :', error.message);
    return false;
  }
}

/**
 * Retire une culture des favoris.
 * 
 * @param {string} cultureId - Identifiant court de la culture
 * @returns {boolean} true si la suppression a réussi
 */
export function removeFavorite(cultureId) {
  const database = getDatabase();

  try {
    const result = database.runSync(
      `DELETE FROM favorites WHERE culture_id = ?`,
      [cultureId]
    );

    console.log(`[Database] Favori retiré : ${cultureId}`);
    return result.changes > 0;
  } catch (error) {
    console.error('[Database] Erreur de suppression du favori :', error.message);
    return false;
  }
}

/**
 * Vérifie si une culture est dans les favoris.
 * 
 * @param {string} cultureId - Identifiant court de la culture
 * @returns {boolean}
 */
export function isFavorite(cultureId) {
  const database = getDatabase();

  try {
    const row = database.getFirstSync(
      `SELECT id FROM favorites WHERE culture_id = ?`,
      [cultureId]
    );

    return row !== null && row !== undefined;
  } catch (error) {
    console.error('[Database] Erreur de vérification du favori :', error.message);
    return false;
  }
}

/**
 * Récupère la liste des cultures favorites.
 * 
 * @returns {string[]} Tableau d'identifiants de cultures favorites
 */
export function getFavorites() {
  const database = getDatabase();

  try {
    const rows = database.getAllSync(
      `SELECT culture_id FROM favorites ORDER BY id ASC`
    );

    return rows.map(row => row.culture_id);
  } catch (error) {
    console.error('[Database] Erreur de lecture des favoris :', error.message);
    return [];
  }
}

// ─────────────────────────────────────────────
// Maintenance
// ─────────────────────────────────────────────

/**
 * Supprime tout l'historique des prédictions.
 * Les favoris ne sont PAS affectés.
 * 
 * @returns {number} Nombre de prédictions supprimées
 */
export function clearHistory() {
  const database = getDatabase();

  try {
    const result = database.runSync(`DELETE FROM predictions`);
    console.log(`[Database] Historique vidé : ${result.changes} prédictions supprimées`);
    return result.changes;
  } catch (error) {
    console.error('[Database] Erreur de suppression de l\'historique :', error.message);
    return 0;
  }
}

/**
 * Supprime tous les favoris.
 * 
 * @returns {number} Nombre de favoris supprimés
 */
export function clearFavorites() {
  const database = getDatabase();

  try {
    const result = database.runSync(`DELETE FROM favorites`);
    console.log(`[Database] Favoris vidés : ${result.changes} favoris supprimés`);
    return result.changes;
  } catch (error) {
    console.error('[Database] Erreur de suppression des favoris :', error.message);
    return 0;
  }
}

/**
 * Ferme proprement la connexion à la base de données.
 * Appeler lors de la fermeture de l'application.
 */
export function closeDatabase() {
  if (db) {
    try {
      db.closeSync();
      db = null;
      console.log('[Database] Base de données fermée');
    } catch (error) {
      console.error('[Database] Erreur de fermeture :', error.message);
    }
  }
}
