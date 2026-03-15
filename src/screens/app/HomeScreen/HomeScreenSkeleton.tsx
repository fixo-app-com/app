import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "../../../design-system";
import { CONTENT_TOP_OFFSET, WIDGET_GAP } from "../../../constants/layout";

function usePulse() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return opacity;
}

function SkeletonBlock({
  width,
  height,
  opacity,
  rounded = 8,
}: {
  width: number;
  height: number;
  opacity: Animated.Value;
  rounded?: number;
}) {
  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: rounded,
        backgroundColor: "#e5e7eb",
        opacity,
      }}
    />
  );
}

export function HomeScreenSkeleton() {
  const insets = useSafeAreaInsets();
  const opacity = usePulse();

  return (
    <View
      className="flex-1 bg-gray-100 px-4"
      style={{ paddingTop: insets.top + CONTENT_TOP_OFFSET }}
    >
      {/* Title + chips */}
      <SkeletonBlock width={100} height={32} opacity={opacity} />
      <View className="mt-3 flex-row" style={{ gap: 8 }}>
        <SkeletonBlock width={80} height={36} opacity={opacity} rounded={18} />
        <SkeletonBlock width={80} height={36} opacity={opacity} rounded={18} />
      </View>

      {/* Overview / BudgetCard */}
      <View style={{ marginTop: WIDGET_GAP }}>
        <SkeletonBlock width={80} height={12} opacity={opacity} rounded={4} />
        <View style={{ marginTop: 8 }}>
          <Card>
            <View className="items-center py-4">
              <SkeletonBlock width={140} height={36} opacity={opacity} />
            </View>
            <View className="flex-row justify-around">
              <SkeletonBlock width={80} height={32} opacity={opacity} rounded={12} />
              <SkeletonBlock width={80} height={32} opacity={opacity} rounded={12} />
            </View>
          </Card>
        </View>
      </View>

      {/* Essential Split */}
      <View style={{ marginTop: WIDGET_GAP }}>
        <SkeletonBlock width={100} height={12} opacity={opacity} rounded={4} />
        <View style={{ marginTop: 8 }}>
          <Card>
            <View className="flex-row items-center py-1">
              <View className="flex-1 items-center">
                <SkeletonBlock width={60} height={20} opacity={opacity} />
                <View style={{ marginTop: 6 }}>
                  <SkeletonBlock
                    width={50}
                    height={10}
                    opacity={opacity}
                    rounded={4}
                  />
                </View>
              </View>
              <View className="w-px self-stretch bg-gray-200" />
              <View className="flex-1 items-center">
                <SkeletonBlock width={60} height={20} opacity={opacity} />
                <View style={{ marginTop: 6 }}>
                  <SkeletonBlock
                    width={50}
                    height={10}
                    opacity={opacity}
                    rounded={4}
                  />
                </View>
              </View>
              <View className="w-px self-stretch bg-gray-200" />
              <View className="flex-1 items-center">
                <SkeletonBlock width={60} height={20} opacity={opacity} />
                <View style={{ marginTop: 6 }}>
                  <SkeletonBlock
                    width={50}
                    height={10}
                    opacity={opacity}
                    rounded={4}
                  />
                </View>
              </View>
            </View>
          </Card>
        </View>
      </View>

      {/* FixedCostRatio */}
      <View style={{ marginTop: WIDGET_GAP }}>
        <Card>
          <View className="items-center py-2">
            <SkeletonBlock width={80} height={28} opacity={opacity} />
          </View>
        </Card>
      </View>

      {/* TopExpenses */}
      <View style={{ marginTop: WIDGET_GAP }}>
        <SkeletonBlock width={100} height={12} opacity={opacity} rounded={4} />
        <View style={{ marginTop: 8 }}>
          <Card>
            {[0, 1, 2].map((i) => (
              <View key={i}>
                {i > 0 && <View className="h-px bg-gray-100" />}
                <View
                  className="flex-row items-center justify-between"
                  style={{ paddingVertical: 12 }}
                >
                  <SkeletonBlock width={120} height={14} opacity={opacity} rounded={4} />
                  <SkeletonBlock width={50} height={14} opacity={opacity} rounded={4} />
                </View>
              </View>
            ))}
          </Card>
        </View>
      </View>
    </View>
  );
}
