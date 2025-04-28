// ! Known Issues:
// ** RESOLVED Don't want x (remove category) icon on all tasks list; maybe make variants - with or without x icon

"use client";

import React, { use } from "react";

interface CategoryPillProps {
    label: string;
    color?: string;
    textColor?: string;
    onClick?: () => void;
    deletable?: boolean;
}

export default function CategoryPill({
    label,
    color = "#e5e7eb",
    textColor = "text-black",
    onClick,
    deletable = true,
}: CategoryPillProps) {
    return (
        <button
            onClick={onClick}
            className={`group inline-flex items-center px-2 py-1 rounded-full text-xs font-medium  hover:opacity-60 transition-all ${textColor}`}
            style={{
                backgroundColor: color || "#e5e7eb",
            }}
        >
            <span className="">{label}</span>
            {deletable && (
                <span
                    className="
          text-gray-700 text-sm
          opacity-0 
          w-0
          group-hover:opacity-100 
          group-hover:w-fit
          group-hover:ml-1
          transition-all
        "
                >
                    &times;
                </span>
            )}
        </button>
    );
}
