import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { COLORS, SIZES, FONTS } from '../theme';
import GlassCard from '../components/GlassCard';
import StressBar from '../components/StressBar';
import PulsingButton from '../components/PulsingButton';
import { calculateStressFeatures } from '../ai/stressCalculator';

export default function WeatherInputScreen({ route, navigation }) {
  const { culture } = route.params;

  // États des sliders
  const [temperature, setTemperature] = useState(26);
  const [rainfall, setRainfall] = useState(130);
  const [soilMoisture, setSoilMoisture] = useState(50);
  
  // État du calcul ML
  const [stressData, setStressData] = useState({ stressIndex: 0, rh2m: 77, gwetroot: 0.65 });

  // Recalculer le stress à chaque mouvement d'un slider
  useEffect(() => {
    const data = calculateStressFeatures(temperature, rainfall, soilMoisture);
    setStressData(data);
  }, [temperature, rainfall, soilMoisture]);

  const handlePredict = () => {
    // Naviguer vers l'écran de résultat (qu'on créera juste après)
    navigation.navigate('Result', { 
      culture, 
      features: stressData,
      weather: { temperature, rainfall, soilMoisture }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={COLORS.textLight} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Météo pour {culture.displayName} {culture.emoji}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        <GlassCard>
          <Text style={styles.sectionTitle}>Simuler les conditions</Text>
          <Text style={styles.sectionDesc}>Ajustez les curseurs pour simuler la météo des prochains mois et voir l'impact sur le stress de la plante.</Text>
          
          <StressBar stressIndex={stressData.stressIndex} />
        </GlassCard>

        {/* NOUVEAU : Sélecteur de Localisation */}
        <View style={styles.locationContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <Text style={styles.locationLabel}>Localisation du champ :</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
            <Text style={styles.locationValue}>Position GPS Actuelle</Text>
            <Text style={styles.locationChangeBtn}>Modifier</Text>
          </View>
        </View>

        {/* Température */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <Ionicons name="thermometer-outline" size={24} color="#EF4444" />
            <Text style={styles.sliderLabel}>Température Moyenne</Text>
            <Text style={styles.sliderValue}>{Math.round(temperature)}°C</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={20}
            maximumValue={45}
            value={temperature}
            onValueChange={setTemperature}
            minimumTrackTintColor="#EF4444"
            maximumTrackTintColor="#FCA5A5"
            thumbTintColor="#EF4444"
          />
        </View>

        {/* Pluie */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <Ionicons name="rainy-outline" size={24} color="#3B82F6" />
            <Text style={styles.sliderLabel}>Pluviométrie mensuelle</Text>
            <Text style={styles.sliderValue}>{Math.round(rainfall)} mm</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={400}
            value={rainfall}
            onValueChange={setRainfall}
            minimumTrackTintColor="#3B82F6"
            maximumTrackTintColor="#93C5FD"
            thumbTintColor="#3B82F6"
          />
        </View>

        {/* Humidité du Sol */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <Ionicons name="water-outline" size={24} color="#8B5CF6" />
            <Text style={styles.sliderLabel}>Humidité du Sol</Text>
            <Text style={styles.sliderValue}>{Math.round(soilMoisture)}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={soilMoisture}
            onValueChange={setSoilMoisture}
            minimumTrackTintColor="#8B5CF6"
            maximumTrackTintColor="#C4B5FD"
            thumbTintColor="#8B5CF6"
          />
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <PulsingButton 
          title="Prédire le Rendement 🚀" 
          icon="analytics"
          onPress={handlePredict}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.lg,
  },
  headerTitle: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  scroll: {
    padding: SIZES.md,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SIZES.xs,
  },
  sectionDesc: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: SIZES.md,
  },
  locationContainer: {
    backgroundColor: '#FFF',
    padding: SIZES.md,
    borderRadius: SIZES.radius.md,
    marginTop: SIZES.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  locationLabel: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
    marginLeft: 5,
  },
  locationValue: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  locationChangeBtn: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  sliderContainer: {
    marginTop: SIZES.xl,
    paddingHorizontal: SIZES.sm,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  sliderLabel: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 16,
    marginLeft: SIZES.sm,
    fontWeight: '600',
  },
  sliderValue: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    backgroundColor: 'rgba(254, 252, 232, 0.9)', // bgLight transparent
  }
});
