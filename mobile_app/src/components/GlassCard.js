import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../theme';

/**
 * Composant de carte avec effet "Glassmorphism"
 * @param {React.ReactNode} children - Contenu de la carte
 * @param {Object} style - Styles additionnels
 * @param {Function} onPress - Fonction exécutée au clic (rend la carte cliquable)
 */
export default function GlassCard({ children, style, onPress }) {
  const CardContainer = onPress ? TouchableOpacity : View;
  const containerProps = onPress ? { onPress, activeOpacity: 0.8 } : {};

  return (
    <CardContainer {...containerProps} style={[styles.container, style]}>
      <LinearGradient
        colors={[COLORS.glassBgLight, 'rgba(255, 255, 255, 0.4)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.glassBackground}
      >
        <View style={styles.content}>
          {children}
        </View>
      </LinearGradient>
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.radius.xl,
    overflow: 'hidden',
    ...SHADOWS.medium,
    backgroundColor: 'rgba(255,255,255,0.2)', // Backup color
    marginVertical: SIZES.sm,
  },
  glassBackground: {
    flex: 1,
    borderRadius: SIZES.radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  content: {
    padding: SIZES.lg,
  }
});
