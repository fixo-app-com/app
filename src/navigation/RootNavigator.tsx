import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View, Text } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import SignInScreen from "../screens/auth/SignInScreen/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen/SignUpScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen/ForgotPasswordScreen";
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen/VerifyEmailScreen";
import HomeScreen from "../screens/app/HomeScreen/HomeScreen";
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
  CategoryDetail: { categoryId: string; categoryName: string };
  AddCategory: undefined;
  AddEditExpense: {
    categoryId: string;
    expenseId?: string;
  };
};

export type WalletsStackParamList = {
  Wallets: undefined;
  AddEditWallet: { walletId?: string; walletName?: string };
};

export type SettingsStackParamList = {
  Settings: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  WalletsTab: undefined;
  SettingsTab: undefined;
};

// --- Navigators ---

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
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
      <HomeStack.Screen
        name="CategoryDetail"
        component={CategoryDetailScreen}
      />
      <HomeStack.Screen name="AddCategory" component={AddCategoryScreen} />
      <HomeStack.Screen
        name="AddEditExpense"
        component={AddEditExpenseScreen}
      />
    </HomeStack.Navigator>
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

function TabIcon({
  label,
  color,
}: {
  label: string;
  focused: boolean;
  color: string;
}) {
  const icons: Record<string, string> = {
    Home: "🏠",
    Wallets: "💳",
    Settings: "⚙️",
  };
  return <Text style={{ fontSize: 22, color }}>{icons[label] ?? "●"}</Text>;
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
