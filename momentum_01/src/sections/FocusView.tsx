"use client";

import React, { useEffect, useState } from "react";
import CategoryPill from "@/components/CategoryPill";
import { supabase } from "@/lib/supabaseClient";
import FocusSessionLogDialogBox from "@/components/FocusSessionLogDialogBox";

interface Category {
    id: string;
    cat_name: string;
}

export default function FocusView() {
    // timer state
    const [seconds, setSeconds] = useState(0);
    const [status, setStatus] = useState<"idle" | "running" | "paused">("idle");

    // timestamps
    const [startTime, setStartTime] = useState<string | null>(null);

    // session metadata
    const [sessionName, setSessionName] = useState("");
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [localCategory, setLocalCategory] = useState<Category | null>(null);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [categoryInput, setCategoryInput] = useState("");

    // logs panel
    const [showLogsPanel, setShowLogsPanel] = useState(false);

    // formatting helpers
    const pad = (n: number) => n.toString().padStart(2, "0");
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // fetch categories once on mount
    useEffect(() => {
        (async () => {
            const { data: u, error: authErr } = await supabase.auth.getUser();
            if (authErr || !u?.user) return;
            const userId = u.user.id;
            const { data, error } = await supabase
                .from("task_categories")
                .select("id,cat_name")
                .eq("user_id", userId)
                .order("created_at", { ascending: true });
            if (!error && data) setAllCategories(data);
        })();
    }, []);

    // create-or-pick category
    const createCategory = async () => {
        const name = categoryInput.trim();
        if (!name) return;
        const { data: u, error: authErr } = await supabase.auth.getUser();
        if (authErr || !u?.user) return;
        const userId = u.user.id;
        const { data, error } = await supabase
            .from("task_categories")
            .insert({ cat_name: name, user_id: userId })
            .select("id,cat_name")
            .single();
        if (!error && data) {
            setAllCategories((c) => [...c, data]);
            setLocalCategory(data);
            setCategoryInput("");
            setShowCategoryDropdown(false);
        }
    };

    // timer ticking
    useEffect(() => {
        if (status !== "running") return;
        const iv = setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => clearInterval(iv);
    }, [status]);

    // save session record on Stop
    const saveSession = async () => {
        if (!startTime) return;
        const endTime = new Date().toISOString();
        const { data: u, error: authErr } = await supabase.auth.getUser();
        if (authErr || !u?.user) {
            console.error("Not logged in—cannot save session");
            return;
        }
        const payload = {
            user_id: u.user.id,
            name: sessionName.trim() || "New Focus Session",
            category_id: localCategory?.id ?? null,
            started_at: startTime,
            ended_at: endTime,
        };
        const { error } = await supabase.from("focus_sessions").insert(payload);
        if (error) console.error("Failed to save session:", error.message);
    };

    // Stop button handler: save & reset UI
    const handleStop = async () => {
        await saveSession();
        setStatus("idle");
        setSeconds(0);
        setSessionName("");
        setLocalCategory(null);
        setStartTime(null);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
            {/* Title */}
            <div className="absolute top-5 left-5 text-4xl font-light">
                Focus
            </div>

            {/* Timer */}
            <div className="flex gap-6 items-end justify-center w-full py-6">
                {[hrs, mins, secs].map((v, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className="text-7xl font-mono">{pad(v)}</div>
                        <div className="text-sm text-gray-700 mt-1">
                            {i === 0 ? "hrs" : i === 1 ? "min" : "sec"}
                        </div>
                    </div>
                ))}
            </div>

            {/* Session name & category */}
            <div className="mt-6 flex items-center space-x-4 relative">
                <input
                    type="text"
                    placeholder="Session name…"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className="px-3 py-1 bg-gray-100 rounded-lg focus:outline-none"
                />

                {localCategory ? (
                    <CategoryPill
                        label={localCategory.cat_name}
                        deletable
                        onClick={() => {
                            setLocalCategory(null);
                            setShowCategoryDropdown(true);
                        }}
                    />
                ) : (
                    <CategoryPill
                        label="+ Add Category"
                        deletable={false}
                        onClick={() => setShowCategoryDropdown(true)}
                    />
                )}

                {showCategoryDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white border rounded-xl shadow-md p-3 z-20">
                        <input
                            type="text"
                            placeholder="Search or create…"
                            className="w-full px-2 py-1 border-b focus:outline-none mb-2"
                            value={categoryInput}
                            onChange={(e) => setCategoryInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    setShowCategoryDropdown(false);
                                    setCategoryInput("");
                                }
                                if (e.key === "Enter") {
                                    const m = allCategories.find(
                                        (c) =>
                                            c.cat_name.toLowerCase() ===
                                            categoryInput.trim().toLowerCase()
                                    );
                                    if (m) {
                                        setLocalCategory(m);
                                        setShowCategoryDropdown(false);
                                        setCategoryInput("");
                                    } else createCategory();
                                }
                            }}
                            autoFocus
                        />

                        <div className="flex flex-wrap gap-2 max-h-32 overflow-auto">
                            {allCategories
                                .filter((c) =>
                                    c.cat_name
                                        .toLowerCase()
                                        .includes(categoryInput.toLowerCase())
                                )
                                .map((c) => (
                                    <CategoryPill
                                        key={c.id}
                                        label={c.cat_name}
                                        onClick={() => {
                                            setLocalCategory(c);
                                            setShowCategoryDropdown(false);
                                            setCategoryInput("");
                                        }}
                                        deletable={false}
                                    />
                                ))}
                        </div>

                        {categoryInput.trim() &&
                            !allCategories.some(
                                (c) =>
                                    c.cat_name.toLowerCase() ===
                                    categoryInput.trim().toLowerCase()
                            ) && (
                                <div
                                    className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer"
                                    onClick={createCategory}
                                >
                                    + Create “{categoryInput.trim()}”
                                </div>
                            )}
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="mt-10 flex gap-4">
                {status === "idle" && (
                    <button
                        onClick={() => {
                            setStartTime(new Date().toISOString());
                            setStatus("running");
                        }}
                        className="bg-black text-white px-6 py-2 rounded-md"
                    >
                        Let's Work
                    </button>
                )}

                {status === "running" && (
                    <>
                        <button
                            onClick={() => setStatus("paused")}
                            className="bg-black text-white px-6 py-2 rounded-md"
                        >
                            Pause
                        </button>
                        <button
                            onClick={handleStop}
                            className="bg-red-500 text-white px-6 py-2 rounded-md"
                        >
                            Stop
                        </button>
                    </>
                )}

                {status === "paused" && (
                    <>
                        <button
                            onClick={() => setStatus("running")}
                            className="bg-black text-white px-6 py-2 rounded-md"
                        >
                            Resume
                        </button>
                        <button
                            onClick={handleStop}
                            className="bg-red-500 text-white px-6 py-2 rounded-md"
                        >
                            Stop
                        </button>
                    </>
                )}
            </div>

            {/* Bottom bar: Logs button & Today’s total */}
            <div className="absolute bottom-0 w-full flex items-center justify-between p-4 bg-white/80">
                <button
                    onClick={() => setShowLogsPanel(true)}
                    className="flex items-center gap-1 bg-gray-700 text-gray-300 px-4 pe-2 py-2 rounded-full hover:bg-gray-600"
                >
                    Focus Logs
                    <span className="material-icons text-sm">
                        arrow_outward
                    </span>
                </button>

                <TodayTotalFocused />
            </div>

            {/* session logs dialog (all past sessions) */}
            <FocusSessionLogDialogBox
                isOpen={showLogsPanel}
                onClose={() => setShowLogsPanel(false)}
            />
        </div>
    );
}

// helper to compute accumulated focus time today
function TodayTotalFocused() {
    const [totalSec, setTotalSec] = useState(0);

    useEffect(() => {
        (async () => {
            const { data: u } = await supabase.auth.getUser();
            if (!u?.user) return;
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            const { data, error } = await supabase
                .from("focus_sessions")
                .select("started_at,ended_at")
                .gte("started_at", todayStart.toISOString())
                .eq("user_id", u.user.id);
            if (error || !data) return;

            const sum = data.reduce((acc, { started_at, ended_at }) => {
                const s = new Date(started_at).getTime();
                const e = new Date(ended_at).getTime();
                return acc + Math.max(0, e - s);
            }, 0);
            setTotalSec(Math.floor(sum / 1000));
        })();
    }, []);

    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    return (
        <div className="text-sm text-gray-700">
            {h}h {m}m focused today
        </div>
    );
}
