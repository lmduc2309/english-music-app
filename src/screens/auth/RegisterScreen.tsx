import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading, error } = useAuthStore();

  const handleRegister = async () => {
    if (!email || !username || !displayName || !password) return Alert.alert('Error', 'Please fill in all fields');
    if (password.length < 6) return Alert.alert('Error', 'Password must be at least 6 characters');
    try {
      await register({ email, username, password, displayName });
    } catch {}
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.emoji}>🎤</Text>
          <Text style={[typography.h2, styles.title]}>Create Account</Text>
          <Text style={typography.bodySmall}>Start your musical English journey</Text>
        </View>

        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Display Name" placeholderTextColor={colors.textMuted} value={displayName} onChangeText={setDisplayName} />
          <TextInput style={styles.input} placeholder="Username" placeholderTextColor={colors.textMuted} value={username} onChangeText={setUsername} autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Password (min 6 chars)" placeholderTextColor={colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Account'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.link}>Already have an account? <Text style={styles.linkBold}>Sign In</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 36 },
  emoji: { fontSize: 56, marginBottom: 12 },
  title: { marginBottom: 8 },
  form: { gap: 14 },
  input: {
    backgroundColor: colors.surface, borderRadius: 12, padding: 16,
    color: colors.text, fontSize: 16, borderWidth: 1, borderColor: colors.border,
  },
  error: { color: colors.error, textAlign: 'center', fontSize: 14 },
  button: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  link: { color: colors.textSecondary, textAlign: 'center', marginTop: 16, fontSize: 14 },
  linkBold: { color: colors.primary, fontWeight: '700' },
});
