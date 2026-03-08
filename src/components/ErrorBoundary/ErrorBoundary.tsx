import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import crashlytics from "@react-native-firebase/crashlytics";
import { Button } from "../../design-system";
import { colors } from "../../constants/colors";
import i18n from "../../i18n";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    crashlytics().recordError(error);
    if (info.componentStack) {
      crashlytics().log(info.componentStack);
    }
  }

  private handleRestart = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-gray-100 px-8">
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={colors.fixo[400]}
          />
          <Text className="mt-4 text-xl font-semibold text-gray-900">
            {i18n.t("errorBoundary.title")}
          </Text>
          <Text className="mt-2 text-center text-base text-gray-500">
            {i18n.t("errorBoundary.message")}
          </Text>
          <View className="mt-8 w-full">
            <Button
              label={i18n.t("errorBoundary.restart")}
              onPress={this.handleRestart}
            />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
