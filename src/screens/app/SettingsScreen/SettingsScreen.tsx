import { Text, View } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { signOut } from "../../../services/auth";
import { CURRENCIES } from "../../../constants/banks";
import {
  Button,
  ChipGroup,
  FormRow,
  ScreenWrapper,
  SectionHeader,
} from "../../../design-system";

export default function SettingsScreen() {
  const { user } = useAuth();
  const { currency, setCurrency } = useData();

  return (
    <ScreenWrapper scroll>
      <Text className="mb-6 text-3xl font-bold text-gray-900">Settings</Text>

      <SectionHeader title="Account" />

      <FormRow
        label="Email"
        first
        last
        right={
          <Text className="text-base text-gray-500">{user?.email ?? "—"}</Text>
        }
      />

      <SectionHeader title="Currency" />

      <ChipGroup
        options={CURRENCIES.map((c) => ({
          value: c.code,
          label: `${c.symbol} ${c.code}`,
        }))}
        selected={currency}
        onSelect={setCurrency}
        compact
      />

      <View className="mt-8" />

      <Button label="Sign out" variant="secondary" onPress={() => signOut()} />
    </ScreenWrapper>
  );
}
