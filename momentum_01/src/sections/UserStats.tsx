"use client";

import { useState, useEffect } from "react";
import CalendarHeatmap from "@/components/CalendarHeatMap";

// Type for new format (day-by-day)
type DayData = {
  date: string; // full date like "2025-04-26"
  count: number;
};

// Helper: Format current date for header
function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function UserStats() {
  const [heatmapData, setHeatmapData] = useState<DayData[]>([]);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const numDays = new Date(year, month + 1, 0).getDate();

    const data = Array.from({ length: numDays }, (_, idx) => {
      const date = new Date(year, month, idx + 1);
      return {
        date: date.toISOString().split("T")[0],
        count: Math.floor(Math.random() * 10),
      };
    });

    setHeatmapData(data);
  }, []);

  const completedTasks = 34;
  const totalTasks = 53;
  const percentage = (completedTasks / totalTasks) * 100;

  return (
    <div className="h-full w-full flex flex-col p-6 gap-6">

      {/* Header: My Stats + Date */}
      <div className="flex justify-between items-center pr-24">
        <h2 className="text-2xl font-light">My Stats</h2>
        <span className="text-gray-500 text-sm">{getFormattedDate()}</span>
      </div>

      {/* Heatmap */}
      <div className="overflow-auto mb-8">
        <div className="p-2 bg-white rounded-lg shadow">
          <CalendarHeatmap width={600} height={150} data={heatmapData} />
        </div>
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
