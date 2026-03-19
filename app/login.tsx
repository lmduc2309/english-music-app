import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useStore } from '../src/store';
import { COLORS, FONTS, SPACING } from '../src/utils/theme';

export default function LoginScreen() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useStore();

  const handleSubmit = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please fill in all fields'); return; }
    if (isRegister && !displayName) { Alert.alert('Error', 'Please enter your name'); return; }
    setLoading(true);
    try {
      if (isRegister) await register(email, password, displayName);
      else await login(email, password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Text style={styles.logo}>🎵</Text>
        <Text style={styles.title}>SingLish</Text>
        <Text style={styles.subtitle}>Learn English through music</Text>
      </View>
      <View style={styles.form}>
        {isRegister && (
          <TextInput style={styles.input} placeholder="Your name" placeholderTextColor={COLORS.textMuted}
            value={displayName} onChangeText={setDisplayName} autoCapitalize="words" />
        )}
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={COLORS.textMuted}
          value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor={COLORS.textMuted}
          value={password} onChangeText={setPassword} secureTextEntry />
        <Pressable style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color={COLORS.text} /> : (
            <Text style={styles.buttonText}>{isRegister ? 'Create Account' : 'Sign In'}</Text>
          )}
        </Pressable>
        <Pressable style={styles.switchBtn} onPress={() => setIsRegister(!isRegister)}>
          <Text style={styles.switchText}>
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', padding: SPACING.lg },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  logo: { fontSize: 64, marginBottom: SPACING.sm },
  title: { fontSize: FONTS.sizes.hero, fontWeight: '800', color: COLORS.primary },
  subtitle: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, marginTop: SPACING.xs },
  form: { width: '100%' },
  input: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, color: COLORS.text, fontSize: FONTS.sizes.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  button: { backgroundColor: COLORS.primary, borderRadius: 12, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.sm },
  buttonText: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: '700' },
  switchBtn: { alignItems: 'center', marginTop: SPACING.lg },
  switchText: { color: COLORS.primaryLight, fontSize: FONTS.sizes.sm },
});
