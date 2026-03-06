import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { Alert, LayoutChangeEvent, View } from "react-native";
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  interpolate,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";

interface SwipeableRowProps {
  children: ReactNode;
  onDelete: () => Promise<void>;
  errorMessage: string;
}

function RightAction({ drag }: { drag: SharedValue<number> }) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(drag.value, [-60, 0], [1, 0], "clamp"),
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-end",
          paddingRight: 20,
          borderRadius: 16,
          backgroundColor: "#ef4444",
        },
      ]}
    >
      <Ionicons name="trash-outline" size={22} color="white" />
    </Animated.View>
  );
}

export function SwipeableRow({
  children,
  onDelete,
  errorMessage,
}: SwipeableRowProps) {
  const swipeableRef = useRef<SwipeableMethods>(null);
  const [deleted, setDeleted] = useState(false);
  const [dragging, setDragging] = useState(false);

  const rowHeight = useSharedValue<number>(-1);
  const opacity = useSharedValue(1);

  const collapseStyle = useAnimatedStyle(() => {
    if (rowHeight.value === -1) return {};
    return {
      height: rowHeight.value,
      opacity: opacity.value,
      overflow: "hidden" as const,
    };
  });

  function onLayout(e: LayoutChangeEvent) {
    if (rowHeight.value === -1) {
      rowHeight.value = e.nativeEvent.layout.height;
    }
  }

  function handleSwipeOpen() {
    setDeleted(true);
    opacity.value = withTiming(0, { duration: 120 });
    rowHeight.value = withTiming(0, { duration: 150 }, (finished) => {
      if (finished) runOnJS(performDelete)();
    });
  }

  async function performDelete() {
    try {
      await onDelete();
    } catch {
      setDeleted(false);
      setDragging(false);
      opacity.value = withTiming(1, { duration: 250 });
      rowHeight.value = withTiming(rowHeight.value || 80, { duration: 300 });
      swipeableRef.current?.close();
      Alert.alert("Error", errorMessage);
    }
  }

  return (
    <Animated.View style={collapseStyle} onLayout={onLayout}>
      <ReanimatedSwipeable
        ref={swipeableRef}
        renderRightActions={(_progress, drag) => <RightAction drag={drag} />}
        onSwipeableWillOpen={handleSwipeOpen}
        onSwipeableOpenStartDrag={() => setDragging(true)}
        onSwipeableClose={() => setDragging(false)}
        rightThreshold={100}
        overshootRight={true}
        overshootFriction={8}
        friction={2}
        enabled={!deleted}
      >
        <View pointerEvents={dragging || deleted ? "none" : "auto"}>
          {children}
        </View>
      </ReanimatedSwipeable>
    </Animated.View>
  );
}
