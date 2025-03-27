"use client";

import React, { useEffect, useRef, useState } from "react";
import CategoryPill from "./CategoryPill";

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
    // ? Context menu (view and delete)
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    // handle right click to open menu
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!cardRef.current) return;

        // Get bounding rectangle of the card
        const rect = cardRef.current.getBoundingClientRect();

        // Calculate local coordinates within the card
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;

        setMenuPos({ x: localX, y: localY });
        setMenuOpen(true);
    };

    // close menu if user chooses an option or clicks elsewhere
    const handleCloseMenu = () => {
        setMenuOpen(false);
    };

    const handleView = () => {
        console.log("View tasks:", title);
        // todo: Handle view/edit todo logic
        handleCloseMenu();
    };

    const handleDelete = () => {
        console.log("Delete task:", title);
        // todo: Handle delete todo logic

        handleCloseMenu();
    };

    // ? detects outside clicks and closes the context menu
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
        // todo: on click (except checkbox) open detailed task card
        // todo: give options to update, and delete

        <div
            ref={cardRef}
            className="relative"
            onContextMenu={handleContextMenu} // ? listening for right click
            // onClick={handleCloseMenu} // ? clicking anywhere on the card closes the menu
        >
            <div className="flex flex-col justify-between px-4 py-3 bg-white hover:bg-gray-100 gap-2">
                {/* Left Section: Checkbox + Title */}
                <div className="flex items-center justify-between">
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
                <div className="ps-7 text-sm w-full text-gray-500">
                    Meeting with Jack, Kayla, Sumita
                </div>
                <div className="ps-7 flex flex-wrap gap-1 text-sm">
                    <CategoryPill label="Category #1" />
                    <CategoryPill label="Category #2" />
                    <CategoryPill label="Category #3" />
                </div>
            </div>

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
