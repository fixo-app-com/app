import { useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import { Svg, Path, G } from "react-native-svg";
import { Card } from "../../../design-system";
import { CurrencyText } from "../../../components";
import { emojiToColor, darkenColor } from "../../../utils/emojiColor";

export interface DonutSegment {
  id: string;
  name: string;
  icon: string;
  totalCents: number;
}

interface DonutChartProps {
  segments: DonutSegment[];
  totalCents: number;
  allLabel: string;
}

const GAP = 0.02; // radians between slices

function describeArc(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const cosStart = Math.cos(startAngle);
  const sinStart = Math.sin(startAngle);
  const cosEnd = Math.cos(endAngle);
  const sinEnd = Math.sin(endAngle);

  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  const outerStartX = cx + outerR * cosStart;
  const outerStartY = cy + outerR * sinStart;
  const outerEndX = cx + outerR * cosEnd;
  const outerEndY = cy + outerR * sinEnd;
  const innerStartX = cx + innerR * cosEnd;
  const innerStartY = cy + innerR * sinEnd;
  const innerEndX = cx + innerR * cosStart;
  const innerEndY = cy + innerR * sinStart;

  return [
    `M ${outerStartX} ${outerStartY}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEndX} ${outerEndY}`,
    `L ${innerStartX} ${innerStartY}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEndX} ${innerEndY}`,
    "Z",
  ].join(" ");
}

const CHART_INSET = 32;

export function DonutChart({
  segments,
  totalCents,
  allLabel,
}: DonutChartProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleLayout(e: LayoutChangeEvent) {
    setContainerWidth(e.nativeEvent.layout.width);
  }

  const selected = segments.find((s) => s.id === selectedId);
  const centerLabel = selected ? selected.name : allLabel;
  const centerCents = selected ? selected.totalCents : totalCents;
  const centerPct =
    selected && totalCents > 0
      ? Math.round((selected.totalCents / totalCents) * 100)
      : null;

  if (containerWidth === 0) {
    return (
      <Card testID="donut-chart">
        <View onLayout={handleLayout} style={{ height: 1 }} />
      </Card>
    );
  }

  const chartSize = containerWidth - CHART_INSET * 2;
  const cx = chartSize / 2;
  const cy = chartSize / 2;
  const outerR = chartSize / 2 - 4;
  const innerR = outerR * 0.6;

  const totalGap = GAP * segments.length;
  const available = Math.PI * 2 - totalGap;

  let currentAngle = -Math.PI / 2;

  const arcs = segments.map((seg) => {
    const fraction = totalCents > 0 ? seg.totalCents / totalCents : 0;
    const sweep = fraction * available;
    const startAngle = currentAngle + GAP / 2;
    const endAngle = startAngle + sweep;
    currentAngle = endAngle + GAP / 2;

    const baseColor = emojiToColor(seg.icon);
    const color = selectedId === seg.id ? darkenColor(baseColor) : baseColor;

    return {
      id: seg.id,
      d: describeArc(cx, cy, outerR, innerR, startAngle, endAngle),
      color,
    };
  });

  return (
    <Card testID="donut-chart">
      <View onLayout={handleLayout} style={{ alignItems: "center" }}>
        <View style={{ width: chartSize, height: chartSize }}>
          <Svg width={chartSize} height={chartSize}>
            <G>
              {arcs.map((arc) => (
                <Path
                  key={arc.id}
                  d={arc.d}
                  fill={arc.color}
                  onPress={() =>
                    setSelectedId((prev) => (prev === arc.id ? null : arc.id))
                  }
                />
              ))}
            </G>
          </Svg>

          <Pressable
            style={{
              position: "absolute",
              top: cy - innerR * 0.5,
              left: cx - innerR * 0.7,
              width: innerR * 1.4,
              height: innerR,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => setSelectedId(null)}
          >
            <Text
              className="text-center text-sm font-medium text-gray-500"
              numberOfLines={1}
            >
              {centerLabel}
            </Text>
            <CurrencyText
              cents={centerCents}
              className="text-center text-lg font-bold text-gray-900"
              hideDecimals
            />
            {centerPct !== null && (
              <Text className="text-center text-xs font-semibold text-gray-400">
                {centerPct}%
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </Card>
  );
}
