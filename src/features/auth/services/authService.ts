import {
  GoogleAuthProvider,
  User,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/firebase";
import { env } from "@/lib/env/env";

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
}

export interface AuthService {
  loginWithGoogle(): Promise<AuthUser>;
  logout(): Promise<void>;
  getIdToken(forceRefresh?: boolean): Promise<string | null>;
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;
  processRedirectResult(): Promise<AuthUser | null>;
}

function mapFirebaseUser(user: User | null): AuthUser | null {
  if (!user) return null;
  return {
    id: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoUrl: user.photoURL,
  };
}

function mapFirebaseAuthError(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code: string }).code;
    switch (code) {
      case "auth/popup-closed-by-user":
        return "Inicio de sesión cancelado por el usuario.";
      case "auth/popup-blocked":
        return "El navegador bloqueó la ventana emergente de inicio de sesión. Por favor habilita los popups o intenta nuevamente.";
      case "auth/unauthorized-domain":
        return "El dominio actual no está autorizado en la consola de autenticación.";
      case "auth/network-request-failed":
        return "Error de conexión con el servicio de autenticación. Verifica tu red.";
      case "auth/operation-not-allowed":
        return "El proveedor de Google no está habilitado en la consola de Firebase.";
      default:
        return `Error de autenticación: ${(error as { message?: string }).message || code}`;
    }
  }
  return "Ocurrió un error inesperado al iniciar sesión.";
}

export class FirebaseAuthService implements AuthService {
  async loginWithGoogle(): Promise<AuthUser> {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const isMobile =
      typeof window !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    try {
      if (isMobile) {
        await signInWithRedirect(auth, provider);
        // Will redirect, return dummy or wait for redirect
        return {
          id: "",
          email: null,
          displayName: null,
          photoUrl: null,
        };
      }

      const result = await signInWithPopup(auth, provider);
      const user = mapFirebaseUser(result.user);
      if (!user) throw new Error("No se pudo obtener el usuario autenticado.");
      return user;
    } catch (err) {
      throw new Error(mapFirebaseAuthError(err));
    }
  }

  async logout(): Promise<void> {
    const auth = getFirebaseAuth();
    await signOut(auth);
  }

  async getIdToken(forceRefresh = false): Promise<string | null> {
    const auth = getFirebaseAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    return currentUser.getIdToken(forceRefresh);
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, (firebaseUser) => {
      callback(mapFirebaseUser(firebaseUser));
    });
  }

  async processRedirectResult(): Promise<AuthUser | null> {
    try {
      const auth = getFirebaseAuth();
      const result = await getRedirectResult(auth);
      if (result?.user) {
        return mapFirebaseUser(result.user);
      }
      return null;
    } catch (err) {
      console.error("Error procesando resultado de redirección Firebase:", err);
      return null;
    }
  }
}

export const MOCK_USER: AuthUser = {
  id: "mock-user-1",
  email: "usuario.demo@controlfinanciero.app",
  displayName: "Usuario Demo",
  photoUrl: null,
};

export class MockAuthService implements AuthService {
  private currentUser: AuthUser | null = MOCK_USER;
  private listeners: ((user: AuthUser | null) => void)[] = [];

  async loginWithGoogle(): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    this.currentUser = MOCK_USER;
    this.notifyListeners();
    return this.currentUser;
  }

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    this.currentUser = null;
    this.notifyListeners();
  }

  async getIdToken(): Promise<string | null> {
    return this.currentUser ? "mock-firebase-token-123" : null;
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    this.listeners.push(callback);
    // Notify immediately with current state
    setTimeout(() => callback(this.currentUser), 0);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  async processRedirectResult(): Promise<AuthUser | null> {
    return null;
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener(this.currentUser);
    }
  }
}

let authServiceInstance: AuthService | null = null;

export function getAuthService(): AuthService {
  if (!authServiceInstance) {
    if (env.NEXT_PUBLIC_USE_MOCKS) {
      authServiceInstance = new MockAuthService();
    } else {
      authServiceInstance = new FirebaseAuthService();
    }
  }
  return authServiceInstance;
}
