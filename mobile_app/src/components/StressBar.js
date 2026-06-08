import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../theme';

export default function StressBar({ stressIndex }) {
  // L'indice de stress va de 0 (Parfait) à 2+ (Critique)
  // On le ramène à un pourcentage entre 0 et 100% pour la barre
  const maxStress = 1.0; 
  let percent = (stressIndex / maxStress) * 100;
  if (percent > 100) percent = 100;
  if (percent < 0) percent = 0;

  // Déterminer la couleur
  let barColor = COLORS.success;
  let levelText = 'Faible (Idéal)';
  
  if (stressIndex >= 0.05) {
    barColor = COLORS.warning;
    levelText = 'Moyen';
  }
  if (stressIndex >= 0.15) {
    barColor = '#EA580C'; // Orange
    levelText = 'Élevé';
  }
  if (stressIndex >= 0.5) {
    barColor = COLORS.danger;
    levelText = 'Critique';
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Indice de Stress Climatique</Text>
        <Text style={[styles.value, { color: barColor }]}>{levelText}</Text>
      </View>
      
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: barColor }]} />
      </View>
      
      <Text style={styles.numericValue}>Valeur brute : {stressIndex.toFixed(4)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.lg,
    paddingHorizontal: SIZES.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.sm,
  },
  label: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  value: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    fontWeight: 'bold',
  },
  barBackground: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: SIZES.radius.round,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: SIZES.radius.round,
  },
  numericValue: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'right',
    marginTop: 4,
  }
});
