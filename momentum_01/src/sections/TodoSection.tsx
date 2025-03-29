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

function TodoSection() {
    const [optionsDropdown, setOptionsDropdown] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setOptionsDropdown((prev) => !prev);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                headerRef.current &&
                !headerRef.current.contains(event.target as Node)
            ) {
                setOptionsDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [headerRef]);

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

    // ? Categories (static)
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categoryInput, setCategoryInput] = useState("");

    // ? Add category on ENTER key
    // Separate function for handling category input on Enter key
    const handleCategoryKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent form submission or line break
            const newCategory = categoryInput.trim();
            if (newCategory && newCategory !== selectedCategory) {
                setSelectedCategory(newCategory);
            }
            setCategoryInput("");
        }
    };

    // // ? Remove category (optional)
    // const removeCategory = (cat: string) => {
    //     setCategories((prev) => prev.filter((c) => c !== cat));
    // };

    // ? on Submit function - captures title of task, description, date-time, category. Prints on console.
    const addTask = () => {
        console.log("New Task:", addNewTaskInputValue);
        console.log("Description:", description);
        console.log("Date/Time:", dateTime);
        console.log("Categories:", selectedCategory);
        // Reset fields
        setAddNewTaskInputValue("");
        setDescription("");
        setDateTime("");
        setSelectedCategory("");
        setCategoryInput("");
        setIsFocused(false);

        // TODO: Implement actual add-task logic
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

    // ? Sample todos from todos.ts
    // Initialize state with your todos array
    const [todos, setTodos] = useState(initialTodos);

    // Toggle the isCompleted state for the selected todo
    const toggleComplete = (id: number) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id
                    ? { ...todo, isCompleted: !todo.isCompleted }
                    : todo
            )
        );
    };

    return (
        <div className="h-full w-full flex flex-col overflow-auto no-scrollbar">
            {/* Top Header bar Fixed */}
            <div ref={headerRef} className="backdrop-blur-md sticky top-0 z-10">
                <div className="w-full flex items-center justify-between ps-4 pe-2 py-4">
                    <div className="text-4xl ">All Tasks</div>
                    <button
                        onClick={toggleDropdown}
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
                            onClick={() => alert("option2 clicked")}
                            className="p-2 px-4 hover:bg-gray-100 cursor-pointer hover:ps-6 duration-200 flex justify-between items-center"
                        >
                            Show descriptions
                            <span className="text-sm font-bold text-green-600">
                                ON
                            </span>
                        </a>
                        <a
                            onClick={() =>
                                alert("Show completed tasks clicked")
                            }
                            className="p-2 px-4 hover:bg-gray-100 cursor-pointer hover:ps-6 duration-200 flex justify-between items-center "
                        >
                            Show completed tasks
                            <span className="text-sm font-bold text-gray-400">
                                OFF
                            </span>
                        </a>

                        <a
                            onClick={() => alert("option1 clicked")}
                            className="p-2 px-4 hover:bg-gray-100 cursor-pointer hover:ps-6 duration-200 flex justify-between items-center"
                        >
                            Show categories
                            <span className="text-sm font-bold text-green-600">
                                ON
                            </span>
                        </a>
                        <a
                            onClick={() =>
                                alert("Show completed tasks clicked")
                            }
                            className="p-2 px-4 hover:bg-gray-100 cursor-pointer hover:ps-6 duration-200 flex justify-between items-center "
                        >
                            Categories
                            <span className="material-icons text-sm text-gray-400">
                                east
                            </span>
                        </a>
                        <a
                            onClick={() =>
                                alert("Show completed tasks clicked")
                            }
                            className="p-2 mt-1 px-4 cursor-pointer hover:ps-6 hover:text-red-900 hover:bg-red-300 duration-200"
                        >
                            Delete all tasks
                        </a>
                    </div>
                )}
            </div>

            {/* // ? Sample tasks placeholder */}

            <div className="flex-1 pb-10 ">
                {todos.length > 0 ? (
                    todos.map((todo) => (
                        <TodoCard
                            key={todo.id}
                            title={todo.title}
                            time={todo.time}
                            description={todo.description}
                            isCompleted={todo.isCompleted}
                            category={todo.category}
                            onToggleComplete={() => toggleComplete(todo.id)}
                        />
                    ))
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
                            className=" py-2 focus:outline-none focus:ring-0 text-sm"
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
                            placeholder={`Add categories`}
                            value={categoryInput}
                            onChange={(e) => setCategoryInput(e.target.value)}
                            onKeyDown={handleCategoryKeyDown}
                            // onSubmit={() => alert("Enter pressed.")}
                        />
                    </div>
                </div>
            )}
            {/* // ? Bottom add new task textfield*/}
            <div className="bg-black flex sticky bottom-0 z-10">
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
        </div>
    );
}

export default TodoSection;
