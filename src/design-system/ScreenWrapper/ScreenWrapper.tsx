import { useMemo, useRef, type ReactNode } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  LARGE_FADE_START,
  LARGE_FADE_END,
  SMALL_FADE_START,
  SMALL_FADE_END,
  BLUR_FADE_START,
  BLUR_FADE_END,
  HEADER_BLUR_INTENSITY,
  STICKY_TITLE_ROW_HEIGHT,
  HEADER_SHADOW,
  CONTENT_TOP_OFFSET,
  CONTENT_TOP_OFFSET_NO_TITLE,
  BOTTOM_INSET_OFFSET,
  CONTENT_HORIZONTAL_PADDING,
  SCROLL_EVENT_THROTTLE,
} from "../../constants/layout";

/**
 * Hook for screens that need the collapsing title behavior.
 * Pass an external scrollY when the scroll source isn't a standard
 * Animated.event (e.g. DraggableFlatList's onScrollOffsetChange).
 */
export function useScrollHeader(externalScrollY?: Animated.Value) {
  const internalScrollY = useRef(new Animated.Value(0)).current;
  const scrollY = externalScrollY ?? internalScrollY;
  const insets = useSafeAreaInsets();

  const largeTitleOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [LARGE_FADE_START, LARGE_FADE_END],
        outputRange: [1, 0],
        extrapolate: "clamp",
      }),
    [scrollY],
  );

  const scrollHandler = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: false,
      }),
    [scrollY],
  );

  return {
    scrollY,
    largeTitleOpacity,
    scrollHandler,
    contentTopPadding: insets.top + CONTENT_TOP_OFFSET,
  };
}

interface ScreenWrapperProps {
  scroll?: boolean;
  bottomInset?: boolean;
  title?: string;
  /** Pass scrollY from useScrollHeader() for FlatList screens */
  scrollY?: Animated.Value;
  header?: ReactNode;
  children: ReactNode;
}

export function ScreenWrapper({
  scroll,
  bottomInset,
  title,
  scrollY: externalScrollY,
  header,
  children,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();
  const internalScrollY = useRef(new Animated.Value(0)).current;
  const scrollY = externalScrollY ?? internalScrollY;
  const bottomPadding = bottomInset ? insets.bottom + BOTTOM_INSET_OFFSET : 0;
  const contentTopPadding = insets.top + CONTENT_TOP_OFFSET;

  const blurOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [BLUR_FADE_START, BLUR_FADE_END],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
    [scrollY],
  );

  const smallTitleOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [SMALL_FADE_START, SMALL_FADE_END],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
    [scrollY],
  );

  const internalScrollHandler = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: false,
      }),
    [scrollY],
  );

  const internalLargeTitleOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [LARGE_FADE_START, LARGE_FADE_END],
        outputRange: [1, 0],
        extrapolate: "clamp",
      }),
    [scrollY],
  );

  // === No title: current behavior ===
  if (!title) {
    return (
      <View className="flex-1 bg-gray-100">
        <View
          style={{ paddingTop: insets.top + CONTENT_TOP_OFFSET_NO_TITLE }}
          className="bg-gray-100 px-4 pb-2"
        >
          {header}
        </View>

        {scroll ? (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={0}
          >
            <ScrollView
              className="flex-1 px-4"
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: bottomPadding,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </KeyboardAvoidingView>
        ) : (
          <View
            className="flex-1 px-4"
            style={{ paddingBottom: bottomPadding }}
          >
            {children}
          </View>
        )}
      </View>
    );
  }

  const stickyHeader = (
    <View style={styles.stickyContainer} pointerEvents="none">
      {/* Blur bg fades in early to cover the large title */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: blurOpacity }]}
      >
        <View style={styles.stickyBlurShadow}>
          <BlurView
            intensity={HEADER_BLUR_INTENSITY}
            tint="light"
            style={[
              styles.stickyBlur,
              {
                paddingTop: insets.top,
                height: insets.top + STICKY_TITLE_ROW_HEIGHT,
              },
            ]}
          />
        </View>
      </Animated.View>
      {/* Small title fades in after large is fully gone */}
      <Animated.View
        style={{ opacity: smallTitleOpacity, paddingTop: insets.top }}
      >
        <View style={styles.stickyTitleRow}>
          <Text className="text-base font-semibold text-gray-900">{title}</Text>
        </View>
      </Animated.View>
    </View>
  );

  // === Title + scroll: ScreenWrapper handles scrollview ===
  if (scroll) {
    return (
      <View className="flex-1 bg-gray-100">
        {stickyHeader}

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            onScroll={internalScrollHandler}
            scrollEventThrottle={SCROLL_EVENT_THROTTLE}
            contentContainerStyle={{
              paddingTop: contentTopPadding,
              paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
              flexGrow: 1,
              paddingBottom: bottomPadding,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={{ opacity: internalLargeTitleOpacity }}>
              <Text className="mb-2 text-3xl font-bold text-gray-900">
                {title}
              </Text>
            </Animated.View>
            {header}
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // === Title + no scroll: screen provides scrollY for FlatList ===
  return (
    <View className="flex-1 bg-gray-100">
      {stickyHeader}

      <View className="flex-1 px-4" style={{ paddingBottom: bottomPadding }}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stickyContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  stickyBlurShadow: HEADER_SHADOW,
  stickyBlur: {
    overflow: "hidden",
  },
  stickyTitleRow: {
    height: STICKY_TITLE_ROW_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
});
