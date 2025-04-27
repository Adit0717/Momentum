"use client";

import { useMemo } from "react";
import { scaleLinear } from "@visx/scale";
import { TooltipWithBounds, useTooltip, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";

interface HeatmapDay {
  date: string; // ISO format "2025-04-01"
  count: number;
}

interface Props {
  width: number;
  height: number;
  data: HeatmapDay[];
}

export default function CalendarHeatmap({ width, height, data }: Props) {
  const squareSize = 20;
  const gutter = 5;

  const maxCount = Math.max(...data.map((d) => d.count));

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
  } = useTooltip<HeatmapDay>();

  // Map date to (weekIndex, dayIndex)
  const getWeekAndDay = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay(); // Sunday = 0, Saturday = 6

    // Find the week index since start of the month
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const diffInDays = Math.floor(
      (date.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24)
    );
    const weekIndex = Math.floor((diffInDays + startOfMonth.getDay()) / 7);

    return { week: weekIndex, day: dayOfWeek };
  };

  return (
    <div className="relative">
      <svg width={width} height={height}>
        {data.map((day, idx) => {
          const { week, day: dayIdx } = getWeekAndDay(day.date);
          return (
            <rect
              key={day.date}
              x={week * (squareSize + gutter)}
              y={dayIdx * (squareSize + gutter)}
              width={squareSize}
              height={squareSize}
              rx={4}
              fill={colorScale(day.count)}
              onMouseMove={(e) => {
                const coords = localPoint(e);
                showTooltip({
                  tooltipLeft: coords?.x,
                  tooltipTop: coords?.y,
                  tooltipData: day,
                });
              }}
              onMouseLeave={hideTooltip}
            />
          );
        })}
      </svg>

      {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={{ ...defaultStyles, backgroundColor: "black", color: "white" }}
        >
          {new Date(tooltipData.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          : {tooltipData.count} tasks
        </TooltipWithBounds>
      )}
    </div>
  );
}
