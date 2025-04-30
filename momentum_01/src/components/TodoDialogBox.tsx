"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CategoryPill from "./CategoryPill";
import TextareaAutosize from "react-textarea-autosize";
import "material-icons/iconfont/material-icons.css";
import { supabase } from "@/lib/supabaseClient";

interface Category {
    id: string;
    cat_name: string;
}

interface TodoDialogBoxProps {
    taskId: string;
    title: string;
    time?: string;
    description?: string;
    category?: { id: string; name: string } | null;
    onClose: () => void;
    onDelete?: (taskId: string) => void;
    onUpdate?: (
        taskId: string,
        newTitle: string,
        newDescription: string,
        newDeadline: string | null,
        newCategory: { id: string; name: string } | null
    ) => Promise<void>;
}

export default function TodoDialogBox({
    taskId,
    title,
    description,
    time,
    category,
    onClose,
    onDelete,
    onUpdate,
}: TodoDialogBoxProps) {
    // local editable state
    const [localTitle, setLocalTitle] = useState(title);
    const [localDescription, setLocalDescription] = useState(description ?? "");
    const [localTime, setLocalTime] = useState(time ?? "");
    const [editingTime, setEditingTime] = useState(false);

    // category UI state
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [categoryInput, setCategoryInput] = useState("");
    const [localCategory, setLocalCategory] = useState<{
        id: string;
        name: string;
    } | null>(category ?? null);

    // portal & animation
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // fetch category list
    useEffect(() => {
        (async () => {
            const { data: user, error: authErr } =
                await supabase.auth.getUser();
            if (authErr || !user.user) return;
            const userId = user.user.id;
            const { data, error } = await supabase
                .from("task_categories")
                .select("id, cat_name")
                .eq("user_id", userId)
                .order("created_at", { ascending: true });
            if (data && !error) setAllCategories(data);
        })();
    }, []);

    // portal root
    const modalRoot =
        document.getElementById("modal-root") ||
        (() => {
            const div = document.createElement("div");
            div.id = "modal-root";
            document.body.appendChild(div);
            return div;
        })();

    // click‐outside to close
    const dialogRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (
                dialogRef.current &&
                !dialogRef.current.contains(e.target as Node)
            ) {
                _close();
            }
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    function _close() {
        setIsVisible(false);
        setTimeout(onClose, 200);
    }

    function formatDateTime(iso: string) {
        const d = new Date(iso);
        return d.toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    }

    // save handler
    const save = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const newDeadline = localTime
            ? new Date(localTime).toISOString()
            : null;
        // update DB
        const updates: any = {
            title: localTitle,
            description: localDescription,
            deadline: newDeadline,
            category_id: localCategory?.id ?? null,
        };
        const { error } = await supabase
            .from("tasks")
            .update(updates)
            .eq("id", taskId);
        if (error) {
            console.error("Error updating task:", error.message);
        } else if (onUpdate) {
            // inform parent of the fresh values
            await onUpdate(
                taskId,
                localTitle,
                localDescription,
                newDeadline,
                localCategory
            );
        }
        _close();
    };

    // create new category on‐the‐fly
    const createCategory = async () => {
        const name = categoryInput.trim();
        if (!name) return;
        const { data: user, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user.user) return;
        const { data, error } = await supabase
            .from("task_categories")
            .insert({ cat_name: name, user_id: user.user.id })
            .select("id, cat_name")
            .single();
        if (data && !error) {
            setAllCategories((p) => [...p, data]);
            setLocalCategory({ id: data.id, name: data.cat_name });
            setDropdownOpen(false);
            setCategoryInput("");
        }
    };

    return createPortal(
        <div
            className={`fixed inset-0 flex items-start justify-center pt-44 z-50 backdrop-blur-md transition-opacity duration-200 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
            <div
                ref={dialogRef}
                className={`bg-white transform transition-transform duration-200 ease-in-out ${
                    isVisible ? "scale-100" : "scale-105"
                }`}
                style={{ width: 550 }}
            >
                <div className="p-6 flex flex-col gap-4">
                    {/* Title */}
                    <input
                        type="text"
                        value={localTitle}
                        onChange={(e) => setLocalTitle(e.target.value)}
                        className="w-full text-2xl font-bold border-b pb-2 focus:outline-none focus:border-gray-600"
                    />

                    {/* Deadline & Category */}
                    <div className="flex items-center gap-4">
                        {editingTime ? (
                            <input
                                type="datetime-local"
                                value={localTime.slice(0, 16)}
                                onChange={(e) => setLocalTime(e.target.value)}
                                onBlur={() => setEditingTime(false)}
                                className="px-2 py-1 focus:outline-none bg-gray-200 rounded-full pe-1"
                            />
                        ) : (
                            <div
                                onClick={() => setEditingTime(true)}
                                className={`cursor-pointer ${
                                    localTime &&
                                    new Date(localTime) > new Date()
                                        ? "text-blue-600"
                                        : "text-red-500"
                                } hover:bg-gray-300 px-3 py-1 rounded-full`}
                            >
                                {localTime
                                    ? `${formatDateTime(localTime)}`
                                    : "No deadline set"}
                            </div>
                        )}

                        {/* Category dropdown */}
                        <div className="relative">
                            {dropdownOpen ? (
                                <div className="absolute bg-white border border-gray-300 rounded-xl shadow p-3 w-80 max-h-40 overflow-auto z-10">
                                    <input
                                        placeholder="Search a category"
                                        value={categoryInput}
                                        onChange={(e) =>
                                            setCategoryInput(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Escape") {
                                                setDropdownOpen(false);
                                                setCategoryInput("");
                                            }
                                        }}
                                        className="w-full px-2 py-1 border-b focus:outline-none mb-1 sticky"
                                    />
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {allCategories
                                            .filter((c) =>
                                                c.cat_name
                                                    .toLowerCase()
                                                    .includes(
                                                        categoryInput.toLowerCase()
                                                    )
                                            )
                                            .map((c) => (
                                                <CategoryPill
                                                    key={c.id}
                                                    label={c.cat_name}
                                                    onClick={() => {
                                                        setLocalCategory({
                                                            id: c.id,
                                                            name: c.cat_name,
                                                        });
                                                        setDropdownOpen(false);
                                                        setCategoryInput("");
                                                    }}
                                                />
                                            ))}
                                        {categoryInput.trim() &&
                                            !allCategories.some(
                                                (c) =>
                                                    c.cat_name.toLowerCase() ===
                                                    categoryInput.toLowerCase()
                                            ) && (
                                                <div
                                                    className="px-2 py-1 text-blue-600 hover:bg-gray-100 cursor-pointer"
                                                    onClick={createCategory}
                                                >
                                                    Create “
                                                    {categoryInput.trim()}”
                                                </div>
                                            )}
                                    </div>
                                </div>
                            ) : localCategory ? (
                                <CategoryPill
                                    label={localCategory.name}
                                    deletable
                                    onClick={() => {
                                        // remove existing
                                        setLocalCategory(null);
                                        // reopen selector
                                        // setDropdownOpen(false);
                                    }}
                                />
                            ) : (
                                <CategoryPill
                                    label="+ Add Category"
                                    deletable={false}
                                    onClick={() => setDropdownOpen(true)}
                                />
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <TextareaAutosize
                        minRows={6}
                        maxRows={20}
                        placeholder="Description"
                        value={localDescription}
                        onChange={(e) => setLocalDescription(e.target.value)}
                        className="w-full border-t pt-2 focus:outline-none"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center border-t p-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(taskId);
                            _close();
                        }}
                        className="flex items-center gap-1 px-3 py-2 bg-red-300 text-red-900 hover:bg-red-400 transition"
                    >
                        <span className="material-icons-outlined">delete</span>
                        Delete
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={_close}
                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={save}
                            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        modalRoot
    );
}
