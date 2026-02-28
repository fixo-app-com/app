import { render, screen } from "@testing-library/react-native";
import SettingsScreen from "./SettingsScreen";

jest.mock("expo-constants", () => ({
  __esModule: true,
  default: { expoConfig: { version: "1.0.0" } },
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "test@example.com", uid: "test-uid" },
  }),
}));

jest.mock("../../../services/auth", () => ({
  signOut: jest.fn(),
  deleteAccount: jest.fn(),
}));

describe("SettingsScreen", () => {
  it("renders title", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("Settings")).toBeOnTheScreen();
  });

  it("renders user email", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("test@example.com")).toBeOnTheScreen();
  });

  it("renders sign out button", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("Sign out")).toBeOnTheScreen();
  });

  it("renders delete account button", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("Delete Account")).toBeOnTheScreen();
  });

  it("renders legal section links", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("Privacy Policy")).toBeOnTheScreen();
    expect(screen.getByText("Terms of Service")).toBeOnTheScreen();
    expect(screen.getByText("Support")).toBeOnTheScreen();
  });

  it("renders version info", () => {
    render(<SettingsScreen />);
    expect(screen.getByText(/Fixo v/)).toBeOnTheScreen();
  });
});
