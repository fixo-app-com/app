import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";

const WEB_CLIENT_ID =
  "903158549460-8o3b9bgcc72voq0mr3cu208g2a0f9pdp.apps.googleusercontent.com";

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  iosClientId:
    "903158549460-ca4g84q09i0kk1l9uusdsi91s9agebp5.apps.googleusercontent.com",
});

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.UserCredential> {
  return auth().signInWithEmailAndPassword(email, password);
}

export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.UserCredential> {
  const userCredential = await auth().createUserWithEmailAndPassword(
    email,
    password,
  );
  await userCredential.user.sendEmailVerification();
  return userCredential;
}

export async function resendVerificationEmail(): Promise<void> {
  const currentUser = auth().currentUser;
  if (!currentUser) {
    throw new Error("No user is currently signed in.");
  }
  return currentUser.sendEmailVerification();
}

export async function signInWithGoogle(): Promise<FirebaseAuthTypes.UserCredential> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: false });
  const response = await GoogleSignin.signIn();

  if (!isSuccessResponse(response)) {
    throw new Error("Google Sign-In was cancelled");
  }

  const { idToken } = response.data;
  if (!idToken) {
    throw new Error("No ID token returned from Google Sign-In");
  }

  const credential = auth.GoogleAuthProvider.credential(idToken);
  return auth().signInWithCredential(credential);
}

export async function signOut(): Promise<void> {
  const currentUser = auth().currentUser;
  if (currentUser?.providerData.some((p) => p.providerId === "google.com")) {
    try {
      await GoogleSignin.signOut();
    } catch {
      // Google sign out may fail if not signed in via Google — ignore
    }
  }
  return auth().signOut();
}

export async function resetPassword(email: string): Promise<void> {
  return auth().sendPasswordResetEmail(email);
}

export async function linkGoogleToEmailAccount(
  email: string,
  password: string,
  googleIdToken: string,
): Promise<FirebaseAuthTypes.UserCredential> {
  const userCredential = await auth().signInWithEmailAndPassword(
    email,
    password,
  );
  const googleCredential = auth.GoogleAuthProvider.credential(googleIdToken);
  return userCredential.user.linkWithCredential(googleCredential);
}

export function getFirebaseAuthErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/invalid-credential":
      return "Invalid credentials. Check your email and password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    case "auth/account-exists-with-different-credential":
      return "An account with this email already exists. Sign in with your password to link Google.";
    default:
      return "An error occurred. Please try again.";
  }
}

export function handleAccountLinkingError(
  error: FirebaseAuthTypes.NativeFirebaseAuthError,
): void {
  if (error.code === "auth/account-exists-with-different-credential") {
    Alert.alert(
      "Existing account",
      "An account with this email already exists with a password. Sign in with your password to link your Google account.",
    );
    return;
  }
  throw error;
}
