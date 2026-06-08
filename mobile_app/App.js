import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/services/firebase';
import { COLORS, FONTS } from './src/theme';

import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import CultureSelectScreen from './src/screens/CultureSelectScreen';
import WeatherInputScreen from './src/screens/WeatherInputScreen';
import ResultScreen from './src/screens/ResultScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import CalendarScreen from './src/screens/CalendarScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  // Écouteur Firebase : Se déclenche quand l'utilisateur se connecte ou se déconnecte
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Fin du chargement initial de l'authentification
    });
    return unsubscribe;
  }, []);

  // Si on doit afficher le SplashScreen (pendant 3.5 secondes)
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Si Firebase n'a pas encore répondu (après le splash)
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: COLORS.bgLight }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10, color: COLORS.primary, fontWeight: 'bold' }}>Chargement de Mofiala...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Si l'utilisateur est connecté, il a accès à ces écrans
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="CultureSelect" component={CultureSelectScreen} />
            <Stack.Screen name="WeatherInput" component={WeatherInputScreen} />
            <Stack.Screen name="Result" component={ResultScreen} />
            <Stack.Screen name="Calendar" component={CalendarScreen} />
          </>
        ) : (
          // Sinon, on le force sur l'écran d'Onboarding
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgLight },
  title: { fontSize: 40, fontWeight: 'bold', color: COLORS.bgLight, marginBottom: 10 },
  subtitle: { fontSize: 18, color: COLORS.textMuted, opacity: 0.8 },
  link: { marginTop: 20, fontSize: 18, color: COLORS.primary, fontWeight: 'bold' }
});
