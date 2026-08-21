"use client";

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { AuthService, AuthUser, getAuthService } from "../services/authService";

export interface AuthContextValue {
  user: AuthUser | null;
  isInitializing: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getAuthToken: (forceRefresh?: boolean) => Promise<string | null>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  children: React.ReactNode;
  authServiceOverride?: AuthService;
}

export function AuthProvider({ children, authServiceOverride }: AuthProviderProps) {
  const authService = useMemo(() => authServiceOverride || getAuthService(), [authServiceOverride]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        await authService.processRedirectResult();
      } catch (err) {
        console.error("Error al procesar redirect de autenticación:", err);
      }

      const unsubscribe = authService.onAuthStateChanged((currentUser) => {
        if (isMounted) {
          setUser(currentUser);
          setIsInitializing(false);
        }
      });

      return unsubscribe;
    }

    let unsubscribeFn: (() => void) | undefined;
    initAuth().then((unsub) => {
      unsubscribeFn = unsub;
    });

    return () => {
      isMounted = false;
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, [authService]);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const loggedUser = await authService.loginWithGoogle();
      setUser(loggedUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión con Google.";
      setError(message);
      throw err;
    }
  }, [authService]);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cerrar sesión.";
      setError(message);
      throw err;
    }
  }, [authService]);

  const getAuthToken = useCallback(
    async (forceRefresh?: boolean) => {
      return authService.getIdToken(forceRefresh);
    },
    [authService]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isInitializing,
      error,
      loginWithGoogle,
      logout,
      getAuthToken,
      clearError,
    }),
    [user, isInitializing, error, loginWithGoogle, logout, getAuthToken, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
