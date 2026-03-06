import React from "react";
import { Text } from "react-native";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ErrorBoundary } from "./ErrorBoundary";

// Stable crashlytics mock
const mockRecordError = jest.fn();
const mockLog = jest.fn();
jest.mock("@react-native-firebase/crashlytics", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    recordError: mockRecordError,
    log: mockLog,
  })),
}));

// Suppress console.error for expected error boundary logs
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === "string" ? args[0] : "";
    if (
      msg.includes("Error Boundary") ||
      msg.includes("The above error") ||
      msg.includes("componentStack") ||
      msg.includes("Test error")
    ) {
      return;
    }
    originalConsoleError(...args);
  };
});
afterAll(() => {
  console.error = originalConsoleError;
});

function ProblemChild(): React.JSX.Element {
  throw new Error("Test error");
}

describe("ErrorBoundary", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <Text>Hello</Text>
      </ErrorBoundary>,
    );
    expect(screen.getByText("Hello")).toBeTruthy();
  });

  it("shows error UI when child throws", () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    );
    expect(screen.getByText("errorBoundary.title")).toBeTruthy();
    expect(screen.getByText("errorBoundary.message")).toBeTruthy();
    expect(screen.getByText("errorBoundary.restart")).toBeTruthy();
  });

  it("calls crashlytics().recordError on catch", () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    );
    expect(mockRecordError).toHaveBeenCalledWith(expect.any(Error));
  });

  it("restart button resets error state and re-renders children", () => {
    let shouldThrow = true;

    function MaybeThrow() {
      if (shouldThrow) throw new Error("Test error");
      return <Text>Recovered</Text>;
    }

    render(
      <ErrorBoundary>
        <MaybeThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByText("errorBoundary.title")).toBeTruthy();

    // Fix the child, then press restart
    shouldThrow = false;
    fireEvent.press(screen.getByText("errorBoundary.restart"));

    expect(screen.getByText("Recovered")).toBeTruthy();
  });
});
