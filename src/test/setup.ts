import "@testing-library/react-native/matchers";

// Mock @react-native-firebase/auth
jest.mock("@react-native-firebase/auth", () => {
  const mockOnAuthStateChanged = jest.fn((callback) => {
    // By default, simulate no user (logged out)
    callback(null);
    return jest.fn(); // unsubscribe
  });

  const mockAuth = Object.assign(
    jest.fn(() => ({
      onAuthStateChanged: mockOnAuthStateChanged,
      signInWithEmailAndPassword: jest.fn(),
      createUserWithEmailAndPassword: jest.fn(),
      signOut: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
      signInWithCredential: jest.fn(),
      currentUser: null,
    })),
    {
      GoogleAuthProvider: {
        credential: jest.fn(),
      },
    },
  );

  return {
    __esModule: true,
    default: mockAuth,
    FirebaseAuthTypes: {},
  };
});

// Mock @react-native-google-signin/google-signin
jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
  isSuccessResponse: jest.fn(),
}));

// Mock react-native-screens
jest.mock("react-native-screens", () => {
  const actual = jest.requireActual("react-native-screens");
  return {
    ...actual,
    enableScreens: jest.fn(),
  };
});
