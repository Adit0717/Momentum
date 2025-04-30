"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

// VisX
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { LinePath, AreaClosed } from "@visx/shape";
import { Group } from "@visx/group";
import { curveMonotoneX } from "@visx/curve";
import { LinearGradient } from "@visx/gradient";
import { Calistoga } from "next/font/google";

interface Task {
    created_at: string;
    completed: boolean;
}

interface DayCounts {
    day: string;
    completed: number;
    pending: number;
}

export default function TaskCompletionTrendCard() {
    // ——————————————
    // State: week paging
    // ——————————————
    const [weekStart, setWeekStart] = useState<Date>(() => {
        const d = new Date();
        const gap = (d.getDay() + 6) % 7; // roll back so Mon=0
        d.setDate(d.getDate() - gap);
        d.setHours(0, 0, 0, 0);
        return d;
    });

    // ——————————————
    // State: raw tasks for chosen week
    // ——————————————
    const [tasks, setTasks] = useState([]);

    // ——————————————
    // When weekStart changes, re‐query by deadline
    // ——————————————
    useEffect(() => {
        (async () => {
            const { data: u } = await supabase.auth.getUser();
            if (!u?.user) return;
            const uid = u.user.id;

            const fromIso = weekStart.toISOString();
            const endDate = new Date(weekStart);
            endDate.setDate(endDate.getDate() + 7);
            const toIso = endDate.toISOString();

            const { data, error } = await supabase
                .from("tasks")
                .select("deadline,completed")
                .eq("user_id", uid)
                .gte("deadline", fromIso)
                .lt("deadline", toIso);

            if (error) {
                console.error("load tasks by deadline failed:", error.message);
            } else {
                setTasks(data || []);
            }
        })();
    }, [weekStart]);

    // ——————————————
    // Bucket into days Mon–Sun based on deadline
    // ——————————————
    const data = useMemo<DayCounts[]>(() => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
            (d) => ({
                day: d,
                completed: 0,
                pending: 0,
            })
        );

        tasks.forEach((t) => {
            const dt = new Date(t.deadline);
            const idx = (dt.getDay() + 6) % 7; // Mon=0
            if (t.completed) days[idx].completed += 1;
            else days[idx].pending += 1;
        });

        return days;
    }, [tasks]);

    // ——————————————
    // Pager handlers
    // ——————————————
    const prevWeek = () =>
        setWeekStart((w) => {
            const x = new Date(w);
            x.setDate(x.getDate() - 7);
            return x;
        });
    const nextWeek = () =>
        setWeekStart((w) => {
            const x = new Date(w);
            x.setDate(x.getDate() + 7);
            return x;
        });

    return (
        <div
            // ref={containerRef}
            className="flex flex-col w-full h-full p-2 pb-0 hover:bg-gray-50 transition"
        >
            {/* header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">
                    TASK COMPLETION TREND
                </h3>

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
                        <span className="material-icons">chevron_right</span>
                    </button>
                </div>
            </div>
            <div className="flex-1"></div>
            <div className="mt-2 text-xs text-gray-500 flex justify-center p-2 gap-4">
                <span className="inline-flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-1" />
                    Completed
                </span>
                <span className="inline-flex items-center">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1" />
                    Pending
                </span>
            </div>

            {/* chart */}
            <div className="w-full h-9/12 ">
                <ParentSize>
                    {({ width, height }) => {
                        const margin = {
                            top: 20,
                            right: 0,
                            bottom: 1,
                            left: 0,
                        };
                        const xMax = width - margin.left - margin.right;
                        const yMax = height - margin.top - margin.bottom;

                        // x = day band
                        const xScale = scaleBand<string>({
                            domain: data.map((d) => d.day),
                            range: [0, xMax],
                            // padding: 0.2,
                        });

                        // y = max count
                        const maxY = Math.max(
                            ...data.map((d) =>
                                Math.max(d.completed, d.pending)
                            ),
                            0
                        );
                        const yScale = scaleLinear<number>({
                            domain: [0, maxY],
                            range: [yMax, 30],
                            nice: true,
                        });

                        return (
                            <svg width={width} height={height}>
                                {/* define gradients */}
                                {/* legend */}

                                <LinearGradient
                                    id="grad-completed"
                                    from="#10b981"
                                    to="#10b981"
                                    fromOpacity={1}
                                    toOpacity={0}
                                />
                                <LinearGradient
                                    id="grad-pending"
                                    from="#f59e0b"
                                    to="#f59e0b"
                                    fromOpacity={1}
                                    toOpacity={0}
                                />

                                <Group top={margin.top} left={margin.left}>
                                    {/* completed area */}
                                    <AreaClosed<DayCounts>
                                        data={data}
                                        x={(d) =>
                                            xScale(d.day)! +
                                            xScale.bandwidth() / 2
                                        }
                                        y={(d) => yScale(d.completed)}
                                        yScale={yScale}
                                        curve={curveMonotoneX}
                                        fill="url(#grad-completed)"
                                        style={{
                                            transition: "all 0.3s ease-in-out",
                                        }}
                                    />
                                    {/* pending  area */}
                                    <AreaClosed<DayCounts>
                                        data={data}
                                        x={(d) =>
                                            xScale(d.day)! +
                                            xScale.bandwidth() / 2
                                        }
                                        y={(d) => yScale(d.pending)}
                                        yScale={yScale}
                                        curve={curveMonotoneX}
                                        fill="url(#grad-pending)"
                                    />

                                    {/* completed line */}
                                    <LinePath<DayCounts>
                                        data={data}
                                        x={(d) =>
                                            xScale(d.day)! +
                                            xScale.bandwidth() / 2
                                        }
                                        y={(d) => yScale(d.completed)}
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        curve={curveMonotoneX}
                                        style={{
                                            transition: "all 0.3s ease-in-out",
                                        }}
                                    />
                                    {/* pending line */}
                                    <LinePath<DayCounts>
                                        data={data}
                                        x={(d) =>
                                            xScale(d.day)! +
                                            xScale.bandwidth() / 2
                                        }
                                        y={(d) => yScale(d.pending)}
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        curve={curveMonotoneX}
                                        style={{
                                            transition: "all 0.3s ease-in-out",
                                        }}
                                    />

                                    {/* axes */}

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
            {/* {tooltip && (
                <div
                    className="pointer-events-none absolute bg-white text-sm text-gray-800 px-2 py-1 rounded shadow z-30"
                    style={{
                        top: tooltip.y,
                        left: tooltip.x,
                    }}
                >
                    <div>
                        <strong>{tooltip.data.day}</strong>
                    </div>
                    <div>{tooltip.data.completed}</div>
                    <div>{tooltip.data.pending}</div>
                </div>
            )} */}
        </div>
    );
}
