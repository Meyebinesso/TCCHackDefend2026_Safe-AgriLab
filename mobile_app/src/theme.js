// src/theme.js
// Système de Design "Mofiala"

export const COLORS = {
  // Couleurs principales (Thème Agricole Premium)
  primary: '#064E3B',    // Vert Forêt Profond (Sérieux, croissance, IA)
  secondary: '#C2410C',  // Terre Cuite / Argile (Dynamisme, terre d'Afrique, appels à l'action)
  accent: '#F59E0B',     // Or Solaire (Soleil, récoltes, badges PRO)
  
  // Couleurs de fond
  bgLight: '#FAFAF9',    // Blanc cassé chaud (Lumière naturelle)
  bgDark: '#1C1917',     // Gris charbon profond
  
  // Texte
  textLight: '#1C1917',  // Texte sombre pour fond clair
  textDark: '#FAFAF9',   // Texte clair pour fond sombre
  textMuted: '#78716C',  // Texte secondaire doux
  
  // Alertes / Niveaux
  success: '#10B981',    // Vert clair (Excellent)
  warning: '#F59E0B',    // Jaune Solaire (Moyen)
  danger: '#DC2626',     // Rouge profond (Critique)
  
  // Spécial
  glassBgLight: 'rgba(255, 255, 255, 0.8)',
  glassBgDark: 'rgba(28, 25, 23, 0.8)',
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    round: 9999
  }
};

export const FONTS = {
  heading: 'Outfit',
  body: 'Inter'
};

export const SHADOWS = {
  soft: {
    shadowColor: "#064E3B", // Ombre légèrement teintée de vert
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  medium: {
    shadowColor: "#064E3B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  large: {
    shadowColor: "#C2410C", // Ombre pour les boutons d'action (Terre)
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  }
};
