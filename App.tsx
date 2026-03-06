import "./global.css";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AuthProvider } from "./src/contexts/AuthContext";
import { ErrorBoundary } from "./src/components";
import { DataProvider } from "./src/contexts/DataContext";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <AuthProvider>
            <DataProvider>
              <BottomSheetModalProvider>
                <NavigationContainer>
                  <RootNavigator />
                  <StatusBar style="dark" />
                </NavigationContainer>
              </BottomSheetModalProvider>
            </DataProvider>
          </AuthProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
