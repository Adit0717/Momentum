"use client";

import React, { useEffect, useRef, useState } from "react";
import CategoryPill from "./CategoryPill";
import TodoDialogBox from "./TodoDialogBox";

interface TodoCardProps {
    title: string;
    time?: string;
    description?: string;
    category?: string;
    isCompleted?: boolean;
    onToggleComplete?: () => void;
    showDescription?: boolean;
}

const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

export default function TodoCard({
    title,
    time,
    description,
    category,
    isCompleted,
    onToggleComplete,
    showDescription,
}: TodoCardProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleCardClick = () => {
        setDialogOpen(true);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;

        setMenuPos({ x: localX, y: localY });
        setMenuOpen(true);
    };

    const handleCloseMenu = () => {
        setMenuOpen(false);
    };

    const handleView = () => {
        console.log("View task:", title);
        handleCloseMenu();
    };

    const handleDelete = () => {
        console.log("Delete task:", title);
        handleCloseMenu();
    };

    useEffect(() => {
        function handleGlobalContextMenu(e: MouseEvent) {
            if (
                cardRef.current &&
                !cardRef.current.contains(e.target as Node)
            ) {
                setMenuOpen(false);
            }
        }
        function handleGlobalMouseDown(e: MouseEvent) {
            if (
                cardRef.current &&
                !cardRef.current.contains(e.target as Node)
            ) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("contextmenu", handleGlobalContextMenu);
        document.addEventListener("mousedown", handleGlobalMouseDown);
        return () => {
            document.removeEventListener(
                "contextmenu",
                handleGlobalContextMenu
            );
            document.removeEventListener("mousedown", handleGlobalMouseDown);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className="relative transition-all duration-300 ease-in-out"
            onContextMenu={handleContextMenu}
        >
            <div className="flex items-start justify-between hover:bg-gray-100 gap-2 transition duration-150">
                <div className="flex items-center ps-4 pt-5">
                    <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={(e) => {
                            e.stopPropagation();
                            onToggleComplete && onToggleComplete();
                        }}
                        className="w-5 h-5 accent-blue-500"
                    />
                </div>

                <div
                    className="flex flex-col w-full gap-1 py-4 ps-2 pe-4"
                    onClick={handleCardClick}
                >
                    <div className="flex justify-between w-full items-center">
                        <span
                            className={`text-lg ${
                                isCompleted
                                    ? "line-through text-gray-500 opacity-60"
                                    : "text-black opacity-100"
                            } `}
                        >
                            {title}
                        </span>

                        {/* ✅ Time */}
                    </div>

                    {time && (
                        <div
                            className={`text-sm ${
                                new Date(time) > new Date()
                                    ? "text-blue-600"
                                    : "text-red-500"
                            }`}
                        >
                            {formatDateTime(time)}
                        </div>
                    )}
                    {showDescription && description && (
                        <div className="text-sm w-full text-gray-500">
                            {description}
                        </div>
                    )}

                    {/* Category */}
                    <div className="flex flex-wrap mt-1">
                        {category && (
                            <CategoryPill label={category} deletable={false} />
                        )}
                    </div>
                </div>
            </div>

            {/* Dialog box */}
            {dialogOpen && (
                <TodoDialogBox
                    title={title}
                    description={description}
                    category={category}
                    time={time}
                    onClose={() => setDialogOpen(false)}
                />
            )}

            {/* Context Menu */}
            {menuOpen && (
                <div
                    className="absolute backdrop-blur-md border border-gray-300 z-50"
                    style={{
                        top: menuPos.y,
                        left: menuPos.x,
                        backgroundColor: "#00000010",
                    }}
                >
                    <button
                        onClick={handleView}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-300 hover:ps-6 hover:pe-4 transition-all duration-150"
                    >
                        View / Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="block w-full text-left px-4 py-2 pe-6 hover:bg-red-300 hover:text-red-900 hover:ps-6 hover:pe-4 transition-all duration-150"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
