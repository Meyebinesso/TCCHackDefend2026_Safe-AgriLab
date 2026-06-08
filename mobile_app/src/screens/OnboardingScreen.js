import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { COLORS, SIZES, FONTS, SHADOWS } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Mofiala, Votre Guide',
    description: "Ne laissez plus vos récoltes au hasard. Découvrez l'assistant intelligent qui connaît la terre d'Afrique.",
    image: require('../../assets/images/onboarding_1_mofiala_1780817005162.png'),
  },
  {
    id: '2',
    title: 'Anticipez le Climat',
    description: 'Surveillez la pluie et la sécheresse. Prenez les bonnes décisions avant même de semer.',
    image: require('../../assets/images/onboarding_2_mofiala_1780817002793.png'),
  },
  {
    id: '3',
    title: 'Maximisez vos Profits',
    description: 'Analysez vos cultures, prévoyez vos rendements et augmentez vos revenus dès aujourd\'hui.',
    image: require('../../assets/images/onboarding_3_mofiala_1780817020728.png'),
  }
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Auto-défilement infini toutes les 6 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleAnonymous = async () => {
    try {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, 'guest@mofiala.com', 'guestmofiala2026');
      } catch (err) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
          await createUserWithEmailAndPassword(auth, 'guest@mofiala.com', 'guestmofiala2026');
        } else {
          throw err;
        }
      }
      await AsyncStorage.setItem('@farmer_name', 'Agriculteur Rapide');
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion rapide. Vérifiez votre réseau.");
    } finally {
      setLoading(false);
    }
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={currentSlide.image} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient 
          colors={['transparent', 'rgba(6, 78, 59, 0.6)', '#064E3B']} 
          style={styles.overlay}
        >
          
          <View 
            key={currentIndex} 
            style={styles.textContainer}
          >
            <Text style={styles.title}>{currentSlide.title}</Text>
            <Text style={styles.description}>{currentSlide.description}</Text>
          </View>

          <View style={styles.paginationContainer}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index ? styles.activeDot : null,
                ]}
              />
            ))}
          </View>

          <View style={styles.footer}>
            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.accent} />
                <Text style={styles.loaderText}>Préparation de Mofiala...</Text>
              </View>
            ) : (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                  style={[styles.primaryButton, SHADOWS.large]}
                  onPress={() => navigation.navigate('Login', { isSignup: true })}
                >
                  <Text style={styles.primaryButtonText}>Commencer l'Aventure</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 10 }} />
                </TouchableOpacity>

                <View style={styles.rowButtons}>
                  <TouchableOpacity 
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('Login', { isSignup: false })}
                  >
                    <Ionicons name="log-in-outline" size={20} color={COLORS.bgLight} style={{ marginRight: 8 }} />
                    <Text style={styles.secondaryButtonText}>Se Connecter</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.anonymousButton}
                    onPress={handleAnonymous}
                  >
                    <Ionicons name="person-outline" size={20} color={COLORS.accent} style={{ marginRight: 8 }} />
                    <Text style={styles.anonymousButtonText}>Mode Rapide</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
    paddingHorizontal: SIZES.lg,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 34,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: SIZES.md,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 8,
    letterSpacing: 0.5,
  },
  description: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SIZES.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 6,
  },
  activeDot: {
    width: 24,
    backgroundColor: COLORS.accent, // Or Solaire pour le point actif
  },
  footer: {
    minHeight: 140,
    justifyContent: 'center',
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    color: COLORS.accent,
    marginTop: SIZES.sm,
    fontFamily: FONTS.body,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: COLORS.secondary, // Terre Cuite pour l'appel à l'action
    paddingVertical: 18,
    borderRadius: SIZES.radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: SIZES.lg,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: FONTS.heading,
    letterSpacing: 0.5,
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: SIZES.radius.lg,
    marginRight: SIZES.sm,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.bgLight,
  },
  anonymousButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    borderRadius: SIZES.radius.lg,
    marginLeft: SIZES.sm,
  },
  anonymousButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.accent,
  }
});
