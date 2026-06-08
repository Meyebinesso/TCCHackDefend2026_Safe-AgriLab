/**
 * 🎤 VoiceButton - Bouton micro avec animation d'écoute
 * 
 * Bouton circulaire avec icône de microphone.
 * En mode écoute (isListening=true) : anneaux concentriques
 * pulsants qui s'étendent comme des ondes sonores.
 * Transition de couleur : émeraude (inactif) → rouge (écoute).
 * 
 * Props:
 *  - isListening: état d'écoute actif
 *  - onPress: callback au toucher
 *  - size: taille du bouton (défaut 64)
 */

import React, { memo, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  interpolate,
  cancelAnimation,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../theme';

// Nombre d'anneaux concentriques
const NUM_RINGS = 3;

/**
 * Composant d'anneau animé individuel
 * Chaque anneau pulse avec un délai différent pour créer
 * l'effet d'ondes sonores qui s'étendent
 */
const AnimatedRing = ({ isListening, size, delay, index }) => {
  const animation = useSharedValue(0);

  useEffect(() => {
    if (isListening) {
      // Lancer la pulsation avec délai
      animation.value = withDelay(
        delay,
        withRepeat(
          withTiming(1, {
            duration: 1500,
            easing: Easing.out(Easing.ease),
          }),
          -1, // Boucle infinie
          false
        )
      );
    } else {
      // Arrêter l'animation et réinitialiser
      cancelAnimation(animation);
      animation.value = withTiming(0, { duration: 300 });
    }
  }, [isListening]);

  // Style animé de l'anneau : scale croissant + opacité décroissante
  const ringStyle = useAnimatedStyle(() => {
    const scale = interpolate(animation.value, [0, 1], [1, 1.8 + index * 0.3]);
    const opacity = interpolate(animation.value, [0, 0.5, 1], [0.4, 0.2, 0]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: Colors.danger,
        },
        ringStyle,
      ]}
    />
  );
};

const VoiceButton = ({
  isListening = false,
  onPress,
  size = 64,
}) => {
  // Animation de pulsation du bouton principal en mode écoute
  const buttonPulse = useSharedValue(1);

  useEffect(() => {
    if (isListening) {
      buttonPulse.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      cancelAnimation(buttonPulse);
      buttonPulse.value = withTiming(1, { duration: 200 });
    }
  }, [isListening]);

  // Style animé du bouton
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonPulse.value }],
  }));

  // Couleurs selon l'état
  const backgroundColor = isListening ? Colors.danger : Colors.primary;
  const iconName = isListening ? 'mic' : 'mic-outline';

  return (
    <View style={[styles.container, { width: size * 2.5, height: size * 2.5 }]}>
      {/* Anneaux concentriques (visibles uniquement en écoute) */}
      {Array.from({ length: NUM_RINGS }).map((_, index) => (
        <AnimatedRing
          key={index}
          isListening={isListening}
          size={size}
          delay={index * 300} // Délai entre chaque anneau
          index={index}
        />
      ))}

      {/* Bouton principal */}
      <Animated.View style={buttonStyle}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={
            isListening ? 'Arrêter l\'écoute vocale' : 'Activer l\'écoute vocale'
          }
          accessibilityState={{ selected: isListening }}
          style={[
            styles.button,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor,
              shadowColor: backgroundColor,
            },
          ]}
        >
          <Ionicons
            name={iconName}
            size={size * 0.45}
            color={Colors.white}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default memo(VoiceButton);
