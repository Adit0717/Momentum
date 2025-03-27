"use client";

import React, { use } from "react";

interface CategoryPillProps {
    label: string;
    color?: string;
    onClick?: () => void;
}

export default function CategoryPill({
    label,
    color = "bg-gray-300",
    onClick,
}: CategoryPillProps) {
    return (
        <button
            onClick={onClick}
            className={`group inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-black hover:opacity-80 transition-all ${color}`}
        >
            <span className="">{label}</span>
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
        </button>
    );
}
