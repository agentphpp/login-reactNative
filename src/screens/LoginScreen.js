// screens/LoginScreen.js
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { showAlert } from '../utils/alert';

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function handleLogin() {
    if (!email.trim() || !senha) {
      showAlert('Atenção', 'Preencha o e-mail e a senha.');
      return;
    }

    try {
      await signIn(email.trim(), senha);
    } catch (error) {
      showAlert(
        'Não foi possível entrar',
        error.message || 'Tente novamente.'
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.badge}>PAM II</Text>
          <Text style={styles.title}>Meu Curso</Text>
          <Text style={styles.subtitle}>
            Entre para acessar suas informações acadêmicas.
          </Text>

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seuemail@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            returnKeyType="next"
            accessibilityLabel="E-mail"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite sua senha"
            secureTextEntry
            autoCapitalize="none"
            editable={!isLoading}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            accessibilityLabel="Senha"
          />

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && !isLoading && styles.buttonPressed,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
            accessibilityRole="button"
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </Pressable>

          <View style={styles.credentialsBox}>
            <Text style={styles.credentialsTitle}>Credenciais para teste</Text>
            <Text style={styles.credentialsText}>
              E-mail: aluno@etec.sp.gov.br
            </Text>
            <Text style={styles.credentialsText}>Senha: pam2026</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff6ff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#0f172a',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  badge: {
    alignSelf: 'flex-start',
    color: '#1d4ed8',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 6,
    marginBottom: 24,
    lineHeight: 23,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  button: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 10,
    marginTop: 4,
  },
  buttonPressed: {
    backgroundColor: '#1d4ed8',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  credentialsBox: {
    marginTop: 22,
    padding: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  credentialsTitle: {
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  credentialsText: {
    color: '#64748b',
    lineHeight: 21,
  },
});