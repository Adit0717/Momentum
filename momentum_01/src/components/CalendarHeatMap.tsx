"use client";

import { useMemo } from "react";
import { scaleLinear } from "@visx/scale";
import { TooltipWithBounds, useTooltip, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";

interface DayBin {
  date: number;
  count: number;
}

interface MonthBin {
  month: string;
  bins: DayBin[];
}

interface Props {
  width: number;
  height: number;
  data: MonthBin[];
}

export default function CalendarHeatmap({ width, height, data }: Props) {
  const barWidth = 20;
  const barHeight = 30;
  const gutter = 4;

  const maxCount = Math.max(
    ...data.flatMap((month) => month.bins.map((bin) => bin.count))
  );

  const colorScale = useMemo(
    () =>
      scaleLinear<string>({
        domain: [0, maxCount],
        range: ["#ebedf0", "#216e39"],
      }),
    [maxCount]
  );

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<{ date: number; month: string; count: number }>();

  return (
    <div className="relative">
      <svg width={width} height={height}>
        {data.map((month, rowIdx) => (
          <g key={month.month}>
            {/* Month Label */}
            <text
              x={0}
              y={rowIdx * (barHeight + gutter) - 6}
              className="text-sm fill-gray-700"
            >
              {month.month}
            </text>

            {/* Bars */}
            {month.bins.map((bin, colIdx) => (
              <rect
                key={`${month.month}-${bin.date}`}
                x={colIdx * (barWidth + gutter) + 60}
                y={rowIdx * (barHeight + gutter)}
                width={barWidth}
                height={barHeight}
                rx={4}
                fill={colorScale(bin.count)}
                onMouseMove={(e) => {
                  const coords = localPoint(e);
                  showTooltip({
                    tooltipLeft: coords?.x,
                    tooltipTop: coords?.y,
                    tooltipData: { ...bin, month: month.month },
                  });
                }}
                onMouseLeave={hideTooltip}
              />
            ))}
          </g>
        ))}
      </svg>

      {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={{ ...defaultStyles, backgroundColor: "black", color: "white" }}
        >
          {tooltipData.month} {tooltipData.date}: {tooltipData.count} tasks
        </TooltipWithBounds>
      )}
    </div>
  );
}
