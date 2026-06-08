import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../theme';
import { CULTURES, CATEGORIES } from '../data/cultures';
import CultureCard from '../components/CultureCard';
import PulsingButton from '../components/PulsingButton';

export default function CultureSelectScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCulture, setSelectedCulture] = useState(null);

  // Filtrer par recherche
  const filteredCultures = CULTURES.filter(c => 
    c.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Grouper par catégorie pour l'affichage standard
  const getCulturesByCategory = (categoryId) => {
    return filteredCultures.filter(c => c.category === categoryId);
  };

  const handleNext = () => {
    if (selectedCulture) {
      navigation.navigate('WeatherInput', { culture: selectedCulture });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Premium */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Catalogue des Cultures</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une culture..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.textMuted}
        />
      </View>

      {/* Contenu (Carrousels) */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {CATEGORIES.map(category => {
          const categoryCultures = getCulturesByCategory(category.id);
          if (categoryCultures.length === 0) return null;

          return (
            <View key={category.id} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryCount}>{categoryCultures.length}</Text>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselContainer}
              >
                {categoryCultures.map(culture => (
                  <CultureCard
                    key={culture.id}
                    culture={culture}
                    isSelected={selectedCulture?.id === culture.id}
                    onPress={(c) => {
                      if (c.isFree) {
                        setSelectedCulture(c);
                      } else {
                        alert('Abonnez-vous à la version PRO pour analyser cette culture.');
                      }
                    }}
                  />
                ))}
              </ScrollView>
            </View>
          );
        })}

      </ScrollView>

      {/* Bouton Suivant Flottant */}
      {selectedCulture && (
        <View style={styles.footer}>
          <PulsingButton 
            title={`Analyser : ${selectedCulture.displayName}`} 
            onPress={handleNext}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    backgroundColor: '#FFF',
    ...SHADOWS.soft,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: SIZES.radius.full,
  },
  headerTitle: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: SIZES.lg,
    marginVertical: SIZES.md,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radius.lg,
    ...SHADOWS.soft,
  },
  searchIcon: {
    marginRight: SIZES.sm,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textLight,
  },
  scrollContent: {
    paddingBottom: 120, // Espace pour le bouton
  },
  categorySection: {
    marginBottom: SIZES.xl,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  categoryTitle: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  categoryCount: {
    fontSize: 14,
    color: COLORS.textMuted,
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontWeight: 'bold',
  },
  carouselContainer: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  }
});
