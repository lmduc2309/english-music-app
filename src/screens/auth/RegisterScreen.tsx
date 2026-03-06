import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {useAuthStore} from '@/store/authStore';
import {colors, spacing, fontSize, borderRadius} from '@/theme';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {register, isLoading} = useAuthStore();

  const handleRegister = async () => {
    if (!email.trim() || !username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    try {
      await register(email.trim(), username.trim(), password);
    } catch (e: any) {
      Alert.alert('Registration Failed', e.response?.data?.message || 'Please try again');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎤</Text>
        <Text style={styles.title}>Join the Stage!</Text>
        <Text style={styles.subtitle}>Start your musical English journey</Text>

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
            placeholder="Username"
            placeholderTextColor={colors.textMuted}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password (min 8 characters)"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xl},
  emoji: {fontSize: 64, textAlign: 'center', marginBottom: spacing.md},
  title: {
    fontSize: fontSize.title,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  form: {gap: spacing.md},
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.md,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: {opacity: 0.6},
  buttonText: {color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: '700'},
  linkButton: {alignItems: 'center', marginTop: spacing.md},
  linkText: {color: colors.textSecondary, fontSize: fontSize.md},
  linkBold: {color: colors.primary, fontWeight: '700'},
});

export default RegisterScreen;
