import * as Crypto from "expo-crypto";
import * as AppleAuthentication from "expo-apple-authentication";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { deleteAllUserData } from "./firestore";
import i18n from "../i18n";

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

export async function signInWithApple(): Promise<FirebaseAuthTypes.UserCredential> {
  const rawNonce = Array.from(Crypto.getRandomValues(new Uint8Array(32)), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );

  const appleCredential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  const { identityToken } = appleCredential;
  if (!identityToken) {
    throw new Error("No identity token returned from Apple Sign-In");
  }

  const oauthCredential = {
    providerId: "apple.com",
    token: identityToken,
    secret: rawNonce,
  } as FirebaseAuthTypes.AuthCredential;
  const userCredential = await auth().signInWithCredential(oauthCredential);

  if (appleCredential.fullName) {
    const { givenName, familyName } = appleCredential.fullName;
    const displayName = [givenName, familyName].filter(Boolean).join(" ");
    if (displayName && !userCredential.user.displayName) {
      await userCredential.user.updateProfile({ displayName });
    }
  }

  return userCredential;
}

export async function deleteAccount(): Promise<void> {
  const currentUser = auth().currentUser;
  if (!currentUser) {
    throw new Error("No user is currently signed in.");
  }

  await deleteAllUserData(currentUser.uid);

  const isGoogleUser = currentUser.providerData.some(
    (p) => p.providerId === "google.com",
  );
  if (isGoogleUser) {
    try {
      await GoogleSignin.signOut();
    } catch {
      // ignore
    }
  }

  const isAppleUser = currentUser.providerData.some(
    (p) => p.providerId === "apple.com",
  );
  if (isAppleUser) {
    try {
      const { authorizationCode } = await AppleAuthentication.signInAsync({
        requestedScopes: [],
      });
      if (authorizationCode) {
        await auth().revokeToken(authorizationCode);
      }
    } catch {
      // Apple token revocation may fail — continue with deletion
    }
  }

  await currentUser.delete();
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

export async function checkEmailExists(email: string): Promise<boolean> {
  const methods = await auth().fetchSignInMethodsForEmail(email);
  return methods.length > 0;
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
  const key = `authErrors.${code}`;
  if (i18n.exists(key)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return i18n.t(key as any);
  }
  return i18n.t("authErrors.default");
}
