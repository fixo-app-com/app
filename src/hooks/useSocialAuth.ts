import { useState } from "react";
import { Alert } from "react-native";
import {
  signInWithGoogle,
  signInWithApple,
  getFirebaseAuthErrorMessage,
} from "../services/auth";

type LoadingAction = "email" | "apple" | "google" | null;

export function useSocialAuth() {
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);

  const isLoading = loadingAction !== null;

  async function handleGoogleAuth() {
    setLoadingAction("google");
    try {
      await signInWithGoogle();
    } catch (error) {
      const firebaseError = error as { code?: string };
      if (
        firebaseError.code === "auth/account-exists-with-different-credential"
      ) {
        Alert.alert(
          "Existing account",
          "An account with this email already exists. Sign in with your password to link Google.",
        );
        return;
      }
      if ((error as Error).message !== "Google Sign-In was cancelled") {
        Alert.alert(
          "Error",
          getFirebaseAuthErrorMessage(firebaseError.code ?? ""),
        );
      }
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleAppleAuth() {
    setLoadingAction("apple");
    try {
      await signInWithApple();
    } catch (error) {
      const errorCode = (error as { code?: string }).code ?? "";
      if (errorCode === "ERR_REQUEST_CANCELED") return;
      if (errorCode === "auth/account-exists-with-different-credential") {
        Alert.alert(
          "Existing account",
          "An account with this email already exists. Sign in with your existing method to link this account.",
        );
        return;
      }
      Alert.alert("Error", getFirebaseAuthErrorMessage(errorCode));
    } finally {
      setLoadingAction(null);
    }
  }

  return {
    handleGoogleAuth,
    handleAppleAuth,
    loadingAction,
    setLoadingAction,
    isLoading,
  };
}
