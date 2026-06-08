/**
 * 📊 GaugeChart - Jauge circulaire animée (type compteur de vitesse)
 * 
 * Composant SVG qui affiche un arc de cercle rempli proportionnellement
 * à la valeur. La couleur change dynamiquement selon le niveau :
 *   - Vert (>80%) : bon rendement
 *   - Jaune (50-80%) : rendement moyen
 *   - Rouge (<50%) : rendement faible
 * 
 * Animation spring fluide lors du changement de valeur.
 * 
 * Props:
 *  - value: pourcentage (0-100)
 *  - rawValue: valeur brute en kg/ha (affichée au centre)
 *  - maxValue: valeur max de référence (pour calcul du %)
 *  - label: texte descriptif sous la jauge
 *  - size: taille du composant en pixels (défaut 200)
 */

import React, { memo, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  useDerivedValue,
  interpolateColor,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing } from '../theme';

// Créer un Path animé pour Reanimated
const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * Génère la commande SVG 'd' pour un arc de cercle
 * @param {number} cx - centre X
 * @param {number} cy - centre Y
 * @param {number} radius - rayon
 * @param {number} startAngle - angle de début (degrés)
 * @param {number} endAngle - angle de fin (degrés)
 */
const describeArc = (cx, cy, radius, startAngle, endAngle) => {
  'worklet';
  const toRad = (deg) => (deg * Math.PI) / 180;

  const start = {
    x: cx + radius * Math.cos(toRad(endAngle)),
    y: cy + radius * Math.sin(toRad(endAngle)),
  };
  const end = {
    x: cx + radius * Math.cos(toRad(startAngle)),
    y: cy + radius * Math.sin(toRad(startAngle)),
  };

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
};

// Configuration de l'arc : demi-cercle de 180° (de 180° à 360°)
const ARC_START = 180;  // Début à gauche
const ARC_END = 360;    // Fin à droite
const ARC_RANGE = ARC_END - ARC_START;

const GaugeChart = ({
  value = 0,
  rawValue = 0,
  maxValue = 14300,
  label = 'Rendement',
  size = 200,
}) => {
  // Calculs de dimensions
  const strokeWidth = size * 0.1;       // Épaisseur de l'arc
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // Valeur animée (0-100)
  const animatedValue = useSharedValue(0);

  // Lancer l'animation spring à chaque changement de valeur
  useEffect(() => {
    animatedValue.value = withSpring(Math.min(Math.max(value, 0), 100), {
      damping: 15,
      stiffness: 80,
      mass: 1,
    });
  }, [value]);

  // Déterminer la couleur selon le pourcentage
  const gaugeColor = useMemo(() => {
    if (value >= 80) return Colors.success;
    if (value >= 50) return Colors.warning;
    return Colors.danger;
  }, [value]);

  // Arc de fond (track gris)
  const backgroundArc = useMemo(
    () => describeArc(cx, cy, radius, ARC_START, ARC_END),
    [cx, cy, radius]
  );

  // Props animées pour l'arc de remplissage
  const animatedProps = useAnimatedProps(() => {
    const endAngle = ARC_START + (animatedValue.value / 100) * ARC_RANGE;
    // Éviter un arc vide (angle = 0)
    const safeEnd = Math.max(endAngle, ARC_START + 0.5);
    const d = describeArc(cx, cy, radius, ARC_START, safeEnd);
    return { d };
  });

  // Formater la valeur brute pour l'affichage
  const formattedRaw = useMemo(() => {
    if (rawValue >= 1000) {
      return `${(rawValue / 1000).toFixed(1)}k`;
    }
    return Math.round(rawValue).toString();
  }, [rawValue]);

  return (
    <View style={[styles.container, { width: size, height: size * 0.7 }]}>
      {/* Zone SVG de la jauge */}
      <Svg
        width={size}
        height={size * 0.6}
        viewBox={`0 0 ${size} ${size}`}
        style={styles.svg}
      >
        {/* Arc de fond (gris) */}
        <Path
          d={backgroundArc}
          stroke={Colors.gray200}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />

        {/* Arc de remplissage (animé) */}
        <AnimatedPath
          animatedProps={animatedProps}
          stroke={gaugeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>

      {/* Valeur centrale */}
      <View style={[styles.centerContent, { top: size * 0.25 }]}>
        <Text
          style={[
            styles.rawValue,
            { fontSize: size * 0.15, color: gaugeColor },
          ]}
        >
          {formattedRaw}
        </Text>
        <Text style={[styles.unit, { fontSize: size * 0.06 }]}>
          kg/ha
        </Text>
      </View>

      {/* Pourcentage */}
      <Text style={[styles.percentage, { color: gaugeColor }]}>
        {Math.round(value)}%
      </Text>

      {/* Label sous la jauge */}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
    top: 0,
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  rawValue: {
    fontFamily: Typography.fonts.heading,
    fontWeight: Typography.weights.extrabold,
  },
  unit: {
    fontFamily: Typography.fonts.body,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
    marginTop: -2,
  },
  percentage: {
    position: 'absolute',
    bottom: 24,
    fontFamily: Typography.fonts.heading,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  label: {
    position: 'absolute',
    bottom: 4,
    fontFamily: Typography.fonts.body,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
});

export default memo(GaugeChart);
