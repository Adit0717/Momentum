"use client";

import React from "react";

interface TodoCardProps {
    title: string;
    time: string; // e.g., "09:00 AM"
    isCompleted: boolean;
    onToggleComplete?: () => void;
}

export default function TodoCard({
    title,
    time,
    isCompleted,
    onToggleComplete,
}: TodoCardProps) {
    return (
        // todo: on click (except checkbox) open detailed task card
        // todo: give options to update, and delete

        <div className="">
            <div className="flex items-center justify-between px-4 py-3  bg-white hover:bg-gray-100">
                {/* Left Section: Checkbox + Title */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={onToggleComplete}
                        className="w-5 h-5 accent-blue-500"
                    />
                    <span
                        className={`text-lg ${
                            isCompleted
                                ? "line-through text-gray-500"
                                : "text-black"
                        }`}
                    >
                        {title}
                    </span>
                </div>

                {/* Right Section: Time */}
                <div className="text-sm text-gray-600">{time}</div>
            </div>
        </div>
    );
}
