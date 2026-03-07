import "./global.css";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { I18nextProvider } from "react-i18next";
import i18n, { initLanguage } from "./src/i18n";
import { AuthProvider } from "./src/contexts/AuthContext";
import { ErrorBoundary } from "./src/components";
import { DataProvider } from "./src/contexts/DataContext";
import { SortPreferencesProvider } from "./src/contexts/SortPreferencesContext";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  useEffect(() => {
    initLanguage();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <ErrorBoundary>
            <AuthProvider>
              <SortPreferencesProvider>
                <DataProvider>
                  <BottomSheetModalProvider>
                    <NavigationContainer>
                      <RootNavigator />
                      <StatusBar style="dark" />
                    </NavigationContainer>
                  </BottomSheetModalProvider>
                </DataProvider>
              </SortPreferencesProvider>
            </AuthProvider>
          </ErrorBoundary>
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
