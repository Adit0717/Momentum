"use client";

import CategoryPill from "@/components/CategoryPill";
import { useState, useEffect } from "react";

export default function FocusView() {
    const [seconds, setSeconds] = useState(0);
    const [status, setStatus] = useState<"idle" | "running" | "paused">("idle");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const tagOptions = [
        "Homework",
        "Tasks",
        "Revision",
        "Zen mode",
        "Midterm Prep",
        "Test",
        "Finals",
        "Semester Prep",
        "Assignment",
    ]; // Basic List of tags for category selection

    const format = (val: number) => val.toString().padStart(2, "0");
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    useEffect(() => {
        if (status !== "running") return;

        const interval = setInterval(() => {
            setSeconds((s) => s + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [status]);

    const resetTimer = () => {
        setStatus("idle");
        setSeconds(0);
    };

    return (
        <div className="w-full h-full relative flex flex-col px-4 pt-4 items-center justify-center z-0">
            {/*Top-left: "Focus" label (within bordered box) */}
            <div className="absolute top-6 left-6 text-4xl font-light">
                Focus
            </div>

            {/*Timer Display */}
            <div className="flex gap-6 mt-20 items-end">
                {/* Hours */}
                <div className="flex flex-col items-center">
                    <div className="text-7xl font tracking-widest">
                        {format(hrs)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">hrs</div>
                </div>

                {/* Colon */}
                <div className="flex flex-col items-center">
                    <div className="text-7xl font-mono">:</div>
                    <div className="text-sm text-white mt-1 select-none">.</div>
                </div>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                    <div className="text-7xl font tracking-widest">
                        {format(mins)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">minutes</div>
                </div>

                {/* Colon */}
                <div className="flex flex-col items-center">
                    <div className="text-7xl font-mono">:</div>
                    <div className="text-sm text-white mt-1 select-none">.</div>
                </div>

                {/* Seconds */}
                <div className="flex flex-col items-center">
                    <div className="text-7xl font tracking-widest">
                        {format(secs)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">seconds</div>
                </div>
            </div>

            {/* Tag Selection -- need to replace it with CategoryPill component */}
            <div className="mt-6">
                {selectedTag ? (
                    <div
                        className="bg-orange-200 px-4 py-1 rounded-full text-sm inline-flex items-center gap-2 cursor-pointer"
                        onClick={() => setSelectedTag(null)}
                    >
                        {selectedTag} <span className="font-semibold">✕</span>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2 justify-center">
                        {tagOptions.map((tag) => (
                            <CategoryPill
                                key={tag}
                                label={tag}
                                deletable={false}
                                onClick={() => setSelectedTag(tag)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/*Timer Controls */}
            <div className="mt-10 flex gap-4">
                {status === "idle" && (
                    <button
                        onClick={() => setStatus("running")}
                        className="bg-black text-white px-6 py-2 rounded-md cursor-pointer"
                    >
                        Let’s Work
                    </button>
                )}

                {status === "running" && (
                    <>
                        <button
                            onClick={() => setStatus("paused")}
                            className="bg-black text-white px-6 py-2 rounded-md cursor-pointer"
                        >
                            Pause
                        </button>
                        <button
                            onClick={resetTimer}
                            className="bg-red-500 text-white px-6 py-2 rounded-md cursor-pointer"
                        >
                            Stop
                        </button>
                    </>
                )}

                {status === "paused" && (
                    <>
                        <button
                            onClick={() => setStatus("running")}
                            className="bg-black text-white px-6 py-2 rounded-md cursor-pointer"
                        >
                            Resume
                        </button>
                        <button
                            onClick={resetTimer}
                            className="bg-red-500 text-white px-6 py-2 rounded-md cursor-pointer"
                        >
                            Stop
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
