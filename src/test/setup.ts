import "@testing-library/react-native/matchers";

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => {
  const insets = { top: 47, bottom: 34, left: 0, right: 0 };
  return {
    useSafeAreaInsets: () => insets,
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock @expo/vector-icons/Ionicons
jest.mock("@expo/vector-icons/Ionicons", () => ({
  __esModule: true,
  default: "Ionicons",
}));

// Mock expo-crypto
jest.mock("expo-crypto", () => ({
  getRandomValues: jest.fn((arr: Uint8Array) => arr),
  digestStringAsync: jest.fn(() => Promise.resolve("mocked-hashed-nonce")),
  CryptoDigestAlgorithm: { SHA256: "SHA-256" },
}));

// Mock expo-apple-authentication
jest.mock("expo-apple-authentication", () => ({
  signInAsync: jest.fn(),
  AppleAuthenticationScope: {
    FULL_NAME: 0,
    EMAIL: 1,
  },
}));

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
      revokeToken: jest.fn(),
      currentUser: null,
    })),
    {
      GoogleAuthProvider: {
        credential: jest.fn(),
      },
      OAuthProvider: jest.fn(() => ({
        credential: jest.fn(),
      })),
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

// Mock @react-native-firebase/firestore
/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock("@react-native-firebase/firestore", () => {
  const mockOrderBy = () => ({
    onSnapshot: jest.fn((onResult: (snapshot: { docs: never[] }) => void) => {
      onResult({ docs: [] });
      return jest.fn(); // unsubscribe
    }),
    get: jest.fn(() => Promise.resolve({ docs: [] })),
  });

  const mockWhere = (): any => ({
    where: mockWhere,
    orderBy: mockOrderBy,
  });

  const mockCollection = (): any => ({
    doc: jest.fn((): any => ({
      collection: mockCollection,
      update: jest.fn(),
      delete: jest.fn(),
    })),
    add: jest.fn(() => Promise.resolve({ id: "mock-id" })),
    where: mockWhere,
    orderBy: mockOrderBy,
  });

  const mockFirestore = Object.assign(
    jest.fn(() => ({
      collection: mockCollection,
      batch: jest.fn(() => ({
        delete: jest.fn(),
        commit: jest.fn(() => Promise.resolve()),
      })),
    })),
    {
      FieldValue: {
        serverTimestamp: jest.fn(),
      },
    },
  );

  return {
    __esModule: true,
    default: mockFirestore,
    FirebaseFirestoreTypes: {},
  };
});
/* eslint-enable @typescript-eslint/no-explicit-any */

// Mock @react-native-firebase/crashlytics
jest.mock("@react-native-firebase/crashlytics", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    recordError: jest.fn(),
    log: jest.fn(),
  })),
}));

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const identity = (v: unknown) => v;
  const Easing = {
    linear: identity,
    ease: identity,
    quad: identity,
    cubic: identity,
    in: () => identity,
    out: () => identity,
    inOut: () => identity,
  };
  return {
    useSharedValue: (init: unknown) => ({ value: init }),
    useAnimatedStyle: (fn: () => object) => fn(),
    withTiming: (val: number) => val,
    runOnJS: (fn: (...args: unknown[]) => void) => fn,
    interpolate: jest.fn(),
    Easing,
    default: { View: "Animated.View" },
  };
});

// Mock react-native-gesture-handler/ReanimatedSwipeable
jest.mock("react-native-gesture-handler/ReanimatedSwipeable", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock @react-native-async-storage/async-storage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Mock @gorhom/bottom-sheet
jest.mock("@gorhom/bottom-sheet", () => {
  const PassThrough = ({ children }: { children: React.ReactNode }) => children;
  return {
    __esModule: true,
    default: PassThrough,
    BottomSheetModal: PassThrough,
    BottomSheetModalProvider: PassThrough,
    BottomSheetView: PassThrough,
    BottomSheetBackdrop: () => null,
  };
});

// Mock react-native-screens
jest.mock("react-native-screens", () => {
  const actual = jest.requireActual("react-native-screens");
  return {
    ...actual,
    enableScreens: jest.fn(),
  };
});
