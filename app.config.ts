import { ExpoConfig, ConfigContext } from "expo/config";
import { version } from "./package.json";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default ({ config }: ConfigContext): ExpoConfig => ({
  name: "Fixo",
  slug: "fixo-app",
  version,
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#f9fafb",
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.memmof.fixo",
    googleServicesFile:
      process.env.GOOGLE_SERVICES_PLIST ?? "./GoogleService-Info.plist",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  platforms: ["ios"],
  plugins: [
    "expo-font",
    "expo-apple-authentication",
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
    "@react-native-firebase/crashlytics",
    "@react-native-google-signin/google-signin",
    "./plugins/withFirebaseIOS",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
          buildReactNativeFromSource: true,
        },
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "f7a74e66-2e5c-4405-a3bf-d21b5828a03e",
    },
  },
});
