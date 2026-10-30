import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as autenticar } from '../services/authService';
import {
  recuperarSessao,
  removerSessao,
  salvarSessao,
} from '../services/sessionStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function verificarSessaoSalva() {
      try {
        const session = await recuperarSessao(AsyncStorage);
        if (isMounted && session) {
          setUser(session.user);
          setToken(session.token);
        }
      } catch (error) {
        console.warn('Não foi possível recuperar a sessão salva:', error);
        try {
          await removerSessao(AsyncStorage);
        } catch (storageError) {
          console.warn('Não foi possível limpar a sessão inválida:', storageError);
        }
      } finally {
        if (isMounted) setIsRestoringSession(false);
      }
    }

    verificarSessaoSalva();
    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(async (email, senha) => {
    setIsLoading(true);
    try {
      const session = await autenticar(email, senha);
      // Só autentica o usuário depois que a sessão for persistida com sucesso.
      await salvarSessao(AsyncStorage, session);
      setUser(session.user);
      setToken(session.token);
      return session;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await removerSessao(AsyncStorage);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    isLoading,
    isRestoringSession,
    isAuthenticated: Boolean(user && token),
    signIn,
    signOut,
  }), [user, token, isLoading, isRestoringSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider.');
  }
  return context;
}
