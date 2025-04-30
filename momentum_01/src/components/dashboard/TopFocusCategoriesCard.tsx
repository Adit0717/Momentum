"use client";

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Session {
    category_id: string | null;
    started_at: string;
    ended_at: string;
}

interface Category {
    id: string;
    cat_name: string;
}

interface Aggregated {
    categoryId: string | null;
    count: number;
    totalSec: number;
}

export default function TopFocusCategoriesCard() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // fetch sessions + categories once
    useEffect(() => {
        (async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            // fetch sessions
            const { data: sessData } = await supabase
                .from("focus_sessions")
                .select("category_id, started_at, ended_at")
                .eq("user_id", user.id);

            if (sessData) setSessions(sessData);

            // fetch categories
            const { data: catData } = await supabase
                .from("task_categories")
                .select("id, cat_name")
                .eq("user_id", user.id);

            if (catData) setCategories(catData);
        })();
    }, []);

    // aggregate by category
    const top6 = useMemo(() => {
        const aggMap: Record<string, Aggregated> = {};

        sessions.forEach(({ category_id, started_at, ended_at }) => {
            const key = category_id ?? "__none__";
            const start = new Date(started_at).getTime();
            const end = new Date(ended_at).getTime();
            const dur = Math.max(0, Math.floor((end - start) / 1000));

            if (!aggMap[key]) {
                aggMap[key] = {
                    categoryId: category_id,
                    count: 0,
                    totalSec: 0,
                };
            }
            aggMap[key].count++;
            aggMap[key].totalSec += dur;
        });

        const arr = Object.values(aggMap);
        arr.sort((a, b) => b.count - a.count);
        return arr.slice(0, 7);
    }, [sessions]);

    // helper to format seconds → "02h 05m"
    const formatHM = (sec: number) => {
        const h = Math.floor(sec / 3600)
            .toString()
            .padStart(2, "0");
        const m = Math.floor((sec % 3600) / 60)
            .toString()
            .padStart(2, "0");
        return `${h}h ${m}m`;
    };

    return (
        <div className="w-full h-full flex flex-col p-4 hover:bg-gray-100 transition justify-between">
            <div className="text-sm text-gray-700 mb-2 uppercase">
                Top Focus Categories
            </div>
            <div className="flex flex-col text-lg space-y-2">
                <div className="flex justify-between items-center text-sm mb-5 text-gray-500">
                    <div className="">Name</div>
                    <div className="flex-1 text-right text-gray-800 pr-10">
                        Times
                    </div>
                    <div className="text-gray-800">Duration</div>
                </div>
                {top6.map(({ categoryId, count, totalSec }, i) => {
                    // look up category name
                    const cat =
                        categories.find((c) => c.id === categoryId)?.cat_name ||
                        (categoryId === null ? "Uncategorized" : "Unknown");

                    // compute progressive opacity: index 0 → 1.0, last → 0.5
                    const max = 1;
                    const min = 0.4;
                    const stepCount = top6.length - 1 || 1;
                    const opacity = max - (i / stepCount) * (max - min);

                    return (
                        <div
                            key={categoryId ?? "__none__"}
                            className="flex justify-between items-center"
                        >
                            <div
                                className=" bg-blue-400 px-3 py-2 rounded-full"
                                style={{ opacity }}
                            >
                                {cat}
                            </div>
                            <div
                                className="flex-1 text-right text-gray-800 pr-10"
                                style={{ opacity }}
                            >
                                {count}
                            </div>
                            <div className="text-gray-800" style={{ opacity }}>
                                {formatHM(totalSec)}
                            </div>
                        </div>
                    );
                })}
                {top6.length === 0 && (
                    <div className="text-gray-500">
                        No sessions recorded yet
                    </div>
                )}
            </div>
        </div>
    );
}
