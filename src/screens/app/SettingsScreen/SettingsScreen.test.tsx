import { render, screen } from "@testing-library/react-native";
import SettingsScreen from "./SettingsScreen";

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "test@example.com", uid: "test-uid" },
  }),
}));

jest.mock("../../../services/auth", () => ({
  signOut: jest.fn(),
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
});
