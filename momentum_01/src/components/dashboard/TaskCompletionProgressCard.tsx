"use client";

import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Mode = "today" | "all";

export default function TaskCompletionProgressCard() {
    const [mode, setMode] = useState<Mode>("today");
    const [doneCount, setDoneCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const total = doneCount + pendingCount;
    const pct = total > 0 ? doneCount / total : 0;

    // Helper to load counts
    const loadCounts = useCallback(async () => {
        const { data: user, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user?.user) return;
        const userId = user.user.id;

        let q = supabase
            .from("tasks")
            .select("id,completed", { count: "exact", head: false })
            .eq("user_id", userId);

        if (mode === "today") {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            q = q.gte("created_at", start.toISOString());
        }

        const { data: tasks, error } = await q;
        if (error || !tasks) {
            console.error("Failed to fetch tasks:", error?.message);
            return;
        }
        const done = tasks.filter((t) => t.completed).length;
        setDoneCount(done);
        setPendingCount(tasks.length - done);
    }, [mode]);

    // load on mount and whenever mode changes
    useEffect(() => {
        loadCounts();
    }, [loadCounts]);

    // subscribe to realtime changes on tasks for this user
    useEffect(() => {
        let channel: any;
        (async () => {
            const { data: user } = await supabase.auth.getUser();
            if (!user?.user) return;
            const userId = user.user.id;

            channel = supabase
                .channel("public:tasks")
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "tasks",
                        filter: `user_id=eq.${userId}`,
                    },
                    () => {
                        // any INSERT, UPDATE or DELETE will trigger a reload
                        loadCounts();
                    }
                )
                .subscribe();
        })();

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, [loadCounts]);

    // SVG donut parameters for 300×300
    const R = 135; // radius
    const STROKE = 24; // ring thickness
    const C = 2 * Math.PI * R;
    const dash = pct * C;

    return (
        <div className="w-full h-full flex flex-col hover:bg-gray-100 duration-150">
            {/* header */}
            <div className="flex items-center justify-between mb-4 p-2">
                <div className="text-sm text-gray-700 uppercase">Progress</div>
                <div className="flex  hover:bg-gray-200 rounded-full">
                    <button
                        className={`flex items-center gap-1 ${
                            mode === "all"
                                ? "bg-gray-700 text-white"
                                : "bg-none text-blue-600"
                        }  px-4 py-2 rounded-full hover:bg-gray-600 hover:text-white`}
                        onClick={() =>
                            setMode((m) => (m === "today" ? "all" : "today"))
                        }
                    >
                        All time
                    </button>

                    <button
                        className={`flex items-center gap-1 ${
                            mode === "today"
                                ? "bg-gray-700 text-white"
                                : "bg-none text-blue-600"
                        }  px-4 py-2 rounded-full hover:bg-gray-600 hover:text-white`}
                        onClick={() =>
                            setMode((m) => (m === "today" ? "all" : "today"))
                        }
                    >
                        Today
                    </button>
                </div>
            </div>

            {/* centered donut */}
            <div className="flex flex-col items-center justify-center h-full">
                <svg
                    width={300}
                    height={300}
                    className="transform -rotate-90 ransition-all duration-500 ease-in-out"
                >
                    {/* background ring */}
                    <circle
                        r={R}
                        cx={150}
                        cy={150}
                        fill="transparent"
                        stroke="#e5e7eb"
                        strokeWidth={STROKE}
                    />
                    {/* progress arc */}
                    <circle
                        r={R}
                        cx={150}
                        cy={150}
                        fill="transparent"
                        stroke="#3b82f6"
                        strokeWidth={STROKE}
                        strokeDasharray={`${dash} ${C - dash}`}
                        strokeLinecap="butt"
                        style={{
                            transition: "stroke-dasharray 0.5s ease-in-out",
                        }}
                    />
                </svg>

                {/* percentage text */}
                <div className="absolute flex flex-col items-center mt-2 ">
                    <div className="text-6xl font-semibold font-mono transition-all duration-500 ease-in-out">
                        {Math.round(pct * 100)}%
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                        {doneCount} done / {pendingCount} pending
                    </div>
                </div>
            </div>
        </div>
    );
}
