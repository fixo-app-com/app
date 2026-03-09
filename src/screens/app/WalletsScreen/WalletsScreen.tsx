import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useData } from "../../../contexts/DataContext";
import { colors } from "../../../constants/colors";
import type {
  AppRootStackParamList,
  WalletsStackParamList,
} from "../../../navigation/RootNavigator";
import {
  EmptyState,
  FloatingAction,
  ScreenWrapper,
  SortBottomSheet,
  SortTrigger,
} from "../../../design-system";
import { ListSpacer, ViewModeToggle, WalletCard } from "../../../components";
import { useExpenses } from "../../../hooks/useExpenses";
import { useSortSheet } from "../../../hooks/useSortSheet";
import { useEntityList } from "../../../hooks/useEntityList";

type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<WalletsStackParamList>,
  NativeStackNavigationProp<AppRootStackParamList>
>;

export default function WalletsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const { wallets, viewMode, setViewMode } = useData();

  const { expenses, loading: loadingExpenses } = useExpenses();
  const sort = useSortSheet("wallets");
  const { sorted: sortedWallets, getTotal: getWalletTotal } = useEntityList(
    wallets,
    expenses,
    viewMode,
    sort.selected,
    "walletId",
  );

  const headerContent = (
    <>
      <Text className="mb-4 text-3xl font-bold text-gray-900">
        {t("wallets.title")}
      </Text>

      {/* Monthly / Yearly toggle + sort */}
      <View className="flex-row items-center justify-between">
        <ViewModeToggle selected={viewMode} onSelect={setViewMode} />
        <SortTrigger label={sort.triggerLabel} onPress={sort.open} />
      </View>
    </>
  );

  return (
    <ScreenWrapper header={headerContent}>
      {loadingExpenses ? (
        <ActivityIndicator color={colors.fixo[400]} className="mt-8" />
      ) : (
        <FlatList
          data={sortedWallets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <WalletCard
              name={item.name}
              icon={item.icon ?? ""}
              totalCents={getWalletTotal(item.id)}
              onPress={() =>
                navigation.navigate("WalletDetail", {
                  walletId: item.id,
                  walletName: item.name,
                  walletIcon: item.icon,
                })
              }
            />
          )}
          ItemSeparatorComponent={ListSpacer}
          ListEmptyComponent={
            <EmptyState
              icon="wallet-outline"
              message={t("wallets.noWallets")}
            />
          }
        />
      )}

      <FloatingAction
        onPress={() => navigation.navigate("AddEditWallet", {})}
      />

      <SortBottomSheet
        visible={sort.isOpen}
        title={sort.title}
        options={sort.options}
        selected={sort.selected}
        onSelect={sort.select}
        onClose={sort.close}
      />
    </ScreenWrapper>
  );
}
