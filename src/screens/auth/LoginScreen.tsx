import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill in all fields');
    try {
      await login(email, password);
    } catch {}
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🎵</Text>
        <Text style={[typography.h1, styles.title]}>SingLearn</Text>
        <Text style={[typography.bodySmall, styles.subtitle]}>Learn English through music</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? <Text style={styles.linkBold}>Sign Up</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 48 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { marginBottom: 8 },
  subtitle: { textAlign: 'center' },
  form: { gap: 16 },
  input: {
    backgroundColor: colors.surface, borderRadius: 12, padding: 16,
    color: colors.text, fontSize: 16, borderWidth: 1, borderColor: colors.border,
  },
  error: { color: colors.error, textAlign: 'center', fontSize: 14 },
  button: {
    backgroundColor: colors.primary, borderRadius: 12, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  link: { color: colors.textSecondary, textAlign: 'center', marginTop: 16, fontSize: 14 },
  linkBold: { color: colors.primary, fontWeight: '700' },
});
