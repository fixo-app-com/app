import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../contexts/AuthContext";
import SignInScreen from "../screens/auth/SignInScreen/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen/SignUpScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen/ForgotPasswordScreen";
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen/VerifyEmailScreen";
import HomeScreen from "../screens/app/HomeScreen/HomeScreen";
import CategoriesScreen from "../screens/app/CategoriesScreen/CategoriesScreen";
import CategoryDetailScreen from "../screens/app/CategoryDetailScreen/CategoryDetailScreen";
import AddCategoryScreen from "../screens/app/AddCategoryScreen/AddCategoryScreen";
import AddEditExpenseScreen from "../screens/app/AddEditExpenseScreen/AddEditExpenseScreen";
import WalletsScreen from "../screens/app/WalletsScreen/WalletsScreen";
import AddEditWalletScreen from "../screens/app/AddEditWalletScreen/AddEditWalletScreen";
import SettingsScreen from "../screens/app/SettingsScreen/SettingsScreen";

// --- Param lists ---

export type AuthStackParamList = {
  SignIn: { pendingGoogleIdToken?: string } | undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
};

export type CategoriesStackParamList = {
  Categories: undefined;
  CategoryDetail: { categoryId: string; categoryName: string };
  AddCategory: undefined;
  AddEditExpense: {
    categoryId: string;
    expenseId?: string;
  };
};

export type WalletsStackParamList = {
  Wallets: undefined;
  AddEditWallet: { walletId?: string; walletName?: string; walletIcon?: string };
};

export type SettingsStackParamList = {
  Settings: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  CategoriesTab: undefined;
  WalletsTab: undefined;
  SettingsTab: undefined;
};

// --- Navigators ---

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const CategoriesStack = createNativeStackNavigator<CategoriesStackParamList>();
const WalletsStack = createNativeStackNavigator<WalletsStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const darkStackOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: "#030712" },
} as const;

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        ...darkStackOptions,
        animation: "slide_from_right",
      }}
    >
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
    </AuthStack.Navigator>
  );
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={darkStackOptions}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

function CategoriesStackNavigator() {
  return (
    <CategoriesStack.Navigator screenOptions={darkStackOptions}>
      <CategoriesStack.Screen name="Categories" component={CategoriesScreen} />
      <CategoriesStack.Screen
        name="CategoryDetail"
        component={CategoryDetailScreen}
      />
      <CategoriesStack.Screen
        name="AddCategory"
        component={AddCategoryScreen}
      />
      <CategoriesStack.Screen
        name="AddEditExpense"
        component={AddEditExpenseScreen}
      />
    </CategoriesStack.Navigator>
  );
}

function WalletsStackNavigator() {
  return (
    <WalletsStack.Navigator screenOptions={darkStackOptions}>
      <WalletsStack.Screen name="Wallets" component={WalletsScreen} />
      <WalletsStack.Screen
        name="AddEditWallet"
        component={AddEditWalletScreen}
      />
    </WalletsStack.Navigator>
  );
}

function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={darkStackOptions}>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
}

const TAB_ICONS: Record<string, { outline: string; filled: string }> = {
  Home: { outline: "home-outline", filled: "home" },
  Categories: { outline: "grid-outline", filled: "grid" },
  Wallets: { outline: "wallet-outline", filled: "wallet" },
  Settings: { outline: "settings-outline", filled: "settings" },
};

function TabIcon({
  label,
  focused,
  color,
}: {
  label: string;
  focused: boolean;
  color: string;
}) {
  const entry = TAB_ICONS[label];
  const iconName = focused ? entry?.filled : entry?.outline;
  return (
    <Ionicons name={(iconName ?? "ellipse") as any} size={24} color={color} />
  );
}

function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#030712",
          borderTopColor: "#1f2937",
          borderTopWidth: 0.5,
        },
        tabBarActiveTintColor: "#818cf8",
        tabBarInactiveTintColor: "#6b7280",
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: (props) => <TabIcon {...props} label="Home" />,
        }}
      />
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesStackNavigator}
        options={{
          tabBarIcon: (props) => <TabIcon {...props} label="Categories" />,
        }}
      />
      <Tab.Screen
        name="WalletsTab"
        component={WalletsStackNavigator}
        options={{
          tabBarIcon: (props) => <TabIcon {...props} label="Wallets" />,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{
          tabBarIcon: (props) => <TabIcon {...props} label="Settings" />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-950">
        <ActivityIndicator size="large" color="#818cf8" />
      </View>
    );
  }

  if (!user) {
    return <AuthNavigator />;
  }

  if (!user.emailVerified) {
    return <VerifyEmailScreen />;
  }

  return <AppNavigator />;
}
