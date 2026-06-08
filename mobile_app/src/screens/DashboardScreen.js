import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import axios from 'axios';
import { COLORS, SIZES, FONTS, SHADOWS } from '../theme';
import GlassCard from '../components/GlassCard';
import { CULTURES } from '../data/cultures';
import { LinearGradient } from 'expo-linear-gradient';

let MapView, Marker;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

export default function DashboardScreen({ navigation }) {
  const [userName, setUserName] = useState('Agriculteur');
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUserData();
    fetchLocationAndWeather();
  }, []);

  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.15, duration: 1000, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
          ]),
          Animated.sequence([
            Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            Animated.timing(glowAnim, { toValue: 0, duration: 1000, useNativeDriver: true })
          ])
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      glowAnim.stopAnimation();
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [isListening]);

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('@farmer_name');
      if (name) setUserName(name);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchLocationAndWeather = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let lat = 6.1374;
      let lon = 1.2124;

      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        lat = loc.coords.latitude;
        lon = loc.coords.longitude;
      }
      
      setLocation({ latitude: lat, longitude: lon });

      const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=Africa%2FAbidjan`);
      setWeather(response.data.current);
    } catch (error) {
      console.error("Erreur météo:", error);
    } finally {
      setLoadingWeather(false);
    }
  };

  const startListening = () => {
    if (Platform.OS === 'web') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'fr-FR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setSpokenText("Je vous écoute...");
        };

        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript.toLowerCase();
          setSpokenText(`"${speechResult}"`);
          
          const foundCulture = CULTURES.find(c => 
            speechResult.includes(c.displayName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ||
            speechResult.includes(c.faoName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
          );

          if (foundCulture) {
            setTimeout(() => {
              setIsListening(false);
              setSpokenText('');
              navigation.navigate('WeatherInput', { culture: foundCulture });
            }, 1500);
          } else {
            setSpokenText("Culture non reconnue.");
            setTimeout(() => { setIsListening(false); setSpokenText(''); }, 3000);
          }
        };

        recognition.onerror = (event) => {
          console.error("Erreur vocale", event);
          setIsListening(false);
          setSpokenText("Erreur micro.");
        };

        recognition.onend = () => {
          if (isListening) setIsListening(false);
        };

        recognition.start();
      } else {
        alert("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
      }
    } else {
      alert("Sur mobile, la version compilée utilisera l'API native. Testez l'IA sur navigateur Web.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={() => auth.signOut()}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.topActionRow}>
          <Text style={styles.sectionTitle}>Météo de votre parcelle</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Calendar')} style={styles.calendarBadge}>
            <Ionicons name="calendar" size={16} color={COLORS.primary} />
            <Text style={styles.calendarBadgeText}>Calendrier</Text>
          </TouchableOpacity>
        </View>

        <GlassCard style={styles.weatherCard}>
          {loadingWeather ? (
             <ActivityIndicator size="small" color={COLORS.primary} />
          ) : weather ? (
            <View style={styles.weatherGrid}>
              <View style={styles.weatherItem}>
                <Ionicons name="thermometer-outline" size={32} color={COLORS.secondary} />
                <Text style={styles.weatherValue}>{weather.temperature_2m}°C</Text>
                <Text style={styles.weatherLabel}>Température</Text>
              </View>
              <View style={styles.weatherItem}>
                <Ionicons name="water-outline" size={32} color="#3B82F6" />
                <Text style={styles.weatherValue}>{weather.relative_humidity_2m}%</Text>
                <Text style={styles.weatherLabel}>Humidité</Text>
              </View>
              <View style={styles.weatherItem}>
                <Ionicons name="rainy-outline" size={32} color="#8B5CF6" />
                <Text style={styles.weatherValue}>{weather.precipitation} mm</Text>
                <Text style={styles.weatherLabel}>Pluie (1h)</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.errorText}>Impossible de charger la météo</Text>
          )}
        </GlassCard>

        <Text style={styles.sectionTitle}>Localisation</Text>
        <View style={styles.mapContainer}>
          {Platform.OS === 'web' ? (
             <View style={styles.webMapFallback}>
               <Ionicons name="map" size={64} color={COLORS.textMuted} />
               <Text style={styles.webMapText}>La carte 3D interactive est optimisée pour l'application mobile.</Text>
               <Text style={styles.webMapCoords}>
                 {location ? `GPS: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : "Recherche GPS..."}
               </Text>
             </View>
          ) : location ? (
            <MapView 
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker coordinate={location} title="Ma Parcelle" description="Localisation actuelle" />
            </MapView>
          ) : (
            <ActivityIndicator size="large" color={COLORS.primary} />
          )}
        </View>

        <TouchableOpacity 
          style={styles.manualButton}
          onPress={() => navigation.navigate('CultureSelect')}
        >
          <Text style={styles.manualButtonText}>Recherche manuelle</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>

      </ScrollView>

      {/* Voice Assistant Center Interface */}
      <LinearGradient 
        colors={['transparent', 'rgba(255,255,255,0.9)', '#FFF']} 
        style={styles.voiceContainer}
      >
        <Text style={styles.speechText}>
          {spokenText ? spokenText : "Appuyez et parlez à Mofiala"}
        </Text>

        <TouchableOpacity onPress={startListening} activeOpacity={0.8} style={styles.aiButtonWrapper}>
          <Animated.View style={[styles.glowHalo, { transform: [{ scale: pulseAnim }], opacity: glowAnim }]} />
          
          <LinearGradient 
            colors={isListening ? ['#059669', '#10B981'] : [COLORS.primary, '#064E3B']} 
            style={styles.aiOrb}
          >
            <Ionicons name={isListening ? "mic" : "mic-outline"} size={36} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  appBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SIZES.lg, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: SIZES.md, backgroundColor: '#FFF', ...SHADOWS.soft, zIndex: 10 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SIZES.md },
  avatarText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  greeting: { fontSize: 14, color: COLORS.textMuted },
  userName: { fontSize: 18, fontWeight: 'bold', color: COLORS.textLight },
  logoutButton: { padding: 8, backgroundColor: '#FEE2E2', borderRadius: SIZES.radius.full },
  scrollContent: { padding: SIZES.lg, paddingBottom: 180 }, // Espace pour le bouton vocal
  topActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SIZES.lg, marginBottom: SIZES.sm },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textLight },
  calendarBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#34D399' },
  calendarBadgeText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12, marginLeft: 4 },
  weatherCard: { backgroundColor: '#FFF', padding: SIZES.md, borderRadius: SIZES.radius.lg },
  weatherGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  weatherItem: { alignItems: 'center' },
  weatherValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.textLight, marginTop: 8 },
  weatherLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  errorText: { color: COLORS.danger, textAlign: 'center' },
  mapContainer: { height: 180, borderRadius: SIZES.radius.lg, overflow: 'hidden', backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', ...SHADOWS.soft },
  map: { width: '100%', height: '100%' },
  webMapFallback: { alignItems: 'center', padding: SIZES.lg },
  webMapText: { textAlign: 'center', color: COLORS.textMuted, marginTop: SIZES.md },
  webMapCoords: { marginTop: SIZES.sm, fontWeight: 'bold', color: COLORS.primary },
  
  manualButton: { flexDirection: 'row', padding: SIZES.md, borderRadius: SIZES.radius.lg, justifyContent: 'center', alignItems: 'center', marginTop: SIZES.xl, borderWidth: 1, borderColor: COLORS.primary },
  manualButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold', marginRight: 5 },
  
  voiceContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
    zIndex: 20,
  },
  speechText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  aiButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  glowHalo: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#34D399',
    opacity: 0.5,
  },
  aiOrb: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
    elevation: 10,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  }
});
