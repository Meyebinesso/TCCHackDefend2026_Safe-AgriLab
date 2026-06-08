import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../theme';

/**
 * Bouton principal avec animation de pulsation ("Cœur" de l'app)
 */
export default function PulsingButton({ title, icon, onPress, color = COLORS.primary }) {
  const scale = useSharedValue(1);

  // Lancer l'animation de pulsation au montage du composant
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infini
      true // Reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pulseRing, { backgroundColor: color }, animatedStyle]} />
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: color }]} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        {icon && <Ionicons name={icon} size={28} color={COLORS.bgLight} style={styles.icon} />}
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SIZES.lg,
    height: 80, // Espace pour l'animation
  },
  pulseRing: {
    position: 'absolute',
    width: '90%',
    height: 60,
    borderRadius: SIZES.radius.round,
    opacity: 0.3,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.xl,
    borderRadius: SIZES.radius.round,
    ...SHADOWS.medium,
    elevation: 8,
    minWidth: '80%',
  },
  icon: {
    marginRight: SIZES.sm,
  },
  text: {
    color: COLORS.bgLight,
    fontSize: 18,
    fontFamily: FONTS.heading,
    fontWeight: 'bold',
  }
});
