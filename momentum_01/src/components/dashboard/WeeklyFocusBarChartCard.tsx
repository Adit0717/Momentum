"use client";

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";

// visx
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import FocusSessionLogDialogBox from "../FocusSessionLogDialogBox";

// types
interface Session {
    started_at: string;
    ended_at: string;
}

// one bar datum
interface DayData {
    day: string; // e.g. 'Mon'
    seconds: number; // total seconds focused that day
}

export default function WeeklyFocusBarChartCard() {
    const [showFocusLogsPanel, setShowFocusLogsPanel] = useState(false);

    // which Monday does our week start on?
    const [weekStart, setWeekStart] = useState<Date>(() => {
        const d = new Date();
        // roll back to this week's Monday
        const gap = (d.getDay() + 6) % 7;
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - gap);
        return d;
    });

    // raw sessions for that week
    const [sessions, setSessions] = useState<Session[]>([]);

    // fetch once weekStart changes
    useEffect(() => {
        (async () => {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData?.user) return;

            const userId = userData.user.id;
            const isoStart = weekStart.toISOString();
            const end = new Date(weekStart);
            end.setDate(end.getDate() + 7);
            const isoEnd = end.toISOString();

            const { data, error } = await supabase
                .from("focus_sessions")
                .select("started_at, ended_at")
                .eq("user_id", userId)
                .gte("started_at", isoStart)
                .lt("started_at", isoEnd);

            if (error) {
                console.error("couldn't load sessions:", error.message);
            } else {
                setSessions(data || []);
            }
        })();
    }, [weekStart]);

    // aggregate into 7 days
    const data: DayData[] = useMemo(() => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
            (day) => ({
                day,
                seconds: 0,
            })
        );
        sessions.forEach(({ started_at, ended_at }) => {
            const s = new Date(started_at);
            const e = new Date(ended_at);
            const idx = (s.getDay() + 6) % 7; // Mon=0
            days[idx].seconds += (e.getTime() - s.getTime()) / 1000;
        });
        return days;
    }, [sessions]);

    // paging handlers
    const prevWeek = () => {
        setWeekStart((w) => {
            const x = new Date(w);
            x.setDate(x.getDate() - 7);
            return x;
        });
    };
    const nextWeek = () => {
        setWeekStart((w) => {
            const x = new Date(w);
            x.setDate(x.getDate() + 7);
            return x;
        });
    };

    return (
        <div className="flex flex-col w-full h-full p-4 pb-0 hover:bg-gray-50 transition">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">
                    WEEKLY FOCUS
                </h3>
                <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2 bg-blue-100 rounded-full">
                        <button
                            onClick={prevWeek}
                            className="hover:bg-black hover:text-white flex items-center rounded-full justify-center w-10 h-10"
                        >
                            <span className="material-icons">chevron_left</span>
                        </button>
                        <span className="text-sm">
                            {weekStart.toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                            })}
                            &nbsp;-&nbsp;
                            {new Date(
                                weekStart.getTime() + 6 * 864e5
                            ).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                        <button
                            onClick={nextWeek}
                            className="hover:bg-black hover:text-white flex items-center rounded-full justify-center w-10 h-10"
                        >
                            <span className="material-icons">
                                chevron_right
                            </span>
                        </button>
                    </div>
                    <button
                        onClick={() => setShowFocusLogsPanel(true)}
                        className="flex items-center gap-1 bg-gray-700 text-gray-300 px-4 pe-2 py-2 rounded-full hover:bg-gray-600"
                    >
                        Focus Logs
                        <span className="material-icons text-sm">
                            arrow_outward
                        </span>
                    </button>
                    <FocusSessionLogDialogBox
                        isOpen={showFocusLogsPanel}
                        onClose={() => setShowFocusLogsPanel(false)}
                    />
                </div>
            </div>
            <div className="flex-1"></div>
            <div className="w-full h-9/12 ">
                <ParentSize>
                    {({ width, height }) => {
                        // margins
                        const margin = {
                            top: 20,
                            right: 10,
                            bottom: 0,
                            left: 40,
                        };
                        const xMax = width - margin.left - margin.right;
                        const yMax = height - margin.top - margin.bottom;

                        // scales
                        const xScale = scaleBand<string>({
                            domain: data.map((d) => d.day),
                            range: [0, xMax],
                            padding: 0.1,
                        });
                        const maxSec = Math.max(
                            ...data.map((d) => d.seconds),
                            0
                        );
                        const yScale = scaleLinear<number>({
                            domain: [0, maxSec],
                            range: [yMax, 30],
                            nice: true,
                        });

                        return (
                            <svg width={width} height={height}>
                                <Group top={margin.top} left={margin.left}>
                                    {/* bars */}
                                    {data.map((d) => {
                                        const fullBW = xScale.bandwidth();
                                        const BW = fullBW * 0.3;
                                        const offset = (fullBW - BW) / 2;

                                        return (
                                            <Bar
                                                key={d.day}
                                                x={xScale(d.day)! + offset}
                                                y={yScale(d.seconds)}
                                                width={BW}
                                                height={
                                                    yMax - yScale(d.seconds)
                                                }
                                                fill="#3b82f6"
                                                style={{
                                                    transition:
                                                        "height 0.3s, y 0.3s",
                                                }}
                                            />
                                        );
                                    })}
                                    <AxisBottom
                                        // top={yMax}
                                        scale={xScale}
                                        tickLength={0}
                                        strokeWidth={0}
                                        tickLabelProps={() => ({
                                            fill: "#000",
                                            fontSize: 10,
                                            textAnchor: "middle",
                                            dy: "0.1em",
                                            className: "uppercase",
                                        })}
                                    />
                                </Group>
                            </svg>
                        );
                    }}
                </ParentSize>
            </div>
        </div>
    );
}
