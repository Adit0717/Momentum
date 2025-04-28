"use client";

import React, { useRef, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { HexColorPicker } from "react-colorful";

interface CategoriesDialogBoxProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Category {
    id: string;
    cat_name: string;
    cat_color?: string;
    created_at?: string;
}

export default function CategoriesDialogBox({
    isOpen,
    onClose,
}: CategoriesDialogBoxProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [newCategory, setNewCategory] = useState<string>("");
    const [newCategoryColor, setNewCategoryColor] = useState<string>("#d1d5dc");

    const [pickerVisible, setPickerVisible] = useState(false);

    // Fetch categories
    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("task_categories")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching categories:", error.message);
        } else {
            setCategories(data || []);
        }
        setLoading(false);
    };

    // ? Add new category
    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;

        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;

        if (!userId) {
            console.error("User not logged in.");
            return;
        }

        const { error } = await supabase.from("task_categories").insert([
            {
                cat_name: newCategory.trim(),
                user_id: userId,
                cat_color: newCategoryColor,
            },
        ]);

        if (error) {
            console.error("Error adding category:", error.message);
        } else {
            setNewCategory("");
            setNewCategoryColor("#d1d5dc");
            setPickerVisible(false);
            fetchCategories();
        }
    };

    // ? Delete category
    const handleDeleteCategory = async (categoryId: string) => {
        if (!categoryId) return;

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );
        if (!confirmDelete) return;

        const { error } = await supabase
            .from("task_categories")
            .delete()
            .eq("id", categoryId);

        if (error) {
            console.error("Failed to delete category:", error.message);
        } else {
            // Optimistically remove from UI
            setCategories((prev) =>
                prev.filter((category) => category.id !== categoryId)
            );
        }
    };

    // ? Fetching categories from Supabase
    useEffect(() => {
        if (!isOpen) return;

        const fetchCategories = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from("task_categories")
                .select("*")
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Error fetching categories:", error.message);
            } else {
                setCategories(data || []);
            }

            setLoading(false);
        };

        fetchCategories();
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-opacity-30 z-40"
                style={{ backgroundColor: "#00000040" }}
            ></div>

            {/* Sliding panel */}
            <div
                ref={panelRef}
                className={`fixed top-0 left-[400px] ms-5 mt-5 bg-white shadow-xl z-50 rounded-t-[25]
                transform transition-transform duration-300 ease-in-out h-fit
                ${isOpen ? "translate-x-0 me-5" : "translate-x-full"}`}
                style={{ minWidth: "400px", maxWidth: "400px" }}
            >
                {/* Panel Content */}
                <div className="flex items-center justify-between w-full">
                    <div className="text-sm ps-4 pe-3 h-[50] flex w-fit items-center ">
                        MANGE CATEGORIES
                    </div>

                    <button
                        onClick={onClose}
                        className="text-black flex items-center justify-center h-[50] w-[50] hover:bg-black focus:outline-none hover:text-white rounded-full duration-150"
                    >
                        <span className="material-icons">close</span>
                    </button>
                </div>

                <div className="flex  items-center justify-between bg-gray-300">
                    <div className="relative ms-4">
                        <div
                            onClick={() => setPickerVisible(!pickerVisible)}
                            className="w-6 h-6 rounded-full border-2 cursor-pointer"
                            style={{ backgroundColor: newCategoryColor }}
                        />

                        {pickerVisible && (
                            <div className="absolute z-10 mt-2">
                                <HexColorPicker
                                    color={newCategoryColor}
                                    onChange={setNewCategoryColor}
                                />
                            </div>
                        )}
                    </div>
                    <input
                        className="ps-3 p-4  w-full focus:outline-none"
                        placeholder={`Add new`}
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    {/* Color Circle */}
                    <button
                        onClick={handleAddCategory}
                        disabled={!newCategory.trim()}
                        className="bg-black text-white flex px-2 me-2 py-2 rounded-full hover:bg-blue-600 text-sm disabled:opacity-50"
                    >
                        <span
                            className="material-icons"
                            style={{ fontSize: "20px" }}
                        >
                            add
                        </span>
                    </button>
                </div>

                <div className="flex flex-col">
                    {/* //? Get existing categories from supabase for this user */}
                    {loading ? (
                        <div className="p-4 text-center text-gray-400 text-sm">
                            Loading...
                        </div>
                    ) : categories.length > 0 ? (
                        categories.map((cat) => (
                            <div
                                key={cat.id}
                                className="flex justify-between items-center p-4 pe-2.5 hover:bg-gray-100"
                            >
                                <div className="flex item-center gap-2 ">
                                    {cat.cat_color ? (
                                        <div
                                            className="w-6 h-6 rounded-full"
                                            style={{
                                                backgroundColor: cat.cat_color,
                                            }}
                                        ></div>
                                    ) : (
                                        <div
                                            className="w-6 h-6 rounded-full border-gray-300 border-5"
                                            style={{
                                                backgroundColor: cat.cat_color,
                                            }}
                                        ></div>
                                    )}
                                    <span className="text-gray-800">
                                        {cat.cat_name}
                                    </span>
                                </div>
                                <button
                                    className="hover:bg-red-200 hover:text-red-500 text-gray-400 flex h-8 w-8 rounded-full items-center justify-center"
                                    onClick={() => handleDeleteCategory(cat.id)}
                                >
                                    <span
                                        className="material-icons-outlined "
                                        style={{ fontSize: "20px" }}
                                    >
                                        delete
                                    </span>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-400 text-sm">
                            No categories found.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
