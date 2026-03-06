import { renderHook, act } from "@testing-library/react-native";
import { Alert } from "react-native";
import { useSocialAuth } from "./useSocialAuth";
import {
  signInWithGoogle,
  signInWithApple,
  getFirebaseAuthErrorMessage,
} from "../services/auth";

jest.mock("../services/auth", () => ({
  signInWithGoogle: jest.fn(),
  signInWithApple: jest.fn(),
  getFirebaseAuthErrorMessage: jest.fn((code: string) => `Error: ${code}`),
}));

jest.spyOn(Alert, "alert");

const mockSignInWithGoogle = signInWithGoogle as jest.Mock;
const mockSignInWithApple = signInWithApple as jest.Mock;

describe("useSocialAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns initial state", () => {
    const { result } = renderHook(() => useSocialAuth());
    expect(result.current.loadingAction).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  // --- Google Auth ---

  it("calls signInWithGoogle and resets loading on success", async () => {
    mockSignInWithGoogle.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSocialAuth());

    await act(() => result.current.handleGoogleAuth());

    expect(signInWithGoogle).toHaveBeenCalledTimes(1);
    expect(result.current.loadingAction).toBeNull();
  });

  it("shows alert for account-exists-with-different-credential (Google)", async () => {
    mockSignInWithGoogle.mockRejectedValue({
      code: "auth/account-exists-with-different-credential",
    });
    const { result } = renderHook(() => useSocialAuth());

    await act(() => result.current.handleGoogleAuth());

    expect(Alert.alert).toHaveBeenCalledWith(
      "auth.existingAccountTitle",
      "auth.existingAccountGoogle",
    );
    expect(result.current.loadingAction).toBeNull();
  });

  it("shows generic error alert for Google auth failure", async () => {
    mockSignInWithGoogle.mockRejectedValue({ code: "auth/internal-error" });
    const { result } = renderHook(() => useSocialAuth());

    await act(() => result.current.handleGoogleAuth());

    expect(getFirebaseAuthErrorMessage).toHaveBeenCalledWith(
      "auth/internal-error",
    );
    expect(Alert.alert).toHaveBeenCalledWith("common.error", "Error: auth/internal-error");
  });

  it("does not show alert when Google Sign-In is cancelled", async () => {
    mockSignInWithGoogle.mockRejectedValue(
      new Error("Google Sign-In was cancelled"),
    );
    const { result } = renderHook(() => useSocialAuth());

    await act(() => result.current.handleGoogleAuth());

    expect(Alert.alert).not.toHaveBeenCalled();
  });

  // --- Apple Auth ---

  it("calls signInWithApple and resets loading on success", async () => {
    mockSignInWithApple.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSocialAuth());

    await act(() => result.current.handleAppleAuth());

    expect(signInWithApple).toHaveBeenCalledTimes(1);
    expect(result.current.loadingAction).toBeNull();
  });

  it("shows alert for account-exists-with-different-credential (Apple)", async () => {
    mockSignInWithApple.mockRejectedValue({
      code: "auth/account-exists-with-different-credential",
    });
    const { result } = renderHook(() => useSocialAuth());

    await act(() => result.current.handleAppleAuth());

    expect(Alert.alert).toHaveBeenCalledWith(
      "auth.existingAccountTitle",
      "auth.existingAccountOther",
    );
  });

  it("shows generic error alert for Apple auth failure", async () => {
    mockSignInWithApple.mockRejectedValue({ code: "auth/network-request-failed" });
    const { result } = renderHook(() => useSocialAuth());

    await act(() => result.current.handleAppleAuth());

    expect(getFirebaseAuthErrorMessage).toHaveBeenCalledWith(
      "auth/network-request-failed",
    );
    expect(Alert.alert).toHaveBeenCalledWith(
      "common.error",
      "Error: auth/network-request-failed",
    );
  });

  it("ignores non-auth errors for Apple sign-in", async () => {
    mockSignInWithApple.mockRejectedValue({
      code: "ERR_REQUEST_CANCELED",
    });
    const { result } = renderHook(() => useSocialAuth());

    await act(() => result.current.handleAppleAuth());

    expect(Alert.alert).not.toHaveBeenCalled();
    expect(result.current.loadingAction).toBeNull();
  });
});
