"use client";

import React, { useEffect, useRef, useState } from "react";
import CategoryPill from "./CategoryPill";
import TodoDialogBox from "./TodoDialogBox";

interface TodoCardProps {
    taskId: string;
    title: string;
    time?: string;
    description?: string;
    category?: { id: string; name: string } | null;

    isCompleted?: boolean;
    onToggleComplete?: () => void;
    showDescription?: boolean;
    showCategories?: boolean;
    onDelete?: (taskId: string) => void;
    onTaskUpdate?: (
        taskId: string,
        newTitle: string,
        newDescription: string,
        newDeadline: string | null,
        newCategory: { id: string; name: string } | null
    ) => Promise<void>;
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
    taskId,
    title,
    time,
    description,
    category = null,
    isCompleted,
    onToggleComplete,
    showDescription = true,
    showCategories = true,
    onDelete,
    onTaskUpdate,
}: TodoCardProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    // open edit dialog
    const handleCardClick = () => setDialogOpen(true);

    // custom context‐menu
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMenuPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
        setMenuOpen(true);
    };
    const closeMenu = () => setMenuOpen(false);

    // delete
    const handleDelete = () => {
        onDelete?.(taskId);
        closeMenu();
    };

    // click‐away closes the menu
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                cardRef.current &&
                !cardRef.current.contains(e.target as Node)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div
            ref={cardRef}
            className="relative transition-all duration-300 ease-in-out"
            onContextMenu={handleContextMenu}
        >
            <div className="flex items-start justify-between hover:bg-gray-100 gap-2 transition duration-150">
                <div className="ps-4 pt-5">
                    <input
                        type="checkbox"
                        checked={!!isCompleted}
                        onChange={(e) => {
                            e.stopPropagation();
                            onToggleComplete?.();
                        }}
                        className="w-5 h-5 accent-blue-500"
                    />
                </div>

                <div
                    className="flex flex-col w-full gap-1 py-4 ps-2 pe-4 cursor-pointer"
                    onClick={handleCardClick}
                >
                    {/* Title */}
                    <span
                        className={`text-lg ${
                            isCompleted
                                ? "line-through text-gray-500 opacity-60"
                                : "text-black opacity-100"
                        }`}
                    >
                        {title}
                    </span>

                    {/* Deadline */}
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

                    {/* Description */}
                    {description && (
                        <div
                            className={`text-sm text-gray-500 transition-all duration-300 ease-in-out overflow-hidden ${
                                showDescription
                                    ? "opacity-100 max-h-40"
                                    : "opacity-0 max-h-0"
                            }`}
                            style={{
                                transitionProperty: "opacity, max-height",
                            }}
                        >
                            {description}
                        </div>
                    )}

                    {/* Category Pill */}
                    <div
                        className={`flex overflow-hidden transition-all duration-300 ease-in-out ${
                            showCategories && category
                                ? "opacity-100 max-h-40"
                                : "opacity-0 max-h-0"
                        }`}
                        style={{ transitionProperty: "opacity, max-height" }}
                    >
                        {category && (
                            <CategoryPill
                                label={category.name}
                                deletable={false}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Edit / Delete Dialog */}
            {dialogOpen && (
                <TodoDialogBox
                    taskId={taskId}
                    title={title}
                    description={description}
                    time={time}
                    category={category}
                    onClose={() => setDialogOpen(false)}
                    onDelete={() => {
                        onDelete?.(taskId);
                        setDialogOpen(false);
                    }}
                    onUpdate={async (
                        _,
                        newTitle,
                        newDescription,
                        newDeadline,
                        newCategory
                    ) => {
                        // 1) update local UI & parent state
                        await onTaskUpdate?.(
                            taskId,
                            newTitle,
                            newDescription,
                            newDeadline,
                            newCategory
                        );
                        // 2) close dialog
                        setDialogOpen(false);
                    }}
                />
            )}

            {/* Context Menu */}
            {menuOpen && (
                <div
                    className="absolute backdrop-blur-md border border-gray-300 z-50 bg-white"
                    style={{ top: menuPos.y, left: menuPos.x }}
                >
                    <button
                        onClick={() => {
                            handleCardClick();
                            closeMenu();
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                        View / Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="block w-full text-left px-4 py-2 hover:bg-red-200 text-red-800"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
