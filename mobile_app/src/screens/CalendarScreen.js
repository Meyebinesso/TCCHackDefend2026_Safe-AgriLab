import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../theme';
import GlassCard from '../components/GlassCard';

export default function CalendarScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('toutes');

  const events = [
    { id: 1, type: 'semis', title: 'Semis de Maïs', date: 'Aujourd\'hui', desc: 'Saison des pluies idéale.', icon: 'leaf', color: COLORS.primary },
    { id: 2, type: 'entretien', title: 'Désherbage', date: 'Dans 15 jours', desc: 'Nettoyage du champ recommandé.', icon: 'cut', color: COLORS.warning },
    { id: 3, type: 'recolte', title: 'Récolte d\'Igname', date: 'Novembre 2026', desc: 'Prix estimé : Haut (Saison Sèche)', icon: 'basket', color: COLORS.secondary },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendrier Agricole</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, selectedTab === 'toutes' && styles.activeTab]} onPress={() => setSelectedTab('toutes')}>
          <Text style={[styles.tabText, selectedTab === 'toutes' && styles.activeTabText]}>Toutes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, selectedTab === 'semis' && styles.activeTab]} onPress={() => setSelectedTab('semis')}>
          <Text style={[styles.tabText, selectedTab === 'semis' && styles.activeTabText]}>Semis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, selectedTab === 'recolte' && styles.activeTab]} onPress={() => setSelectedTab('recolte')}>
          <Text style={[styles.tabText, selectedTab === 'recolte' && styles.activeTabText]}>Récolte</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {events.filter(e => selectedTab === 'toutes' || e.type === selectedTab).map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <View style={styles.timeline}>
              <View style={[styles.timelineDot, { backgroundColor: event.color }]} />
              <View style={styles.timelineLine} />
            </View>
            <GlassCard style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                  <Ionicons name={event.icon} size={20} color={event.color} style={{ marginRight: 8 }} />
                  <Text style={styles.eventTitle}>{event.title}</Text>
                </View>
                <Text style={styles.eventDate}>{event.date}</Text>
              </View>
              <Text style={styles.eventDesc}>{event.desc}</Text>
            </GlassCard>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.addButtonText}>Ajouter une culture au calendrier</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SIZES.lg, paddingTop: 50, backgroundColor: '#FFF', ...SHADOWS.soft },
  headerTitle: { fontFamily: FONTS.heading, fontSize: 18, fontWeight: 'bold' },
  backBtn: { padding: 8, backgroundColor: '#E5E7EB', borderRadius: 20 },
  tabs: { flexDirection: 'row', padding: SIZES.md, backgroundColor: '#FFF' },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 10, backgroundColor: '#F3F4F6' },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: { color: COLORS.textMuted, fontWeight: 'bold' },
  activeTabText: { color: '#FFF' },
  scroll: { padding: SIZES.lg, paddingBottom: 100 },
  eventCard: { flexDirection: 'row', marginBottom: SIZES.lg },
  timeline: { width: 30, alignItems: 'center', marginRight: 10 },
  timelineDot: { width: 16, height: 16, borderRadius: 8, zIndex: 2 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#E5E7EB', marginTop: -8 },
  cardContent: { flex: 1, padding: SIZES.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  eventTitle: { fontFamily: FONTS.heading, fontSize: 16, fontWeight: 'bold', color: COLORS.textLight },
  eventDate: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary, backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  eventDesc: { color: COLORS.textMuted, fontSize: 14 },
  addButton: { flexDirection: 'row', backgroundColor: COLORS.secondary, padding: 16, borderRadius: SIZES.radius.lg, justifyContent: 'center', alignItems: 'center', marginTop: SIZES.xl, ...SHADOWS.medium },
  addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
