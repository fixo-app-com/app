import { useState } from "react";
import { Alert } from "react-native";
import i18n from "../i18n";
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
          i18n.t("auth.existingAccountTitle"),
          i18n.t("auth.existingAccountGoogle"),
        );
        return;
      }
      if ((error as Error).message !== "Google Sign-In was cancelled") {
        Alert.alert(
          i18n.t("common.error"),
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
          i18n.t("auth.existingAccountTitle"),
          i18n.t("auth.existingAccountOther"),
        );
        return;
      }
      Alert.alert(i18n.t("common.error"), getFirebaseAuthErrorMessage(errorCode));
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
