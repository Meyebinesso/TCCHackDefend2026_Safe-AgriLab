import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { COLORS, SIZES, FONTS, SHADOWS } from '../theme';
import GlassCard from '../components/GlassCard';
import PulsingButton from '../components/PulsingButton';
import { AI_Engine } from '../ai/inference';
import { LinearGradient } from 'expo-linear-gradient';
const conseilsData = require('../../assets/data/conseils.json');

export default function ResultScreen({ route, navigation }) {
  const { culture, features, weather } = route.params;
  const [prediction, setPrediction] = useState(null);
  const [conseils, setConseils] = useState(null);
  const [finance, setFinance] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const result = AI_Engine.predict(
      culture.faoName,
      features.stressIndex,
      features.rh2m,
      features.gwetroot
    );
    setPrediction(result);

    const catConseils = conseilsData[culture.category] || conseilsData['default'];
    const niveauConseil = catConseils[result.niveau];
    setConseils(niveauConseil);

    // Calcul de l'estimation financière
    const growthDays = culture.growthDays || 90; // Valeur par défaut
    const pricePerKg = culture.pricePerKg || 250; // Valeur par défaut en FCFA
    
    // Calcul de la date de récolte
    const today = new Date();
    const harvestDateObj = new Date(today.getTime() + (growthDays * 24 * 60 * 60 * 1000));
    const moisRecolte = harvestDateObj.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    
    // Si la récolte tombe en saison sèche (novembre à mars), les prix montent (bonus 20%)
    const month = harvestDateObj.getMonth();
    const isDrySeason = month >= 10 || month <= 2;
    const finalPrice = isDrySeason ? Math.round(pricePerKg * 1.2) : pricePerKg;
    
    // Revenu total estimé = Rendement (kg/ha) * Prix (FCFA/kg)
    const revenue = result.rendement * finalPrice;
    
    // Formatage avec séparateur de milliers
    const formattedRevenue = revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    // Conversion locale : Prix par "Bol" (environ 4kg pour les céréales/légumineuses au Togo/Bénin)
    let prixBol = null;
    if (culture.category === 'cereales' || culture.category === 'legumineuses') {
      prixBol = finalPrice * 4;
    }
    
    const financeData = {
      mois: moisRecolte,
      prixUnitaire: finalPrice,
      revenuTotal: formattedRevenue,
      isBonus: isDrySeason,
      prixBol: prixBol
    };
    
    setFinance(financeData);

    // Lancer la lecture vocale au chargement
    if (result && niveauConseil && financeData) {
      speakResult(result, niveauConseil, financeData);
    }

    // Arrêter la lecture quand on quitte l'écran
    return () => {
      Speech.stop();
    };
  }, [culture, features]);

  const speakResult = (pred, cons, fin) => {
    Speech.stop();
    setIsSpeaking(true);
    const textToSpeak = `Analyse terminée pour ${culture.displayName}. Rendement prévu : ${pred.rendement} kilogrammes par hectare. La récolte est prévue pour ${fin.mois}. Au prix estimé de ${fin.prixUnitaire} francs CFA le kilo, vos revenus pourraient atteindre ${fin.revenuTotal} francs CFA par hectare. Recommandation de l'expert : ${cons.action}.`;
    Speech.speak(textToSpeak, { 
      language: 'fr-FR',
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      speakResult(prediction, conseils, finance);
    }
  };

  if (!prediction || !conseils || !finance) {
    return (
      <View style={styles.loading}>
        <Text>Calcul IA en cours...</Text>
      </View>
    );
  }

  let statusColor = COLORS.warning;
  if (prediction.niveau === 'bon') statusColor = COLORS.success;
  if (prediction.niveau === 'critique') statusColor = COLORS.danger;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="close" size={28} color={COLORS.textLight} onPress={() => { Speech.stop(); navigation.navigate('Dashboard'); }} />
        <Text style={styles.headerTitle}>Rapport d'Analyse</Text>
        <TouchableOpacity onPress={toggleSpeech} style={styles.speechBtn}>
          <Ionicons name={isSpeaking ? "volume-mute" : "volume-high"} size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <View style={styles.summaryHeader}>
          <Text style={styles.emoji}>{culture.emoji}</Text>
          <Text style={styles.cultureName}>{culture.displayName}</Text>
        </View>

        {/* NOUVELLE CARTE : CALENDRIER DE SEMIS */}
        {culture.idealSowing && (
          <GlassCard style={{ backgroundColor: '#EEF2FF', borderColor: '#818CF8', borderWidth: 1, marginBottom: SIZES.lg }}>
            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={24} color="#4F46E5" />
              <Text style={[styles.cardTitle, { color: '#4F46E5', marginLeft: 8, marginBottom: 0 }]}>Période idéale de semis</Text>
            </View>
            <Text style={{ fontFamily: FONTS.body, fontSize: 16, color: '#3730A3', marginTop: 8, fontWeight: 'bold' }}>
              De : {culture.idealSowing}
            </Text>
            <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: '#4F46E5', marginTop: 4 }}>
              Si vous semez aujourd'hui, attendez-vous aux résultats ci-dessous :
            </Text>
          </GlassCard>
        )}

        <GlassCard style={{ borderColor: statusColor, borderWidth: 2, backgroundColor: '#fff' }}>
          <Text style={styles.cardTitle}>Rendement Prévu</Text>
          <Text style={[styles.mainValue, { color: statusColor }]}>
            {prediction.rendement} kg/ha
          </Text>
          
          <View style={styles.divider} />
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Comparé à la moyenne :</Text>
            <Text style={[styles.statValue, { color: statusColor }]}>
              {prediction.pourcentageMoyenne}%
            </Text>
          </View>
          
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: statusColor }]}>
              <Text style={styles.badgeText}>
                {prediction.niveau.toUpperCase()}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* NOUVELLE CARTE : ESTIMATION FINANCIÈRE */}
        <LinearGradient
          colors={['#10B981', '#047857']}
          style={styles.financeCard}
        >
          <View style={styles.financeHeader}>
            <Ionicons name="cash-outline" size={28} color="#FFF" />
            <Text style={styles.financeTitle}>Estimation Financière</Text>
          </View>
          
          <View style={styles.financeRow}>
            <Text style={styles.financeLabel}>Récolte estimée :</Text>
            <Text style={styles.financeValueHighlight}>{finance.mois}</Text>
          </View>
          
          <View style={styles.financeRow}>
            <Text style={styles.financeLabel}>Prix du marché :</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.financeValueHighlight}>{finance.prixUnitaire} FCFA / kg</Text>
              {finance.prixBol && (
                <Text style={{ color: '#FCD34D', fontSize: 12, fontWeight: 'bold' }}>soit ~ {finance.prixBol} F le Bol</Text>
              )}
            </View>
          </View>
          {finance.isBonus && (
             <Text style={styles.financeBonus}>+ Bonus saison sèche inclus</Text>
          )}

          <View style={styles.dividerLight} />
          
          <Text style={styles.revenueLabel}>Revenus potentiels (par hectare)</Text>
          <Text style={styles.revenueValue}>{finance.revenuTotal} FCFA</Text>
        </LinearGradient>

        <GlassCard style={{ marginTop: SIZES.lg, backgroundColor: '#F3F4F6' }}>
          <View style={styles.row}>
            <Ionicons name="bulb" size={24} color={COLORS.secondary} />
            <Text style={styles.cardTitle}>Conseil IA</Text>
          </View>
          
          <Text style={[styles.actionText, { color: statusColor }]}>
            {conseils.action}
          </Text>

          <View style={styles.tipsList}>
            {conseils.conseils.map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

      </ScrollView>

      <View style={styles.footer}>
        <PulsingButton 
          title="Nouvelle Simulation" 
          icon="refresh"
          color={COLORS.primary}
          onPress={() => { Speech.stop(); navigation.navigate('CultureSelect'); }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SIZES.lg },
  headerTitle: { fontFamily: FONTS.heading, fontSize: 18, fontWeight: 'bold' },
  speechBtn: { padding: 8, backgroundColor: '#E5E7EB', borderRadius: 20 },
  scroll: { padding: SIZES.md, paddingBottom: 100 },
  summaryHeader: { alignItems: 'center', marginBottom: SIZES.lg },
  emoji: { fontSize: 60 },
  cultureName: { fontFamily: FONTS.heading, fontSize: 24, fontWeight: 'bold', color: COLORS.textLight },
  cardTitle: { fontFamily: FONTS.heading, fontSize: 16, color: COLORS.textMuted, marginBottom: SIZES.xs },
  mainValue: { fontFamily: FONTS.heading, fontSize: 48, fontWeight: 'bold', textAlign: 'center', marginVertical: SIZES.sm },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: SIZES.md },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { fontFamily: FONTS.body, fontSize: 14, color: COLORS.textMuted },
  statValue: { fontFamily: FONTS.heading, fontSize: 16, fontWeight: 'bold' },
  badgeContainer: { alignItems: 'center', marginTop: SIZES.md },
  badge: { paddingHorizontal: SIZES.md, paddingVertical: SIZES.xs, borderRadius: SIZES.radius.round },
  badgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  
  // Finance Styles
  financeCard: { marginTop: SIZES.lg, padding: SIZES.lg, borderRadius: SIZES.radius.xl, ...SHADOWS.medium },
  financeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.md },
  financeTitle: { fontFamily: FONTS.heading, fontSize: 18, fontWeight: 'bold', color: '#FFF', marginLeft: 10 },
  financeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  financeLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },
  financeValueHighlight: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  financeBonus: { color: '#FCD34D', fontSize: 12, textAlign: 'right', fontStyle: 'italic', marginBottom: SIZES.sm },
  dividerLight: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: SIZES.md },
  revenueLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 14, textAlign: 'center' },
  revenueValue: { fontFamily: FONTS.heading, color: '#FFF', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginTop: 5 },
  
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.md },
  actionText: { fontFamily: FONTS.heading, fontSize: 18, fontWeight: 'bold', marginBottom: SIZES.md, textAlign: 'center' },
  tipsList: { marginTop: SIZES.sm },
  tipRow: { flexDirection: 'row', marginBottom: SIZES.sm, alignItems: 'flex-start' },
  tipText: { fontFamily: FONTS.body, fontSize: 14, color: COLORS.textLight, marginLeft: SIZES.sm, flex: 1 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 20 }
});
