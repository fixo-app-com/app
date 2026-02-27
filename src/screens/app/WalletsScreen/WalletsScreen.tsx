import { Alert, FlatList, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useData } from "../../../contexts/DataContext";
import type { WalletsStackParamList } from "../../../navigation/RootNavigator";
import { EmptyState, ScreenWrapper } from "../../../design-system";
import { FloatingAction, WalletCard } from "../../../components";

type Nav = NativeStackNavigationProp<WalletsStackParamList, "Wallets">;

export default function WalletsScreen() {
  const navigation = useNavigation<Nav>();
  const { wallets, deleteWallet } = useData();

  function handleDelete(walletId: string, walletName: string) {
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
      <Text className="mb-6 text-2xl font-bold text-white">Wallets</Text>

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
          <EmptyState message="No wallets yet. Add one!" />
        }
      />

      <FloatingAction
        label="+ Add wallet"
        onPress={() => navigation.navigate("AddEditWallet", {})}
      />
    </ScreenWrapper>
  );
}
