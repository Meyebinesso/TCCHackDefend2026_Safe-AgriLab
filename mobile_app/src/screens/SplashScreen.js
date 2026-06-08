import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../theme';

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 30,
        useNativeDriver: true,
      })
    ]).start();

    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#064E3B', '#1C1917']} style={StyleSheet.absoluteFillObject} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        
        <View style={styles.logoWrapper}>
          <Image 
            source={require('../../assets/mofiala_icon.png')} 
            style={styles.logo}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.appName}>MOFIALA</Text>
        <Text style={styles.slogan}>Le Guide ; celui qui montre le chemin</Text>
        
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    width: '100%',
  },
  logoWrapper: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
    marginBottom: 30,
    borderRadius: 75,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75, // PERFECT CIRCLE
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  appName: {
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 6,
    marginBottom: 15,
    zIndex: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  slogan: {
    fontFamily: FONTS.body,
    fontSize: 18,
    fontStyle: 'italic',
    color: COLORS.accent,
    textAlign: 'center',
    paddingHorizontal: 30,
    fontWeight: '400',
    opacity: 0.9,
  }
});
