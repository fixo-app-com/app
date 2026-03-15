/**
 * Centralised layout & animation constants for the collapsing header
 * and shared screen layout values.
 */

// ── Collapsing-header animation thresholds ──────────────────────────
/** Large title starts fading out */
export const LARGE_FADE_START = 10;
/** Large title is fully hidden */
export const LARGE_FADE_END = 24;
/** Small (sticky) title starts fading in */
export const SMALL_FADE_START = 22;
/** Small (sticky) title is fully visible */
export const SMALL_FADE_END = 30;
/** Blur background starts fading in */
export const BLUR_FADE_START = 16;
/** Blur background is fully visible */
export const BLUR_FADE_END = 28;

// ── Sticky header ───────────────────────────────────────────────────
/** BlurView intensity */
export const HEADER_BLUR_INTENSITY = 60;
/** Height of the sticky title row */
export const STICKY_TITLE_ROW_HEIGHT = 36;

// ── Sticky header shadow ────────────────────────────────────────────
export const HEADER_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 8,
} as const;

// ── Modal header border on scroll ────────────────────────────────────
export const HEADER_BORDER_FADE_START = 0;
export const HEADER_BORDER_FADE_END = 10;

// ── Content padding offsets (added to insets.top) ───────────────────
/** Offset from safe-area top to the first content line */
export const CONTENT_TOP_OFFSET = 24;
/** Offset used when there is no title header */
export const CONTENT_TOP_OFFSET_NO_TITLE = 40;

// ── List padding ────────────────────────────────────────────────────
/** Base bottom padding for list screens */
export const LIST_BOTTOM_PADDING = 32;
/** Extra bottom padding for screens with a FloatingAction button */
export const LIST_BOTTOM_PADDING_FAB = 80;
/** Bottom offset added to insets.bottom when bottomInset is enabled */
export const BOTTOM_INSET_OFFSET = 80;

// ── Spacing ─────────────────────────────────────────────────────────
/** Gap between widgets / list sections */
export const WIDGET_GAP = 24;
/** Horizontal padding for content areas (equivalent to px-4) */
export const CONTENT_HORIZONTAL_PADDING = 16;

// ── Scroll ──────────────────────────────────────────────────────────
export const SCROLL_EVENT_THROTTLE = 16;
