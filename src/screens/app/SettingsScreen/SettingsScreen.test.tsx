import { render, screen } from "@testing-library/react-native";
import SettingsScreen from "./SettingsScreen";
import { mockAuthContextDefaults } from "../../../test/mocks";

jest.mock("expo-constants", () => ({
  __esModule: true,
  default: { expoConfig: { version: "1.0.0" } },
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({
    ...mockAuthContextDefaults,
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
    expect(screen.getAllByText("settings.title").length).toBeGreaterThanOrEqual(1);
  });

  it("renders user email", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("test@example.com")).toBeOnTheScreen();
  });

  it("renders sign out button", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("settings.signOut")).toBeOnTheScreen();
  });

  it("renders delete account button", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("settings.deleteAccount")).toBeOnTheScreen();
  });

  it("renders legal section links", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("settings.privacyPolicy")).toBeOnTheScreen();
    expect(screen.getByText("settings.termsOfService")).toBeOnTheScreen();
    expect(screen.getByText("settings.support")).toBeOnTheScreen();
  });

  it("renders version info", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("settings.version")).toBeOnTheScreen();
  });
});
