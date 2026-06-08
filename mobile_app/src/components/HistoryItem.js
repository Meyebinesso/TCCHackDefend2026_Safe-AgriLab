/**
 * 📋 HistoryItem - Élément de liste d'historique des prédictions
 * 
 * Carte horizontale affichant un enregistrement d'historique avec :
 *  - Indicateur coloré à gauche (vert/jaune/rouge selon le rendement)
 *  - Nom de la culture et date au centre
 *  - Valeur du rendement et chevron à droite
 *  - Animation subtile au toucher
 * 
 * Props:
 *  - culture: nom de la culture
 *  - rendement: valeur du rendement (kg/ha)
 *  - niveau: 'bon' | 'moyen' | 'critique'
 *  - date: date de la prédiction (chaîne formatée)
 *  - onPress: callback au toucher
 *  - emoji: emoji de la culture (optionnel)
 */

import React, { memo, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
} from '../theme';

// Composant Pressable animé
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Configuration des couleurs par niveau de rendement
const LEVEL_CONFIG = {
  bon: {
    color: Colors.success,
    backgroundColor: Colors.successLight,
    label: 'Bon',
    icon: 'trending-up',
  },
  moyen: {
    color: Colors.warning,
    backgroundColor: Colors.warningLight,
    label: 'Moyen',
    icon: 'remove-outline',
  },
  critique: {
    color: Colors.danger,
    backgroundColor: Colors.dangerLight,
    label: 'Critique',
    icon: 'trending-down',
  },
};

const HistoryItem = ({
  culture = 'Culture',
  rendement = 0,
  niveau = 'moyen',
  date = '',
  onPress,
  emoji = '🌱',
}) => {
  // Récupérer la configuration du niveau
  const levelConfig = useMemo(
    () => LEVEL_CONFIG[niveau] || LEVEL_CONFIG.moyen,
    [niveau]
  );

  // Animation de scale au toucher
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, {
      damping: 15,
      stiffness: 200,
    });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Formater le rendement pour l'affichage
  const formattedRendement = useMemo(() => {
    if (rendement >= 1000) {
      return `${(rendement / 1000).toFixed(1)}k`;
    }
    return Math.round(rendement).toString();
  }, [rendement]);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`${culture}, rendement ${rendement} kg par hectare, niveau ${levelConfig.label}`}
      style={[styles.container, animatedStyle]}
    >
      {/* Indicateur de couleur à gauche */}
      <View
        style={[
          styles.indicator,
          { backgroundColor: levelConfig.backgroundColor },
        ]}
      >
        <Text style={styles.emoji}>{emoji}</Text>
        {/* Bande de couleur sur le bord gauche */}
        <View
          style={[
            styles.colorStrip,
            { backgroundColor: levelConfig.color },
          ]}
        />
      </View>

      {/* Informations centrales */}
      <View style={styles.infoContainer}>
        {/* Nom de la culture */}
        <Text style={styles.cultureName} numberOfLines={1}>
          {culture}
        </Text>

        {/* Date et badge de niveau */}
        <View style={styles.metaRow}>
          <Ionicons
            name="calendar-outline"
            size={12}
            color={Colors.textMuted}
            style={styles.calendarIcon}
          />
          <Text style={styles.dateText}>{date}</Text>

          {/* Badge de niveau */}
          <View
            style={[
              styles.levelBadge,
              { backgroundColor: levelConfig.color + '18' },
            ]}
          >
            <Ionicons
              name={levelConfig.icon}
              size={12}
              color={levelConfig.color}
            />
            <Text
              style={[styles.levelText, { color: levelConfig.color }]}
            >
              {levelConfig.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Valeur et chevron à droite */}
      <View style={styles.rightSection}>
        <Text style={[styles.rendementValue, { color: levelConfig.color }]}>
          {formattedRendement}
        </Text>
        <Text style={styles.rendementUnit}>kg/ha</Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={Colors.gray400}
          style={styles.chevron}
        />
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
    marginHorizontal: Spacing.xs,
    minHeight: 72,
    ...Shadows.soft,
  },
  indicator: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  colorStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.lg,
  },
  emoji: {
    fontSize: 22,
  },
  infoContainer: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  cultureName: {
    fontFamily: Typography.fonts.heading,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDark,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    marginRight: 4,
  },
  dateText: {
    fontFamily: Typography.fonts.body,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginRight: Spacing.sm,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  levelText: {
    fontFamily: Typography.fonts.body,
    fontSize: 10,
    fontWeight: Typography.weights.semibold,
    marginLeft: 3,
  },
  rightSection: {
    alignItems: 'flex-end',
    marginLeft: Spacing.sm,
  },
  rendementValue: {
    fontFamily: Typography.fonts.heading,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  rendementUnit: {
    fontFamily: Typography.fonts.body,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: -2,
  },
  chevron: {
    marginTop: Spacing.xs,
  },
});

export default memo(HistoryItem);
