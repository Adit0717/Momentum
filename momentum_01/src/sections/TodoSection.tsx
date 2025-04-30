// ! Know issues:
// ! 1. Can't put description first and todo title later

// todo: Todo -> context-menu -> view, create a todo pop-up to edit and view it
// * DONE todo: Add category/tags feature for todos
// * DONE todo: TodoSection Menu -> make a window pop-up to view/edit categories

"use client";

import CategoryPill from "@/components/CategoryPill";
import TodoCard from "@/components/TodoCard";
import { todos as initialTodos } from "@/data/todos";
import "material-icons/iconfont/material-icons.css";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import CategoriesDialogBox from "@/sections/CategoriesDialogBox";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { supabase } from "@/lib/supabaseClient";
import { useUserPreferences } from "@/hooks/useUserPreferences";

interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    deadline: string | null;
    category_id: string | null;
    created_at: string;
}

interface Category {
    id: string;
    cat_name: string;
    cat_color?: string;
    created_at?: string;
}

function TodoSection() {
    const { preferences, updatePreference, loading } = useUserPreferences();
    const [optionsDropdown, setOptionsDropdown] = useState(false);

    const [isCategoriesDialogOpen, setIsCategoriesDialogOpen] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    const [showCategoryPopup, setShowCategoryPopup] = useState(false);
    const [allCategories, setAllCategories] = useState<Category[]>([]);

    const [userId, setUserId] = useState<string | null>(null);

    const [todos, setTodos] = useState<Task[]>([]);

    const [parent] = useAutoAnimate();

    // ? Fetching user
    useEffect(() => {
        const fetchUserId = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (data?.user?.id) {
                setUserId(data.user.id);
            }
        };
        fetchUserId();
    }, []);

    // ? Fetching tasks from Supabase
    useEffect(() => {
        if (!userId) return; // only fetch when userId is available

        const fetchTodos = async () => {
            const { data, error } = await supabase
                .from("tasks")
                .select("*")
                .eq("user_id", userId)
                .order("deadline", { ascending: false });

            if (error) {
                console.error("Error fetching tasks:", error.message);
            } else {
                setTodos(data || []);
            }
        };

        fetchTodos();
    }, [userId]);

    const toggleDropdown = () => {
        setOptionsDropdown((prev) => !prev);
    };

    // ? for bottom add new task
    const [addNewTaskInputValue, setAddNewTaskInputValue] = useState("");

    const [description, setDescription] = useState("");
    const [dateTime, setDateTime] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddNewTaskInputValue(e.target.value);
    };
    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setDescription(e.target.value);
    };
    const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateTime(e.target.value);
    };

    // ? Categories (FRONTEND)
    const [selectedCategory, setSelectedCategory] = useState("");

    const [categoryInput, setCategoryInput] = useState("");

    const handleCategoryKeyDown = async (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        // ? Add category on ENTER key --> inserts to backend too
        if (e.key === "Enter") {
            e.preventDefault(); // prevent default form behavior

            const newCategoryName = categoryInput.trim();
            if (!newCategoryName) return;

            const existingCategory = allCategories.find(
                (cat) =>
                    cat.cat_name.toLowerCase() === newCategoryName.toLowerCase()
            );

            if (existingCategory) {
                setSelectedCategory(existingCategory.cat_name);
            } else {
                try {
                    // Get current user
                    const { data: userData, error: userError } =
                        await supabase.auth.getUser();

                    if (userError || !userData?.user) {
                        console.error(
                            "User not authenticated:",
                            userError?.message
                        );
                        return;
                    }

                    const userId = userData.user.id;

                    //
                    const { data: insertedCategory, error: insertError } =
                        await supabase
                            .from("task_categories")
                            .insert([
                                {
                                    cat_name: newCategoryName,
                                    cat_color: "#d1d5db",
                                    user_id: userId,
                                },
                            ])
                            .select()
                            .single();

                    if (insertError) {
                        console.error(
                            "Failed to insert category:",
                            insertError.message
                        );
                        // fallback local
                        const fallbackCat = {
                            id: Date.now().toString(),
                            cat_name: newCategoryName,
                            cat_color: "#d1d5db",
                        };
                        setAllCategories((prev) => [...prev, fallbackCat]);
                        setSelectedCategory(newCategoryName);
                    } else if (insertedCategory) {
                        setAllCategories((prev) => [...prev, insertedCategory]);
                        setSelectedCategory(insertedCategory.cat_name);
                    }
                } catch (err) {
                    console.error("Unexpected error:", err);
                }
            }

            setCategoryInput("");
            setShowCategoryPopup(false);
        }

        if (e.key === "Escape") {
            setShowCategoryPopup(false);
        }
    };

    // ? Fetching actual categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase
                .from("task_categories")
                .select("*")
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Error fetching categories:", error.message);
            } else {
                setAllCategories(data || []);
            }
        };

        fetchCategories();
    }, []);

    // // ? Remove category (optional)
    // const removeCategory = (cat: string) => {
    //     setCategories((prev) => prev.filter((c) => c !== cat));
    // };

    // ? on Submit function - captures title of task, description, date-time, category. Prints on console.
    const addTask = async () => {
        if (!addNewTaskInputValue.trim()) return;
        if (!userId) return;

        const title = addNewTaskInputValue.trim();
        const newTaskId = Date.now().toString(); // temporary ID for optimistic update
        const selectedCategoryId =
            allCategories.find((cat) => cat.cat_name === selectedCategory)
                ?.id || null;

        const newTask: Task = {
            id: newTaskId,
            title: title,
            description: description.trim(),
            completed: false,
            deadline: dateTime || null,
            category_id: selectedCategoryId,
            created_at: new Date().toISOString(),
        };

        // Local optimistic update
        setTodos((prev) => [newTask, ...prev]);

        // Reset input fields
        setAddNewTaskInputValue("");
        setDescription("");
        setDateTime("");
        setSelectedCategory("");
        setCategoryInput("");
        setIsFocused(false);

        // Insert into Supabase
        const { data, error } = await supabase
            .from("tasks")
            .insert([
                {
                    title: title,
                    description: newTask.description,
                    completed: false,
                    deadline: newTask.deadline,
                    category_id: selectedCategoryId,
                    user_id: userId,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Error inserting task:", error.message);

            // Rollback: Remove the optimistic task if backend fails
            setTodos((prev) => prev.filter((task) => task.id !== newTaskId));
        } else if (data) {
            // Update local task with real ID from Supabase
            setTodos((prev) =>
                prev.map((task) =>
                    task.id === newTaskId ? { ...task, id: data.id } : task
                )
            );
        }
    };

    const handleDeleteTask = async (id: string) => {
        if (!id) return;

        const { error } = await supabase.from("tasks").delete().eq("id", id);

        if (error) {
            console.error("Error deleting task:", error.message);
        } else {
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
        }
    };

    // ? Dropdown option - delete all completed tasks
    const handleDeleteAllCompleted = async () => {
        if (!userId) return;
        // Close the dropdown immediately
        setOptionsDropdown(false);

        // Bulk delete on the backend
        const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("user_id", userId)
            .eq("completed", true);

        if (error) {
            console.error("Error deleting completed tasks:", error.message);
        }

        // Remove them from local state as well
        setTodos((prev) => prev.filter((t) => !t.completed));
    };

    // ? update both local + backend
    const handleTaskUpdate = async (
        id: string,
        newTitle: string,
        newDescription: string,
        newDeadline: string | null,
        newCategory: { id: string; name: string } | null
    ) => {
        // update local immediately
        setTodos((prev) =>
            prev.map((t) =>
                t.id === id
                    ? {
                          ...t,
                          title: newTitle,
                          description: newDescription,
                          deadline: newDeadline,
                          category_id: newCategory?.id ?? null,
                      }
                    : t
            )
        );

        // persist to Supabase
        const { error } = await supabase
            .from("tasks")
            .update({
                title: newTitle,
                description: newDescription,
                deadline: newDeadline,
                category_id: newCategory?.id ?? null,
            })
            .eq("id", id);

        if (error) console.error("Error updating task:", error.message);
    };

    // ? controlling visiblity of description and date-time picker
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        // hide datetime and description fields if nothing is typed in add task textfield
        if (!addNewTaskInputValue.trim()) {
            setIsFocused(false);
        }
    };

    // ? Handle CategoriesDialogBox
    const openCategoriesDialog = () => {
        setIsCategoriesDialogOpen(true);
    };

    // ? Sample todos from todos.ts
    // Initialize state with your todos array
    // const [todos, setTodos] = useState(initialTodos);

    //? Toggle the isCompleted state for the selected todo (optimized - local first and supabase later)
    const toggleComplete = async (id: string) => {
        const task = todos.find((todo) => todo.id === id);
        if (!task) return;

        const { error } = await supabase
            .from("tasks")
            .update({ completed: !task.completed })
            .eq("id", id);

        if (error) {
            console.error("Error updating task completion:", error.message);
        } else {
            // If update succeeds, update local state with sorting
            setTodos((prev) => {
                const updated = prev.map((todo) =>
                    todo.id === id
                        ? { ...todo, completed: !todo.completed }
                        : todo
                );

                // Sort: incomplete first, completed last
                updated.sort((a, b) => {
                    if (a.completed === b.completed) {
                        return (
                            new Date(a.created_at).getTime() -
                            new Date(b.created_at).getTime()
                        );
                    }
                    return a.completed ? 1 : -1;
                });

                return updated;
            });
        }
    };

    if (loading) {
        return <div className="p-6">Loading user preferences...</div>;
    }

    return (
        <div className="h-full w-full flex flex-col overflow-auto no-scrollbar">
            {/* Top Header bar Fixed */}
            <div ref={headerRef} className="backdrop-blur-md sticky top-0 z-10">
                <div className="w-full flex items-center justify-between ps-4 pe-2 py-4 ">
                    <div className="text-4xl">All Tasks</div>
                    <button
                        onClick={() => setOptionsDropdown((prev) => !prev)}
                        className="h-12 w-12 rounded-full flex justify-center items-center hover:bg-gray-100"
                    >
                        {optionsDropdown ? (
                            <span className="material-icons">close</span>
                        ) : (
                            <span className="material-icons-outlined">
                                menu
                            </span>
                        )}
                    </button>
                </div>

                {/* Options Dropdown */}
                {optionsDropdown && (
                    <div className="w-full flex flex-col transition-all duration-300 border-b-2">
                        <a
                            onClick={() =>
                                updatePreference(
                                    "show_completed_tasks",
                                    !preferences.show_completed_tasks
                                )
                            }
                            className="p-2 px-4 hover:bg-gray-100 cursor-pointer hover:ps-6 duration-200 flex justify-between items-center"
                        >
                            Show completed tasks
                            <span
                                className={`text-sm font-bold ${
                                    preferences.show_completed_tasks
                                        ? "text-green-600"
                                        : "text-red-400"
                                }`}
                            >
                                {preferences.show_completed_tasks
                                    ? "ON"
                                    : "OFF"}
                            </span>
                        </a>
                        <a
                            onClick={() =>
                                updatePreference(
                                    "show_descriptions",
                                    !preferences.show_descriptions
                                )
                            }
                            className="p-2 px-4 hover:bg-gray-100 cursor-pointer hover:ps-6 duration-200 flex justify-between items-center"
                        >
                            Show descriptions
                            <span
                                className={`text-sm font-bold ${
                                    preferences.show_descriptions
                                        ? "text-green-600"
                                        : "text-red-400"
                                }`}
                            >
                                {preferences.show_descriptions ? "ON" : "OFF"}
                            </span>
                        </a>

                        <a
                            onClick={() =>
                                updatePreference(
                                    "show_categories",
                                    !preferences.show_categories
                                )
                            }
                            className="p-2 px-4 hover:bg-gray-100 cursor-pointer hover:ps-6 duration-200 flex justify-between items-center"
                        >
                            Show categories
                            <span
                                className={`text-sm font-bold ${
                                    preferences.show_categories
                                        ? "text-green-600"
                                        : "text-red-400"
                                }`}
                            >
                                {preferences.show_categories ? "ON" : "OFF"}
                            </span>
                        </a>

                        <a
                            onClick={openCategoriesDialog}
                            className="p-2 px-4 hover:bg-gray-100 cursor-pointer hover:ps-6 duration-200 flex justify-between items-center "
                        >
                            Manage Categories
                            <span className="material-icons text-sm text-gray-400">
                                east
                            </span>
                        </a>

                        <a
                            onClick={handleDeleteAllCompleted}
                            className="p-2 mt-1 px-4 cursor-pointer hover:ps-6 hover:text-red-900 hover:bg-red-300 duration-200"
                        >
                            Delete all completed tasks
                        </a>
                    </div>
                )}
            </div>

            {/* // ? Sample tasks placeholder */}
            <div ref={parent} className="flex-1 pb-10">
                {todos.length > 0 ? (
                    todos
                        .filter(
                            (t) =>
                                preferences.show_completed_tasks || !t.completed
                        )
                        .map((t) => {
                            // find matching category object or null
                            const catObj =
                                allCategories.find(
                                    (c) => c.id === t.category_id
                                ) || null;
                            return (
                                <TodoCard
                                    key={t.id}
                                    taskId={t.id}
                                    title={t.title}
                                    description={t.description}
                                    time={t.deadline || undefined}
                                    category={
                                        catObj
                                            ? {
                                                  id: catObj.id,
                                                  name: catObj.cat_name,
                                              }
                                            : null
                                    }
                                    isCompleted={t.completed}
                                    onToggleComplete={() =>
                                        toggleComplete(t.id)
                                    }
                                    onDelete={() => handleDeleteTask(t.id)}
                                    onTaskUpdate={handleTaskUpdate}
                                    showDescription={
                                        preferences.show_descriptions
                                    }
                                    showCategories={preferences.show_categories}
                                />
                            );
                        })
                ) : (
                    <div className="p-4 text-gray-500">No tasks yet</div>
                )}
            </div>

            {/* // ? Conditional description and date-time picker: visible when textfield is focused */}
            {isFocused && (
                <div
                    className="sticky backdrop-blur-md border-t-2 bottom-16 flex flex-col items-start p-2 gap-2 w-full"
                    style={{ backgroundColor: "#ffffff20" }}
                >
                    <TextareaAutosize
                        minRows={1}
                        maxRows={4}
                        maxLength={500}
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Description"
                        className="w-full px-2 py-2 focus:outline-none focus:ring-0 resize-none "
                    />
                    <div className="px-2 flex items-center gap-2">
                        <div className="text-sm text-gray-700">Due on</div>

                        <input
                            type="datetime-local"
                            value={dateTime}
                            onChange={handleDateTimeChange}
                            className="p-2 focus:outline-none focus:ring-0 "
                        />
                    </div>

                    {/* // ? Categories */}
                    {/* Display existing category pills */}
                    {selectedCategory && (
                        <div className="px-2 flex gap-1 flex-wrap">
                            <CategoryPill
                                label={selectedCategory}
                                deletable={true}
                                onClick={() => setSelectedCategory("")}
                            />
                        </div>
                    )}
                    <div className="flex px-2 gap-2 items-center">
                        <span
                            className="material-icons text-gray-500"
                            style={{ fontSize: "20px" }}
                        >
                            search
                        </span>
                        <input
                            className="px-2 py-2 w-full focus:outline-none text-sm"
                            placeholder={`Add a category`}
                            value={categoryInput}
                            onChange={(e) => setCategoryInput(e.target.value)}
                            onKeyDown={handleCategoryKeyDown}
                            onFocus={() => setShowCategoryPopup(true)}
                        />

                        {showCategoryPopup && (
                            <div className="flex flex-col gap-2 absolute w-[350px] bg-white border border-gray-200 p-4 rounded-2xl shadow-md z-50 bottom-0 mb-14">
                                {/* Filtered matching categories */}
                                {allCategories.filter((cat) =>
                                    cat.cat_name
                                        .toLowerCase()
                                        .includes(categoryInput.toLowerCase())
                                ).length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {allCategories
                                            .filter((cat) =>
                                                cat.cat_name
                                                    .toLowerCase()
                                                    .includes(
                                                        categoryInput.toLowerCase()
                                                    )
                                            )
                                            .map((cat) => (
                                                <CategoryPill
                                                    key={cat.id}
                                                    label={cat.cat_name}
                                                    // color={cat.cat_color}
                                                    onClick={() => {
                                                        setSelectedCategory(
                                                            cat.cat_name
                                                        );
                                                        setCategoryInput("");
                                                        setShowCategoryPopup(
                                                            false
                                                        );
                                                    }}
                                                    deletable={false}
                                                />
                                            ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-400 text-sm text-center">
                                        No matching categories.
                                    </div>
                                )}

                                {/* Create new category */}
                                {categoryInput.trim() &&
                                    !allCategories.some(
                                        (cat) =>
                                            cat.cat_name.toLowerCase() ===
                                            categoryInput.trim().toLowerCase()
                                    ) && (
                                        <button
                                            onClick={async () => {
                                                await handleCategoryKeyDown({
                                                    key: "Enter",
                                                    preventDefault: () => {},
                                                } as any);
                                            }}
                                            className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline mt-2"
                                        >
                                            Create new category: &quot;
                                            {categoryInput.trim()}&quot;
                                        </button>
                                    )}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* // ? Bottom add new task textfield*/}

            <div className="bg-black flex sticky bottom-0 z-10 ">
                <input
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={addNewTaskInputValue}
                    placeholder="Add new"
                    className="h-16 text-white flex-1 text-wrap px-4 text-lg focus:outline-none focus:ring-0"
                />

                {/* // ** DONE todo: Add time, description, category to new task */}
                <button
                    onClick={addTask}
                    disabled={addNewTaskInputValue.trim().length === 0}
                    className={`w-16 h-16 cursor-pointer hover:bg-blue-500 duration-100 flex items-center justify-center 
                    ${
                        addNewTaskInputValue.trim().length === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                >
                    <span className="material-icons text-white">add</span>
                </button>
            </div>
            <CategoriesDialogBox
                isOpen={isCategoriesDialogOpen}
                onClose={() => setIsCategoriesDialogOpen(false)}
            />
        </div>
    );
}

export default TodoSection;
