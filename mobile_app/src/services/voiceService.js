/**
 * voiceService.js — Service d'interaction vocale
 * 
 * Gère la synthèse vocale (TTS) via expo-speech et l'analyse
 * de commandes vocales en français pour l'application Tetou.
 * 
 * @module services/voiceService
 * @author Safe_AgriLab
 */

import * as Speech from 'expo-speech';

// ─────────────────────────────────────────────
// Dictionnaire de synonymes vocaux → noms FAOSTAT
// ─────────────────────────────────────────────

/**
 * Mapping des termes oraux courants vers les noms FAOSTAT exacts.
 * Un agriculteur peut dire "igname" ou "l'igname", le système doit
 * reconnaître la culture correcte.
 */
const CULTURE_SYNONYMS = {
  // Céréales
  'mais': 'Maïs',
  'maïs': 'Maïs',
  'le mais': 'Maïs',
  'le maïs': 'Maïs',
  'du mais': 'Maïs',
  'du maïs': 'Maïs',
  'riz': 'Riz',
  'le riz': 'Riz',
  'du riz': 'Riz',
  'sorgho': 'Sorgho',
  'le sorgho': 'Sorgho',
  'du sorgho': 'Sorgho',
  'mil': 'Mils',
  'mils': 'Mils',
  'le mil': 'Mils',
  'du mil': 'Mils',
  'petit mil': 'Mils',
  'fonio': 'Fonio',
  'le fonio': 'Fonio',
  'du fonio': 'Fonio',

  // Tubercules
  'igname': 'Ignames',
  'ignames': 'Ignames',
  'l\'igname': 'Ignames',
  'les ignames': 'Ignames',
  'des ignames': 'Ignames',
  'manioc': 'Manioc, frais',
  'le manioc': 'Manioc, frais',
  'du manioc': 'Manioc, frais',
  'patate douce': 'Patates douces',
  'patates douces': 'Patates douces',
  'les patates': 'Patates douces',
  'taro': 'Taro',
  'le taro': 'Taro',
  'du taro': 'Taro',

  // Légumineuses
  'haricot': 'Haricots secs',
  'haricots': 'Haricots secs',
  'les haricots': 'Haricots secs',
  'des haricots': 'Haricots secs',
  'soja': 'Fèves de soja',
  'le soja': 'Fèves de soja',
  'du soja': 'Fèves de soja',
  'pois bambara': 'Pois bambara, secs',
  'bambara': 'Pois bambara, secs',
  'pois chiches': 'Pois chiches, secs',
  'pois chiche': 'Pois chiches, secs',

  // Oléagineux
  'arachide': 'Arachides non décortiquées',
  'arachides': 'Arachides non décortiquées',
  'les arachides': 'Arachides non décortiquées',
  'cacahuète': 'Arachides non décortiquées',
  'cacahuètes': 'Arachides non décortiquées',
  'sesame': 'Sésame',
  'sésame': 'Sésame',
  'le sesame': 'Sésame',
  'le sésame': 'Sésame',
  'ricin': 'Graines de ricin',
  'le ricin': 'Graines de ricin',
  'huile de palme': 'Huile, noix de palme',
  'palmier': 'Huile, noix de palme',
  'palmier à huile': 'Huile, noix de palme',
  'coco': 'Noix de coco',
  'noix de coco': 'Noix de coco',
  'cocotier': 'Noix de coco',
  'karite': 'Noix de karite',
  'karité': 'Noix de karite',
  'noix de karité': 'Noix de karite',
  'noix de karite': 'Noix de karite',
  'le karite': 'Noix de karite',
  'le karité': 'Noix de karite',
  'coton': 'Coton en graine, non égrené',
  'le coton': 'Coton en graine, non égrené',
  'du coton': 'Coton en graine, non égrené',

  // Fruits
  'ananas': 'Ananas',
  'l\'ananas': 'Ananas',
  'les ananas': 'Ananas',
  'banane': 'Bananes',
  'bananes': 'Bananes',
  'les bananes': 'Bananes',
  'plantain': 'Bananes',
  'le plantain': 'Bananes',
  'orange': 'Oranges',
  'oranges': 'Oranges',
  'les oranges': 'Oranges',
  'cajou': 'Noix d\'acajou non décortiquées',
  'noix de cajou': 'Noix d\'acajou non décortiquées',
  'anacarde': 'Noix d\'acajou non décortiquées',

  // Légumes
  'tomate': 'Tomates, fraiches',
  'tomates': 'Tomates, fraiches',
  'les tomates': 'Tomates, fraiches',
  'des tomates': 'Tomates, fraiches',
  'chou': 'Choux',
  'choux': 'Choux',
  'les choux': 'Choux',
  'piment': 'Piments forts et piments, secs (Capsicum spp., Pimenta spp.), crus',
  'piments': 'Piments forts et piments, secs (Capsicum spp., Pimenta spp.), crus',
  'les piments': 'Piments forts et piments, secs (Capsicum spp., Pimenta spp.), crus',
  'du piment': 'Piments forts et piments, secs (Capsicum spp., Pimenta spp.), crus',

  // Cultures industrielles
  'cacao': 'Cacao, fèves',
  'le cacao': 'Cacao, fèves',
  'du cacao': 'Cacao, fèves',
  'cafe': 'Café, vert',
  'café': 'Café, vert',
  'le cafe': 'Café, vert',
  'le café': 'Café, vert',
  'du cafe': 'Café, vert',
  'du café': 'Café, vert',
  'tabac': 'Tabacs bruts ou non fabriqués',
  'le tabac': 'Tabacs bruts ou non fabriqués',
  'du tabac': 'Tabacs bruts ou non fabriqués',

  // Épices
  'muscade': 'Noix de muscade, fleur de muscade, cardamomes, crues',
  'noix de muscade': 'Noix de muscade, fleur de muscade, cardamomes, crues',
  'cardamome': 'Noix de muscade, fleur de muscade, cardamomes, crues',
};

// ─────────────────────────────────────────────
// Dictionnaire de mots-clés météo
// ─────────────────────────────────────────────

/**
 * Mots-clés pour détecter les conditions météorologiques
 * dans la parole de l'utilisateur.
 */
const WEATHER_KEYWORDS = {
  temperature: {
    high: {
      keywords: ['chaud', 'chaleur', 'très chaud', 'canicule', 'brûlant', 'torride', 'il fait chaud', 'forte chaleur'],
      value: 35, // °C
    },
    medium: {
      keywords: ['tiède', 'doux', 'normal', 'température normale', 'temps normal'],
      value: 26, // °C
    },
    low: {
      keywords: ['froid', 'frais', 'fraîcheur', 'il fait frais', 'il fait froid', 'temps frais'],
      value: 21, // °C
    },
  },
  rainfall: {
    high: {
      keywords: ['pluie', 'pluvieux', 'beaucoup de pluie', 'forte pluie', 'inondation', 'déluge', 'il pleut beaucoup', 'grosse pluie', 'saison des pluies'],
      value: 250, // mm/mois
    },
    medium: {
      keywords: ['pluie normale', 'pluie modérée', 'quelques pluies', 'un peu de pluie'],
      value: 131, // mm/mois
    },
    low: {
      keywords: ['sec', 'sécheresse', 'pas de pluie', 'très sec', 'aride', 'il ne pleut pas', 'saison sèche', 'manque de pluie'],
      value: 20, // mm/mois
    },
  },
  soilMoisture: {
    high: {
      keywords: ['humide', 'sol humide', 'terre humide', 'sol mouillé', 'détrempé', 'sol gorgé d\'eau', 'boueux'],
      value: 85, // %
    },
    medium: {
      keywords: ['sol normal', 'humidité normale', 'terre normale'],
      value: 50, // %
    },
    low: {
      keywords: ['sol sec', 'terre sèche', 'terre craquelée', 'sol desséché', 'sol aride'],
      value: 15, // %
    },
  },
};

// ─────────────────────────────────────────────
// Synthèse vocale (TTS)
// ─────────────────────────────────────────────

/**
 * Prononce un texte en français via la synthèse vocale du système.
 * 
 * @param {string} text - Le texte à prononcer en français
 * @param {Object} [options] - Options supplémentaires
 * @param {number} [options.rate=0.9] - Vitesse de parole (0.1 à 2.0)
 * @param {number} [options.pitch=1.0] - Hauteur de la voix (0.5 à 2.0)
 * @returns {Promise<void>}
 */
export async function speak(text, options = {}) {
  const { rate = 0.9, pitch = 1.0 } = options;

  // Arrêter toute synthèse en cours avant de parler
  const isSpeaking = await Speech.isSpeakingAsync();
  if (isSpeaking) {
    await Speech.stop();
  }

  return new Promise((resolve, reject) => {
    Speech.speak(text, {
      language: 'fr-FR',
      rate,
      pitch,
      onDone: resolve,
      onError: (error) => {
        console.error('[Voice] Erreur TTS :', error);
        reject(error);
      },
      onStopped: resolve,
    });
  });
}

/**
 * Arrête la synthèse vocale en cours.
 * 
 * @returns {Promise<void>}
 */
export async function stopSpeaking() {
  try {
    await Speech.stop();
  } catch (error) {
    console.warn('[Voice] Erreur lors de l\'arrêt TTS :', error);
  }
}

/**
 * Vérifie si la synthèse vocale est en cours.
 * 
 * @returns {Promise<boolean>}
 */
export async function isSpeaking() {
  try {
    return await Speech.isSpeakingAsync();
  } catch (error) {
    return false;
  }
}

// ─────────────────────────────────────────────
// Analyse de la parole (parsing vocal)
// ─────────────────────────────────────────────

/**
 * Supprime les accents d'une chaîne pour la comparaison.
 * 
 * @param {string} str - Chaîne avec accents
 * @returns {string} Chaîne sans accents
 */
function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Analyse un texte dicté par l'utilisateur pour en extraire
 * le nom de la culture et les conditions météorologiques.
 * 
 * Exemples d'entrées reconnues :
 * - "Prévoir le maïs quand il fait chaud"
 * - "Rendement de l'igname avec beaucoup de pluie"
 * - "Comment sera le riz en saison sèche ?"
 * - "Manioc avec sol humide et chaleur"
 * 
 * @param {string} text - Le texte transcrit de la reconnaissance vocale
 * @returns {{
 *   culture: string|null,
 *   temperature: number|null,
 *   rainfall: number|null,
 *   soilMoisture: number|null
 * }}
 */
export function parseVoiceInput(text) {
  if (!text || typeof text !== 'string') {
    return { culture: null, temperature: null, rainfall: null, soilMoisture: null };
  }

  const normalizedText = removeAccents(text.toLowerCase().trim());
  const result = {
    culture: null,
    temperature: null,
    rainfall: null,
    soilMoisture: null,
  };

  // ── Détection de la culture ──
  // Trier par longueur décroissante pour matcher les synonymes les plus longs d'abord
  // (ex: "noix de cajou" avant "cajou")
  const sortedSynonyms = Object.entries(CULTURE_SYNONYMS)
    .sort((a, b) => b[0].length - a[0].length);

  for (const [synonym, faoName] of sortedSynonyms) {
    const normalizedSynonym = removeAccents(synonym.toLowerCase());
    if (normalizedText.includes(normalizedSynonym)) {
      result.culture = faoName;
      break;
    }
  }

  // ── Détection de la température ──
  result.temperature = detectWeatherCondition(normalizedText, WEATHER_KEYWORDS.temperature);

  // ── Détection des précipitations ──
  result.rainfall = detectWeatherCondition(normalizedText, WEATHER_KEYWORDS.rainfall);

  // ── Détection de l'humidité du sol ──
  result.soilMoisture = detectWeatherCondition(normalizedText, WEATHER_KEYWORDS.soilMoisture);

  return result;
}

/**
 * Détecte une condition météorologique dans le texte.
 * Cherche les mots-clés par priorité : conditions extrêmes d'abord.
 * 
 * @param {string} text - Texte normalisé (minuscules, sans accents)
 * @param {Object} conditions - Objet { high, medium, low } avec keywords et value
 * @returns {number|null} La valeur associée ou null si rien détecté
 */
function detectWeatherCondition(text, conditions) {
  // Vérifier d'abord les extrêmes (high et low), puis medium
  for (const level of ['high', 'low', 'medium']) {
    const condition = conditions[level];
    for (const keyword of condition.keywords) {
      const normalizedKeyword = removeAccents(keyword.toLowerCase());
      if (text.includes(normalizedKeyword)) {
        return condition.value;
      }
    }
  }
  return null;
}

// ─────────────────────────────────────────────
// Génération de phrases de résultat pour le TTS
// ─────────────────────────────────────────────

/**
 * Génère une phrase naturelle en français décrivant le résultat
 * de la prédiction, prête à être prononcée par la synthèse vocale.
 * 
 * @param {string} culture - Nom d'affichage de la culture
 * @param {number} rendement - Rendement prédit (kg/ha)
 * @param {string} niveau - Niveau de rendement ('bon', 'moyen', 'critique')
 * @param {string} [conseil] - Conseil agricole principal
 * @returns {string} Phrase complète à prononcer
 */
export function generateResultSpeech(culture, rendement, niveau, conseil) {
  // Formatage du rendement avec séparateur de milliers
  const rendementFormate = Math.round(rendement).toLocaleString('fr-FR');

  // Phrase d'introduction
  let phrase = `Pour ${getArticle(culture)}${culture} dans ces conditions, `;
  phrase += `le rendement prévu est de ${rendementFormate} kilogrammes par hectare. `;

  // Évaluation selon le niveau
  switch (niveau) {
    case 'bon':
      phrase += 'Les conditions sont bonnes pour cette culture. ';
      phrase += 'Vous pouvez planter avec confiance.';
      break;
    case 'moyen':
      phrase += 'Les conditions sont acceptables mais nécessitent une attention particulière. ';
      phrase += 'Prenez des précautions supplémentaires pour optimiser votre rendement.';
      break;
    case 'critique':
      phrase += 'Attention, les conditions sont difficiles pour cette culture. ';
      phrase += 'Le rendement pourrait être très faible. ';
      phrase += 'Envisagez une culture alternative plus résistante.';
      break;
    default:
      phrase += 'Surveillez les conditions climatiques.';
  }

  // Ajouter le conseil s'il est fourni
  if (conseil) {
    phrase += ` Conseil : ${conseil}`;
  }

  return phrase;
}

/**
 * Détermine l'article approprié en français pour une culture.
 * 
 * @param {string} culture - Nom de la culture
 * @returns {string} Article avec espace ("le ", "la ", "l'", "les ")
 */
function getArticle(culture) {
  const lowerCulture = culture.toLowerCase();

  // Cultures commençant par une voyelle → "l'"
  const vowels = ['a', 'e', 'é', 'è', 'i', 'o', 'u'];
  if (vowels.some(v => lowerCulture.startsWith(v))) {
    return "l'";
  }

  // Cultures au pluriel → "les "
  const pluralCultures = [
    'ignames', 'bananes', 'oranges', 'tomates', 'choux', 'piments',
    'haricots', 'patates', 'mils',
  ];
  if (pluralCultures.some(p => lowerCulture.includes(p))) {
    return 'les ';
  }

  // Par défaut → "le "
  return 'le ';
}

/**
 * Génère un message d'accueil vocal pour l'application.
 * 
 * @returns {string} Message d'accueil
 */
export function generateWelcomeSpeech() {
  return 'Bienvenue sur Tétou, votre assistant de prédiction agricole. ' +
    'Dites le nom d\'une culture et les conditions météo pour obtenir une prédiction de rendement. ' +
    'Par exemple, dites : prévoir le maïs quand il fait chaud.';
}

/**
 * Génère un message d'erreur vocal quand la culture n'est pas reconnue.
 * 
 * @param {string} [partialText] - Texte partiellement reconnu
 * @returns {string} Message d'erreur
 */
export function generateErrorSpeech(partialText) {
  let message = 'Désolé, je n\'ai pas compris la culture que vous souhaitez analyser. ';
  message += 'Veuillez réessayer en disant clairement le nom de la culture. ';
  message += 'Les cultures disponibles sont : maïs, riz, igname, manioc, sorgho, mil, et bien d\'autres.';

  return message;
}

/**
 * Retourne la liste des commandes vocales reconnues.
 * Utile pour afficher une aide à l'utilisateur.
 * 
 * @returns {Array<{ command: string, description: string }>}
 */
export function getVoiceCommands() {
  return [
    {
      command: 'Prévoir le [culture]',
      description: 'Demander une prédiction pour une culture spécifique.',
    },
    {
      command: '[culture] quand il fait chaud',
      description: 'Prédiction avec température élevée.',
    },
    {
      command: '[culture] avec beaucoup de pluie',
      description: 'Prédiction avec fortes précipitations.',
    },
    {
      command: '[culture] en saison sèche',
      description: 'Prédiction avec peu de pluie.',
    },
    {
      command: '[culture] sol humide',
      description: 'Prédiction avec humidité du sol élevée.',
    },
  ];
}
