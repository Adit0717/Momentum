"use client";

import CalendarHeatmap from "@/components/CalendarHeatMap";
import { useMemo } from "react";

// Helper to format current date
function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function UserStats() {
  const heatmapData = useMemo(() => {
    const months = ["February", "March"];
    return months.map((month, mi) => {
      const days = mi === 0 ? 28 : 31;
      return {
        month,
        bins: Array.from({ length: days }, (_, d) => ({
          date: d + 1,
          count: Math.floor(Math.random() * 10),
        })),
      };
    });
  }, []);

  const completedTasks = 34;
  const totalTasks = 53;
  const percentage = (completedTasks / totalTasks) * 100;

  return (
    <div className="h-full w-full flex flex-col p-6 gap-6">
      
      {/* Header: My Stats + Date */}
      <div className="flex justify-between items-center pr-24">
        {/* Push date a bit left by adding pr-24 */}
        <h2 className="text-2xl font-light">My Stats</h2>
        <span className="text-gray-500 text-sm">{getFormattedDate()}</span>
      </div>

      {/* Heatmap */}
      <div className="overflow-auto mb-8">
        <CalendarHeatmap width={600} height={180} data={heatmapData} />
      </div>

      {/* Progress Ring */}
      <div className="flex justify-start">
        <div className="w-[200px] flex flex-col items-center justify-center">
          <div className="relative w-40 h-40">
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-300"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-green-500"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${percentage}, 100`}
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-semibold text-black">{completedTasks}/{totalTasks}</span>
              <span className="text-gray-500 text-sm">tasks completed</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
