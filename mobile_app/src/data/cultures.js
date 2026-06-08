// src/data/cultures.js
// Mapping entre les noms stricts de la base de données (FAOSTAT) et l'interface utilisateur

export const CATEGORIES = [
  { id: 'cereales', title: 'Céréales & Grains' },
  { id: 'tubercules', title: 'Tubercules & Racines' },
  { id: 'legumineuses', title: 'Légumineuses' },
  { id: 'oleagineux', title: 'Oléagineux' },
  { id: 'industrielles', title: 'Cultures de Rente' },
  { id: 'fruits', title: 'Fruits' },
  { id: 'legumes', title: 'Légumes' },
  { id: 'epices', title: 'Épices' }
];

export const CULTURES = [
  { id: 'mais', faoName: 'Maïs', displayName: 'Maïs', emoji: '🌽', image: require('../../assets/images/crop_mais_1780805831279.png'), category: 'cereales', isFree: true, pricePerKg: 200, growthDays: 90, idealSowing: 'Mars - Mai' },
  { id: 'riz', faoName: 'Riz', displayName: 'Riz', emoji: '🍚', image: require('../../assets/images/crop_riz_1780805847237.png'), category: 'cereales', isFree: true, pricePerKg: 350, growthDays: 120, idealSowing: 'Juin - Juillet' },
  { id: 'ignames', faoName: 'Ignames', displayName: 'Igname', emoji: '🍠', image: require('../../assets/images/crop_ignames_1780805862464.png'), category: 'tubercules', isFree: true, pricePerKg: 500, growthDays: 240, idealSowing: 'Février - Mars' },
  { id: 'manioc', faoName: 'Manioc, frais', displayName: 'Manioc', emoji: '🫘', image: require('../../assets/images/crop_manioc_1780805877285.png'), category: 'tubercules', isFree: true, pricePerKg: 150, growthDays: 300, idealSowing: 'Avril - Juin' },
  
  // Autres tubercules
  { id: 'patates', faoName: 'Patates douces', displayName: 'Patate douce', emoji: '🥔', category: 'tubercules', isFree: false, pricePerKg: 300, growthDays: 120, idealSowing: 'Juin - Août' },
  { id: 'taro', faoName: 'Taro', displayName: 'Taro', emoji: '🥔', category: 'tubercules', isFree: false, pricePerKg: 400, growthDays: 210, idealSowing: 'Mai - Juin' },
  { id: 'racines_div', faoName: 'Racines et tubercules similaires à haute teneur en fécule ou en inuline, n.c.a., fraîches', displayName: 'Autres tubercules', emoji: '🥔', category: 'tubercules', isFree: false, pricePerKg: 200, growthDays: 150, idealSowing: 'Avril - Juin' },

  // Céréales
  { id: 'sorgho', faoName: 'Sorgho', displayName: 'Sorgho', emoji: '🌾', category: 'cereales', isFree: false, pricePerKg: 250, growthDays: 100, idealSowing: 'Juin - Juillet' },
  { id: 'mils', faoName: 'Mils', displayName: 'Mil', emoji: '🌾', category: 'cereales', isFree: false, pricePerKg: 250, growthDays: 90, idealSowing: 'Juin - Juillet' },
  { id: 'fonio', faoName: 'Fonio', displayName: 'Fonio', emoji: '🌾', category: 'cereales', isFree: false, pricePerKg: 800, growthDays: 80, idealSowing: 'Juin - Juillet' },
  { id: 'cereales_div', faoName: 'Céréales n.a.c.', displayName: 'Autres céréales', emoji: '🌾', category: 'cereales', isFree: false, pricePerKg: 250, growthDays: 90, idealSowing: 'Mai - Juillet' },

  // Légumineuses
  { id: 'arachides', faoName: 'Arachides non décortiquées', displayName: 'Arachide', emoji: '🥜', category: 'legumineuses', isFree: false, pricePerKg: 400, growthDays: 110, idealSowing: 'Avril - Juin' },
  { id: 'soja', faoName: 'Fèves de soja', displayName: 'Soja', emoji: '🌱', category: 'legumineuses', isFree: false, pricePerKg: 300, growthDays: 100, idealSowing: 'Juin - Juillet' },
  { id: 'haricots', faoName: 'Haricots secs', displayName: 'Haricot', emoji: '🫘', category: 'legumineuses', isFree: false, pricePerKg: 500, growthDays: 70, idealSowing: 'Septembre - Octobre' },
  { id: 'pois_bambara', faoName: 'Pois bambara, secs', displayName: 'Pois de terre', emoji: '🫘', category: 'legumineuses', isFree: false, pricePerKg: 600, growthDays: 120, idealSowing: 'Juin - Juillet' },
  { id: 'pois_chiches', faoName: 'Pois chiches, secs', displayName: 'Pois chiche', emoji: '🫘', category: 'legumineuses', isFree: false, pricePerKg: 800, growthDays: 100, idealSowing: 'Octobre - Novembre' },

  // Cultures de Rente / Oléagineux
  { id: 'coton', faoName: 'Coton en graine, non égrené', displayName: 'Coton', emoji: '☁️', category: 'industrielles', isFree: false, pricePerKg: 250, growthDays: 150, idealSowing: 'Mai - Juin' },
  { id: 'cacao', faoName: 'Cacao, fèves', displayName: 'Cacao', emoji: '🍫', category: 'industrielles', isFree: false, pricePerKg: 1500, growthDays: 180, idealSowing: 'Mai - Juin' },
  { id: 'cafe', faoName: 'Café, vert', displayName: 'Café', emoji: '☕', category: 'industrielles', isFree: false, pricePerKg: 1200, growthDays: 180, idealSowing: 'Mai - Juin' },
  { id: 'karite', faoName: 'Noix de karite', displayName: 'Karité', emoji: '🌰', category: 'oleagineux', isFree: false, pricePerKg: 300, growthDays: 150, idealSowing: 'Juin - Août' },
  { id: 'anacarde', faoName: "Noix d'acajou non décortiquées", displayName: 'Anacarde', emoji: '🥜', category: 'oleagineux', isFree: false, pricePerKg: 400, growthDays: 150, idealSowing: 'Juin - Août' },
  { id: 'palme', faoName: 'Huile, noix de palme', displayName: 'Noix de palme', emoji: '🌴', category: 'oleagineux', isFree: false, pricePerKg: 500, growthDays: 180, idealSowing: 'Toute l\'année' },
  { id: 'coco', faoName: 'Noix de coco', displayName: 'Coco', emoji: '🥥', category: 'oleagineux', isFree: false, pricePerKg: 200, growthDays: 360, idealSowing: 'Toute l\'année' },
  { id: 'ricin', faoName: 'Graines de ricin', displayName: 'Ricin', emoji: '🫘', category: 'oleagineux', isFree: false, pricePerKg: 600, growthDays: 140, idealSowing: 'Juin - Juillet' },
  { id: 'sesame', faoName: 'Sésame', displayName: 'Sésame', emoji: '🌱', category: 'oleagineux', isFree: false, pricePerKg: 800, growthDays: 100, idealSowing: 'Juin - Juillet' },
  { id: 'tabac', faoName: 'Tabacs bruts ou non fabriqués', displayName: 'Tabac', emoji: '🌿', category: 'industrielles', isFree: false, pricePerKg: 1000, growthDays: 90, idealSowing: 'Mai - Juin' },

  // Fruits et Légumes
  { id: 'ananas', faoName: 'Ananas', displayName: 'Ananas', emoji: '🍍', category: 'fruits', isFree: false, pricePerKg: 200, growthDays: 400, idealSowing: 'Juin - Juillet' },
  { id: 'bananes', faoName: 'Bananes', displayName: 'Banane', emoji: '🍌', category: 'fruits', isFree: false, pricePerKg: 150, growthDays: 270, idealSowing: 'Mars - Mai' },
  { id: 'oranges', faoName: 'Oranges', displayName: 'Orange', emoji: '🍊', category: 'fruits', isFree: false, pricePerKg: 250, growthDays: 300, idealSowing: 'Mars - Mai' },
  { id: 'tomates', faoName: 'Tomates, fraiches', displayName: 'Tomate', emoji: '🍅', category: 'legumes', isFree: false, pricePerKg: 400, growthDays: 80, idealSowing: 'Août - Octobre' },
  { id: 'choux', faoName: 'Choux', displayName: 'Chou', emoji: '🥬', category: 'legumes', isFree: false, pricePerKg: 300, growthDays: 90, idealSowing: 'Septembre - Novembre' },
  { id: 'piments', faoName: 'Piments forts et piments, secs (Capsicum spp., Pimenta spp.), crus', displayName: 'Piment', emoji: '🌶️', category: 'epices', isFree: false, pricePerKg: 1000, growthDays: 100, idealSowing: 'Avril - Juin' },
  { id: 'muscade', faoName: 'Noix de muscade, fleur de muscade, cardamomes, crues', displayName: 'Muscade & Cardamome', emoji: '🌰', category: 'epices', isFree: false, pricePerKg: 3000, growthDays: 365, idealSowing: 'Mars - Mai' },
  
  // Divers
  { id: 'epices_div', faoName: 'Autres espèces cultivées stimulantes, à épices et aromatiques, n.c.a.', displayName: 'Autres épices', emoji: '🌿', category: 'epices', isFree: false, pricePerKg: 1000, growthDays: 90, idealSowing: 'Avril - Juin' },
  { id: 'fruits_div', faoName: 'Autres fruits n.a.c.', displayName: 'Autres fruits', emoji: '🍎', category: 'fruits', isFree: false, pricePerKg: 300, growthDays: 120, idealSowing: 'Mars - Mai' },
  { id: 'legumes_div', faoName: 'Autres légumes frais n.a.c.', displayName: 'Autres légumes', emoji: '🥕', category: 'legumes', isFree: false, pricePerKg: 250, growthDays: 90, idealSowing: 'Septembre - Novembre' }
];

export function getCultureByFaoName(faoName) {
  return CULTURES.find(c => c.faoName === faoName);
}

export function searchCultures(query) {
  if (!query) return CULTURES;
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return CULTURES.filter(c => {
    const name = c.displayName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return name.includes(q);
  });
}
