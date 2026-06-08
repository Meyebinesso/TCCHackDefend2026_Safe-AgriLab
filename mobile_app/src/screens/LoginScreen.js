import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { COLORS, SIZES, FONTS, SHADOWS } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ route, navigation }) {
  const initialIsSignup = route.params?.isSignup ?? false;
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(initialIsSignup);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    if (!phone || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setError('');

    const fakeEmail = `${phone}@mofiala.com`;

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, fakeEmail, password);
      } else {
        await signInWithEmailAndPassword(auth, fakeEmail, password);
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Numéro ou mot de passe incorrect.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Ce numéro est déjà utilisé. Connectez-vous.');
      } else if (err.code === 'auth/weak-password') {
        setError('Le mot de passe doit faire au moins 6 caractères.');
      } else {
        setError('Une erreur est survenue. Vérifiez votre connexion.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <LinearGradient colors={[COLORS.primary, '#1C1917']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Image source={require('../../assets/mofiala_icon.png')} style={styles.logo} resizeMode="cover" />
          <Text style={styles.appName}>Mofiala</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{isSignup ? 'Créer un compte' : 'Connexion'}</Text>
          <Text style={styles.desc}>
            {isSignup ? "Rejoignez Mofiala et transformez vos récoltes." : "Bon retour parmi nous !"}
          </Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Numéro de téléphone"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="phone-pad"
              autoCapitalize="none"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity 
            style={styles.mainButton} 
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.mainButtonText}>
                  {isSignup ? "S'inscrire" : 'Se connecter'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignup(!isSignup)} style={styles.switchButton}>
            <Text style={styles.switchText}>
              {isSignup ? "Déjà un compte ? Se connecter" : "Pas encore de compte ? S'inscrire"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: SIZES.lg },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 5 },
  header: { alignItems: 'center', marginBottom: SIZES.xl },
  logo: { width: 120, height: 120, borderRadius: 60, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  appName: { fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium', fontSize: 36, fontWeight: '900', color: '#FFF', letterSpacing: 4, textTransform: 'uppercase' },
  card: { 
    padding: SIZES.xl, 
    backgroundColor: '#FFFFFF', 
    borderRadius: SIZES.radius.xl,
    ...SHADOWS.large 
  },
  cardTitle: { fontFamily: FONTS.heading, fontSize: 26, fontWeight: 'bold', color: COLORS.textLight, marginBottom: 8, textAlign: 'center' },
  desc: { fontFamily: FONTS.body, fontSize: 15, color: COLORS.textMuted, textAlign: 'center', marginBottom: SIZES.xl },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: SIZES.radius.md,
    marginBottom: SIZES.md,
    paddingHorizontal: SIZES.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: SIZES.md,
    fontSize: 16,
    color: COLORS.textLight,
    fontFamily: FONTS.body,
  },
  mainButton: {
    backgroundColor: COLORS.secondary, // Terre Cuite
    paddingVertical: 16,
    borderRadius: SIZES.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: SIZES.md,
    ...SHADOWS.medium,
  },
  mainButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', fontFamily: FONTS.heading, marginRight: 8 },
  switchButton: { marginTop: SIZES.lg, alignItems: 'center' },
  switchText: { color: COLORS.primary, fontSize: 15, fontWeight: 'bold', fontFamily: FONTS.body },
  errorText: { color: COLORS.danger, marginBottom: SIZES.md, textAlign: 'center', fontWeight: 'bold' }
});
