import { useCallback } from "react";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";

type ConfirmDeleteParams = {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
};

export function useDeleteConfirmation() {
  const { t } = useTranslation();

  const confirmDelete = useCallback(
    ({ title, message, onConfirm }: ConfirmDeleteParams) => {
      Alert.alert(title, message, [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: onConfirm,
        },
      ]);
    },
    [t],
  );

  return { confirmDelete };
}
