"use client";

import React from "react";
import "material-icons/iconfont/material-icons.css";

interface CategoryPillProps {
    label: string;
    onClick?: () => void;
    deletable?: boolean;
}

export default function CategoryPill({
    label,
    onClick,
    deletable = true,
}: CategoryPillProps) {
    return (
        <button
            onClick={onClick}
            className="inline-flex items-center px-2 py-2 rounded-full duration-300 ease-in-out bg-gray-200 text-black text-xs font-medium hover:opacity-60 transition-all"
        >
            <span className="font-medium">{label}</span>
            {deletable && (
                <span
                    className="material-icons text-black ml-1 text-sm opacity-35 "
                    style={{ fontSize: 16 }}
                >
                    close
                </span>
            )}
        </button>
    );
}
