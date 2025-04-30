"use client";

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
    deadline: string;
    completed: boolean;
}

export default function CompletionDaysHeatMapCard() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [heatmapData, setHeatmapData] = useState<
        { day: string; isComplete: boolean }[]
    >([]);
    const [loading, setLoading] = useState(false);

    const fetchTasks = async (date: Date) => {
        setLoading(true);
        const start = startOfMonth(date);
        const end = endOfMonth(date);

        const { data, error } = await supabase
            .from("tasks")
            .select("deadline, completed")
            .gte("deadline", start.toISOString())
            .lte("deadline", end.toISOString());

        if (error) {
            console.error("Error fetching tasks", error);
            setLoading(false);
            return;
        }

        const grouped: Record<string, { total: number; completed: number }> =
            {};

        data.forEach((task) => {
            const dateKey = new Date(task.deadline).toISOString().split("T")[0];
            if (!grouped[dateKey])
                grouped[dateKey] = { total: 0, completed: 0 };
            grouped[dateKey].total += 1;
            if (task.completed) grouped[dateKey].completed += 1;
        });

        const allDays = eachDayOfInterval({ start, end }).map((d) => {
            const dateStr = format(d, "yyyy-MM-dd");
            const stats = grouped[dateStr];
            return {
                day: dateStr,
                isComplete: stats
                    ? stats.total > 0 && stats.total === stats.completed
                    : false,
            };
        });

        setHeatmapData(allDays);
        setLoading(false);
    };

    useEffect(() => {
        fetchTasks(currentDate);
    }, [currentDate]);

    useEffect(() => {
        const channel = supabase
            .channel("task-updates")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "tasks" },
                () => {
                    fetchTasks(currentDate);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentDate]);

    const handleMonthChange = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    return (
        <div className="flex flex-col w-full h-full p-2 pb-0 hover:bg-gray-50 transition justify-between">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700 uppercase">
                    100% Completion Days
                </h3>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-blue-100 rounded-full">
                        <button
                            onClick={() => handleMonthChange(-1)}
                            className="hover:bg-black hover:text-white flex items-center rounded-full justify-center w-10 h-10"
                        >
                            <span className="material-icons">chevron_left</span>
                        </button>
                        <span className="text-sm">
                            {format(currentDate, "MMMM yyyy")}
                        </span>
                        <button
                            onClick={() => handleMonthChange(1)}
                            className="hover:bg-black hover:text-white flex items-center rounded-full justify-center w-10 h-10"
                        >
                            <span className="material-icons">
                                chevron_right
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div className=" w-full flex justify-center h-full items-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={format(currentDate, "yyyy-MM")}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-7 gap-0 text-sm w-fit "
                    >
                        {heatmapData.map((d, i) => {
                            const dayNum = parseInt(d.day.split("-")[2]);
                            return (
                                <div
                                    key={d.day}
                                    className={`w-15 h-15 flex items-center justify-center rounded-full ${
                                        d.isComplete
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-300 text-black"
                                    } `}
                                >
                                    {dayNum}
                                </div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* {loading && (
                <p className="mt-2 text-xs text-gray-500">Refreshing…</p>
            )} */}
        </div>
    );
}
