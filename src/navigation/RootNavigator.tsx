import type { ComponentProps } from "react";
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
import CategoryDetailScreen from "../screens/app/CategoryDetailScreen/CategoryDetailScreen";
import AddEditCategoryScreen from "../screens/app/AddEditCategoryScreen/AddEditCategoryScreen";
import AddEditExpenseScreen from "../screens/app/AddEditExpenseScreen/AddEditExpenseScreen";
import WalletDetailScreen from "../screens/app/WalletDetailScreen/WalletDetailScreen";
import AddEditWalletScreen from "../screens/app/AddEditWalletScreen/AddEditWalletScreen";
import WalletsScreen from "../screens/app/WalletsScreen/WalletsScreen";
import EmergencyFundScreen from "../screens/app/EmergencyFundScreen/EmergencyFundScreen";
import SettingsScreen from "../screens/app/SettingsScreen/SettingsScreen";

// --- Param lists ---

export type AuthStackParamList = {
  SignIn: { pendingGoogleIdToken?: string } | undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  CategoryDetail: { categoryId: string; categoryName: string };
  AddEditCategory: {
    categoryId?: string;
    categoryName?: string;
    categoryIcon?: string;
  };
  AddEditExpense: { categoryId: string; expenseId?: string };
};

export type WalletsStackParamList = {
  Wallets: undefined;
  WalletDetail: { walletId: string; walletName: string; walletIcon: string };
  AddEditWallet: {
    walletId?: string;
    walletName?: string;
    walletIcon?: string;
  };
  AddEditExpense: { categoryId: string; expenseId?: string };
};

export type EmergencyStackParamList = {
  EmergencyFund: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  WalletsTab: undefined;
  EmergencyTab: undefined;
  SettingsTab: undefined;
};

// --- Navigators ---

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const WalletsStack = createNativeStackNavigator<WalletsStackParamList>();
const EmergencyStack = createNativeStackNavigator<EmergencyStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const stackOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: "#f9fafb" },
} as const;

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        ...stackOptions,
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
    <HomeStack.Navigator screenOptions={stackOptions}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen
        name="CategoryDetail"
        component={CategoryDetailScreen}
      />
      <HomeStack.Screen
        name="AddEditCategory"
        component={AddEditCategoryScreen}
      />
      <HomeStack.Screen
        name="AddEditExpense"
        component={AddEditExpenseScreen}
      />
    </HomeStack.Navigator>
  );
}

function WalletsStackNavigator() {
  return (
    <WalletsStack.Navigator screenOptions={stackOptions}>
      <WalletsStack.Screen name="Wallets" component={WalletsScreen} />
      <WalletsStack.Screen name="WalletDetail" component={WalletDetailScreen} />
      <WalletsStack.Screen
        name="AddEditWallet"
        component={AddEditWalletScreen}
      />
      <WalletsStack.Screen
        name="AddEditExpense"
        component={AddEditExpenseScreen}
      />
    </WalletsStack.Navigator>
  );
}

function EmergencyStackNavigator() {
  return (
    <EmergencyStack.Navigator screenOptions={stackOptions}>
      <EmergencyStack.Screen
        name="EmergencyFund"
        component={EmergencyFundScreen}
      />
    </EmergencyStack.Navigator>
  );
}

function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={stackOptions}>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
}

const TAB_ICONS: Record<string, { outline: string; filled: string }> = {
  Home: { outline: "home-outline", filled: "home" },
  Wallets: { outline: "wallet-outline", filled: "wallet" },
  Emergency: {
    outline: "shield-checkmark-outline",
    filled: "shield-checkmark",
  },
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
    <Ionicons
      name={(iconName ?? "ellipse") as ComponentProps<typeof Ionicons>["name"]}
      size={24}
      color={color}
    />
  );
}

function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#f9fafb",
          borderTopColor: "#e5e7eb",
          borderTopWidth: 0.5,
        },
        tabBarActiveTintColor: "#818cf8",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "500" },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: (props) => <TabIcon {...props} label="Home" />,
        }}
      />
      <Tab.Screen
        name="WalletsTab"
        component={WalletsStackNavigator}
        options={{
          tabBarLabel: "Wallets",
          tabBarIcon: (props) => <TabIcon {...props} label="Wallets" />,
        }}
      />
      <Tab.Screen
        name="EmergencyTab"
        component={EmergencyStackNavigator}
        options={{
          tabBarLabel: "Emergency",
          tabBarIcon: (props) => <TabIcon {...props} label="Emergency" />,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: "Settings",
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
      <View className="flex-1 items-center justify-center bg-gray-100">
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
