import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../theme';

export default function CultureCard({ culture, isSelected, onPress }) {
  // Mode premium : si on a une vraie image
  if (culture.image) {
    return (
      <TouchableOpacity 
        style={[styles.premiumCardContainer, isSelected && styles.selectedCard]} 
        onPress={() => onPress(culture)}
        activeOpacity={0.8}
      >
        <ImageBackground 
          source={culture.image} 
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay}>
            <Text style={styles.premiumText}>{culture.displayName}</Text>
            {isSelected && (
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
              </View>
            )}
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  // Mode classique pour les cultures verrouillées
  return (
    <TouchableOpacity 
      style={[styles.standardCard, isSelected && styles.selectedCard]} 
      onPress={() => onPress(culture)}
    >
      <View style={styles.lockContainer}>
        <Ionicons name="lock-closed" size={16} color={COLORS.textMuted} />
      </View>
      <Text style={styles.emoji}>{culture.emoji}</Text>
      <Text style={styles.standardText} numberOfLines={2}>{culture.displayName}</Text>
      <Text style={styles.proBadge}>PRO</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  premiumCardContainer: {
    width: 140,
    height: 160,
    marginRight: SIZES.md,
    borderRadius: SIZES.radius.lg,
    ...SHADOWS.medium,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: SIZES.radius.lg,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: SIZES.sm,
    borderBottomLeftRadius: SIZES.radius.lg,
    borderBottomRightRadius: SIZES.radius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  premiumText: {
    color: '#FFF',
    fontFamily: FONTS.heading,
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkIcon: {
    position: 'absolute',
    top: -120,
    right: 10,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  standardCard: {
    width: 120,
    height: 140,
    backgroundColor: '#FFF',
    marginRight: SIZES.md,
    borderRadius: SIZES.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.sm,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  lockContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  emoji: {
    fontSize: 40,
    marginBottom: SIZES.sm,
  },
  standardText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  proBadge: {
    position: 'absolute',
    bottom: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.secondary,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 10,
    fontWeight: 'bold',
  }
});
