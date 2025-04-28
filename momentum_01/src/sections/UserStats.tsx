"use client";

import { useState, useEffect } from "react";
import CalendarHeatmap from "@/components/CalendarHeatMap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

// Type for heatmap day data
type DayData = {
  date: string;
  count: number;
};

// Helper: Format current date
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
  
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  
    const generateMonthData = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const numDays = new Date(year, month + 1, 0).getDate();
  
      return Array.from({ length: numDays }, (_, idx) => ({
        date: new Date(year, month, idx + 1).toISOString().split("T")[0],
        count: Math.floor(Math.random() * 10),
      }));
    };
  
    const fullData = [
      ...generateMonthData(twoMonthsAgo),   // February
      ...generateMonthData(oneMonthAgo),    // March
      ...generateMonthData(currentMonth),   // April
    ];
  
    setHeatmapData(fullData);
  }, []);

  const completedTasks = 34;
  const totalTasks = 53;
  const percentage = (completedTasks / totalTasks) * 100;

  const focusHoursToday = 5;

  const barData = [
    { day: "Mon", hours: 2 },
    { day: "Tue", hours: 3 },
    { day: "Wed", hours: 2.5 },
    { day: "Thu", hours: 5 },
    { day: "Fri", hours: 1 },
    { day: "Sat", hours: 4 },
    { day: "Sun", hours: 6 },
  ];

  const pieData = [
    { name: "Study", value: 40 },
    { name: "Work", value: 30 },
    { name: "Personal", value: 30 },
  ];

  const COLORS = ["#00C49F", "#FFBB28", "#0088FE"];

  return (
    <div className="h-full w-full flex flex-col p-6 gap-8">

      {/* Header: My Stats + Date */}
      <div className="flex items-center justify-between pr-36 relative">
        <h2 className="text-2xl font-light">My Stats</h2>
        <div className="absolute right-12 bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm shadow-sm min-w-[150px] text-center">
          {getFormattedDate()}
        </div>
      </div>

      {/* Task Completion Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Task Completion</h3>

        <div className="flex items-center gap-12">
          
          {/* Progress Ring */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-36 h-36">
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-gray-300"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-green-500"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${percentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-semibold text-black">{completedTasks}/{totalTasks}</span>
                <span className="text-gray-500 text-xs">tasks completed</span>
              </div>
            </div>
          </div>

          {/* Focus Time */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold">Focus</p>
            <h2 className="text-3xl font-bold">{focusHoursToday} hours</h2>
            <p className="text-gray-400 text-sm">focused time today</p>
          </div>

          {/* Heatmap */}
          <div className="flex-grow flex justify-end">
            <div className="p-2 bg-white rounded-lg shadow">
              <CalendarHeatmap width={500} height={150} data={heatmapData} />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Hours and Categories Charts */}
      <div className="grid grid-cols-2 gap-8 mt-8">
        
        {/* Weekly Hours - Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Weekly Hours</h3>
          <div className="bg-white p-4 rounded-lg shadow">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories - Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="bg-white p-4 rounded-lg shadow flex justify-center items-center">
            <ResponsiveContainer width="70%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
