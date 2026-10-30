import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
  const { user, token, signOut, isLoading } = useAuth();

  async function executarLogout() {
    try {
      await signOut();
    } catch (error) {
      Alert.alert(
        'Não foi possível sair',
        'A sessão não pôde ser removida do armazenamento. Tente novamente.',
      );
      console.warn('Falha ao encerrar a sessão:', error);
    }
  }

  function handleLogout() {
    const mensagem = 'Deseja realmente encerrar sua sessão?';

    if (Platform.OS === 'web') {
      if (typeof globalThis.confirm === 'function' && globalThis.confirm(mensagem)) {
        executarLogout();
      }
      return;
    }

    Alert.alert('Sair do Meu Curso', mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: executarLogout,
      },
    ]);
  }

  if (!user) return null;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.nome.charAt(0).toUpperCase()}</Text>
        </View>

        <Text style={styles.welcome}>Bem-vindo(a), {user.nome}!</Text>
        <Text style={styles.message}>
          Você está na área restrita do Meu Curso.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Nome do aluno</Text>
          <Text style={styles.infoValue}>{user.nome}</Text>

          <Text style={styles.infoLabel}>E-mail</Text>
          <Text style={styles.infoValue}>{user.email}</Text>

          <Text style={styles.infoLabel}>Curso</Text>
          <Text style={styles.infoValue}>{user.curso}</Text>

          <Text style={styles.infoLabel}>Módulo</Text>
          <Text style={styles.infoValue}>{user.modulo}</Text>

          <Text style={styles.infoLabel}>Token recebido</Text>
          <Text style={styles.token} selectable>{token}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && !isLoading && styles.buttonPressed,
            isLoading && styles.buttonDisabled,
          ]}
          onPress={handleLogout}
          disabled={isLoading}
          accessibilityRole="button"
        >
          {isLoading ? (
            <ActivityIndicator color="#b91c1c" />
          ) : (
            <Text style={styles.buttonText}>Sair</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatar: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: '#2563eb',
    marginBottom: 18,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
  },
  welcome: {
    color: '#0f172a',
    fontSize: 26,
    fontWeight: '800',
  },
  message: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 6,
  },
  infoBox: {
    marginTop: 24,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
  },
  infoLabel: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },
  infoValue: {
    color: '#0f172a',
    fontSize: 16,
    marginBottom: 15,
  },
  token: {
    color: '#1d4ed8',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    minHeight: 50,
    paddingVertical: 14,
    marginTop: 24,
  },
  buttonPressed: {
    backgroundColor: '#fecaca',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#b91c1c',
    fontSize: 16,
    fontWeight: '700',
  },
});
