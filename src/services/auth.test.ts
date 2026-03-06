import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import i18n from "../i18n";
import {
  signInWithEmail,
  signUpWithEmail,
  resendVerificationEmail,
  signInWithGoogle,
  signInWithApple,
  deleteAccount,
  signOut,
  getFirebaseAuthErrorMessage,
} from "./auth";

jest.mock("./firestore", () => ({
  deleteAllUserData: jest.fn(() => Promise.resolve()),
}));

// Create a stable auth instance shared across all auth() calls in source + test
const mockAuthInstance = {
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithCredential: jest.fn(),
  signOut: jest.fn(),
  revokeToken: jest.fn(),
  onAuthStateChanged: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  fetchSignInMethodsForEmail: jest.fn(),
  currentUser: null as Record<string, unknown> | null,
};

beforeEach(() => {
  (auth as unknown as jest.Mock).mockReturnValue(mockAuthInstance);
});

describe("signInWithEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth as unknown as jest.Mock).mockReturnValue(mockAuthInstance);
    mockAuthInstance.currentUser = null;
  });

  it("calls signInWithEmailAndPassword", async () => {
    const mockCred = { user: { uid: "123" } };
    mockAuthInstance.signInWithEmailAndPassword.mockResolvedValueOnce(mockCred);

    const result = await signInWithEmail("a@b.com", "pass");
    expect(mockAuthInstance.signInWithEmailAndPassword).toHaveBeenCalledWith(
      "a@b.com",
      "pass",
    );
    expect(result).toBe(mockCred);
  });
});

describe("signUpWithEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth as unknown as jest.Mock).mockReturnValue(mockAuthInstance);
    mockAuthInstance.currentUser = null;
  });

  it("creates user and sends verification email", async () => {
    const sendEmailVerification = jest.fn();
    const mockCred = { user: { uid: "123", sendEmailVerification } };
    mockAuthInstance.createUserWithEmailAndPassword.mockResolvedValueOnce(
      mockCred,
    );

    const result = await signUpWithEmail("a@b.com", "pass");
    expect(
      mockAuthInstance.createUserWithEmailAndPassword,
    ).toHaveBeenCalledWith("a@b.com", "pass");
    expect(sendEmailVerification).toHaveBeenCalled();
    expect(result).toBe(mockCred);
  });
});

describe("resendVerificationEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth as unknown as jest.Mock).mockReturnValue(mockAuthInstance);
    mockAuthInstance.currentUser = null;
  });

  it("throws if no current user", async () => {
    await expect(resendVerificationEmail()).rejects.toThrow(
      "No user is currently signed in.",
    );
  });

  it("sends verification email if user exists", async () => {
    const sendEmailVerification = jest.fn();
    mockAuthInstance.currentUser = { sendEmailVerification };

    await resendVerificationEmail();
    expect(sendEmailVerification).toHaveBeenCalled();
  });
});

describe("signInWithGoogle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth as unknown as jest.Mock).mockReturnValue(mockAuthInstance);
    mockAuthInstance.currentUser = null;
  });

  it("signs in with Google credential", async () => {
    (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValueOnce(true);
    (GoogleSignin.signIn as jest.Mock).mockResolvedValueOnce({
      data: { idToken: "google-token" },
    });
    (isSuccessResponse as unknown as jest.Mock).mockReturnValueOnce(true);
    (auth.GoogleAuthProvider.credential as jest.Mock).mockReturnValueOnce(
      "mock-credential",
    );
    const mockCred = { user: { uid: "g-123" } };
    mockAuthInstance.signInWithCredential.mockResolvedValueOnce(mockCred);

    const result = await signInWithGoogle();
    expect(auth.GoogleAuthProvider.credential).toHaveBeenCalledWith(
      "google-token",
    );
    expect(mockAuthInstance.signInWithCredential).toHaveBeenCalledWith(
      "mock-credential",
    );
    expect(result).toBe(mockCred);
  });

  it("throws if sign in was cancelled", async () => {
    (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValueOnce(true);
    (GoogleSignin.signIn as jest.Mock).mockResolvedValueOnce({});
    (isSuccessResponse as unknown as jest.Mock).mockReturnValueOnce(false);

    await expect(signInWithGoogle()).rejects.toThrow(
      "Google Sign-In was cancelled",
    );
  });
});

describe("signInWithApple", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth as unknown as jest.Mock).mockReturnValue(mockAuthInstance);
    mockAuthInstance.currentUser = null;
  });

  it("signs in with Apple credential and nonce", async () => {
    (AppleAuthentication.signInAsync as jest.Mock).mockResolvedValueOnce({
      identityToken: "apple-token",
      fullName: null,
    });
    const mockCred = { user: { uid: "a-123", displayName: null } };
    mockAuthInstance.signInWithCredential.mockResolvedValueOnce(mockCred);

    const result = await signInWithApple();
    expect(AppleAuthentication.signInAsync).toHaveBeenCalled();
    expect(mockAuthInstance.signInWithCredential).toHaveBeenCalled();
    expect(result).toBe(mockCred);
  });

  it("throws if no identity token", async () => {
    (AppleAuthentication.signInAsync as jest.Mock).mockResolvedValueOnce({
      identityToken: null,
    });

    await expect(signInWithApple()).rejects.toThrow(
      "No identity token returned from Apple Sign-In",
    );
  });
});

describe("deleteAccount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth as unknown as jest.Mock).mockReturnValue(mockAuthInstance);
    mockAuthInstance.currentUser = null;
  });

  it("throws if no current user", async () => {
    await expect(deleteAccount()).rejects.toThrow(
      "No user is currently signed in.",
    );
  });

  it("deletes user data and account for email user", async () => {
    const deleteFn = jest.fn();
    mockAuthInstance.currentUser = {
      uid: "test-uid",
      providerData: [{ providerId: "password" }],
      delete: deleteFn,
    };

    await deleteAccount();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { deleteAllUserData } = require("./firestore");
    expect(deleteAllUserData).toHaveBeenCalledWith("test-uid");
    expect(deleteFn).toHaveBeenCalled();
  });

  it("signs out Google for Google user", async () => {
    const deleteFn = jest.fn();
    mockAuthInstance.currentUser = {
      uid: "test-uid",
      providerData: [{ providerId: "google.com" }],
      delete: deleteFn,
    };

    await deleteAccount();
    expect(GoogleSignin.signOut).toHaveBeenCalled();
    expect(deleteFn).toHaveBeenCalled();
  });
});

describe("signOut", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth as unknown as jest.Mock).mockReturnValue(mockAuthInstance);
    mockAuthInstance.currentUser = null;
  });

  it("calls auth().signOut()", async () => {
    await signOut();
    expect(mockAuthInstance.signOut).toHaveBeenCalled();
  });

  it("signs out Google if user is a Google user", async () => {
    mockAuthInstance.currentUser = {
      providerData: [{ providerId: "google.com" }],
    };

    await signOut();
    expect(GoogleSignin.signOut).toHaveBeenCalled();
    expect(mockAuthInstance.signOut).toHaveBeenCalled();
  });
});

describe("getFirebaseAuthErrorMessage", () => {
  it("returns i18n key if it exists", () => {
    (i18n.exists as jest.Mock).mockReturnValueOnce(true);
    const result = getFirebaseAuthErrorMessage("auth/user-not-found");
    expect(result).toBe("authErrors.auth/user-not-found");
  });

  it("returns fallback for unknown code", () => {
    (i18n.exists as jest.Mock).mockReturnValueOnce(false);
    const result = getFirebaseAuthErrorMessage("auth/unknown-error");
    expect(result).toBe("authErrors.default");
  });
});
