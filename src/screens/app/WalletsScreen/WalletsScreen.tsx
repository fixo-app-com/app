import { Alert, FlatList, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { getExpenses } from "../../../services/firestore";
import type { HomeStackParamList } from "../../../navigation/RootNavigator";
import { EmptyState, ScreenWrapper } from "../../../design-system";
import { FloatingAction, WalletCard } from "../../../components";

type Nav = NativeStackNavigationProp<HomeStackParamList>;

export default function WalletsScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { wallets, deleteWallet } = useData();

  async function handleDelete(walletId: string, walletName: string) {
    if (!user) return;

    try {
      const expenses = await getExpenses(user.uid, { walletId });
      if (expenses.length > 0) {
        Alert.alert(
          "Cannot delete",
          "Remove all expenses from this wallet first.",
        );
        return;
      }
    } catch (error) {
      console.error("Failed to check expenses:", error);
      return;
    }

    Alert.alert("Delete wallet", `Delete "${walletName}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteWallet(walletId);
          } catch (error) {
            console.error("Failed to delete wallet:", error);
          }
        },
      },
    ]);
  }

  return (
    <ScreenWrapper>
      <Text className="mb-6 text-3xl font-bold text-gray-900">Wallets</Text>

      <FlatList
        data={wallets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <WalletCard
            name={item.name}
            icon={item.icon ?? ""}
            onPress={() =>
              navigation.navigate("AddEditWallet", {
                walletId: item.id,
                walletName: item.name,
                walletIcon: item.icon,
              })
            }
            onLongPress={() => handleDelete(item.id, item.name)}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListEmptyComponent={
          <EmptyState
            icon="wallet-outline"
            message="No wallets yet."
            actionLabel="Add wallet"
            onAction={() => navigation.navigate("AddEditWallet", {})}
          />
        }
      />

      <FloatingAction
        label="+ Add wallet"
        onPress={() => navigation.navigate("AddEditWallet", {})}
      />
    </ScreenWrapper>
  );
}
