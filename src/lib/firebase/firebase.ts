import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { env } from "../env/env";

let firebaseAppInstance: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error("Firebase solo debe inicializarse en el entorno del cliente.");
  }

  if (env.NEXT_PUBLIC_USE_MOCKS) {
    throw new Error("Firebase no debe inicializarse cuando el modo mock (NEXT_PUBLIC_USE_MOCKS=true) está activo.");
  }

  if (!firebaseAppInstance) {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      firebaseAppInstance = existingApps[0];
    } else {
      firebaseAppInstance = initializeApp({
        apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
      });
    }
  }

  return firebaseAppInstance;
}

export function getFirebaseAuth(): Auth {
  if (!firebaseAuthInstance) {
    const app = getFirebaseApp();
    firebaseAuthInstance = getAuth(app);
  }
  return firebaseAuthInstance;
}
