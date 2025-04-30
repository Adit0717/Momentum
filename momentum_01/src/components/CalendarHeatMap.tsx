"use client";

import { useMemo } from "react";
import { scaleLinear } from "@visx/scale";
import { TooltipWithBounds, useTooltip, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { format } from "date-fns";

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

  const sortedDates = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const startDate = sortedDates.length > 0 ? new Date(sortedDates[0].date) : new Date();

  const getWeekAndDay = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay(); // Sunday = 0
  
    const monthDiff = date.getMonth() - startDate.getMonth();
    const baseStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const diffInDays = Math.floor((date.getTime() - baseStart.getTime()) / (1000 * 60 * 60 * 24));
    let weekIndex = Math.floor((diffInDays + baseStart.getDay()) / 7);
  
    // 🟰 Add spacing depending on month difference
    if (monthDiff === 1) {
      weekIndex += 6; // after month 1
    }
    if (monthDiff === 2) {
      weekIndex += 12; // after month 2 (6 + 6 more)
    }
  
    return { week: weekIndex, day: dayOfWeek };
  };
  

  return (
    <div className="relative">
      <svg width={width} height={height}>
        {/* Month Labels */}
        {data.length > 0 && (
          <>
            {data.reduce<{ month: string; week: number }[]>((acc, day, idx) => {
              const prev = idx > 0 ? new Date(data[idx - 1].date) : null;
              const curr = new Date(day.date);

              if (!prev || prev.getMonth() !== curr.getMonth()) {
                const { week } = getWeekAndDay(day.date);
                acc.push({ month: format(curr, "MMMM"), week });
              }
              return acc;
            }, []).map(({ month, week }) => (
              <text
                key={month}
                x={week * (squareSize + gutter)}
                y={-10}
                className="text-xs fill-gray-700"
              >
                {month}
              </text>
            ))}
          </>
        )}

        {/* Squares */}
        {data.map((day) => {
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
