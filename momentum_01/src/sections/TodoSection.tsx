// ! Know issues:
// ! 1. Can't put description first and todo title later

"use client";

import TodoCard from "@/components/TodoCard";
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

    // ? on Submit function - captures title of task, description, and date-time. Prints on console.
    const addTask = () => {
        console.log("New Task:", addNewTaskInputValue);
        console.log("Description:", description);
        console.log("Date/Time:", dateTime);
        // Reset fields
        setAddNewTaskInputValue("");
        setDescription("");
        setDateTime("");
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

    // Sample tasks list
    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: "Morning Meeting",
            time: "08:00 AM",
            isCompleted: false,
        },
        { id: 2, title: "Design Draft", time: "09:30 AM", isCompleted: true },
        { id: 3, title: "Code Review", time: "10:00 AM", isCompleted: false },
        { id: 4, title: "Client Call", time: "10:30 AM", isCompleted: true },
        {
            id: 5,
            title: "Email Follow-Up",
            time: "11:00 AM",
            isCompleted: false,
        },
        { id: 6, title: "Lunch Break", time: "12:00 PM", isCompleted: false },
        {
            id: 7,
            title: "Project Planning",
            time: "01:00 PM",
            isCompleted: true,
        },
        { id: 8, title: "UI Mockups", time: "01:45 PM", isCompleted: false },
        {
            id: 9,
            title: "Backend Refactor",
            time: "02:30 PM",
            isCompleted: true,
        },
        {
            id: 10,
            title: "Database Update",
            time: "03:00 PM",
            isCompleted: false,
        },
        { id: 11, title: "Team Standup", time: "03:30 PM", isCompleted: true },
        {
            id: 12,
            title: "API Integration",
            time: "04:00 PM",
            isCompleted: false,
        },
        {
            id: 13,
            title: "Write Documentation",
            time: "04:30 PM",
            isCompleted: false,
        },
    ]);

    const toggleComplete = (id: number) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? { ...task, isCompleted: !task.isCompleted }
                    : task
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
                            <span className="material-icons">more_vert</span>
                        )}
                    </button>
                </div>

                {/* Options Dropdown */}
                {optionsDropdown && (
                    <div className="w-full flex flex-col transition-all duration-300 border-b-2">
                        <a
                            onClick={() => alert("option1 clicked")}
                            className="p-2 px-4 hover:bg-gray-100 cursor-pointer hover:ps-6 duration-200"
                        >
                            Option 1
                        </a>
                        <a
                            onClick={() => alert("option2 clicked")}
                            className="p-2 px-4 hover:bg-gray-100 cursor-pointer hover:ps-6 duration-200"
                        >
                            Option 2
                        </a>
                        <a
                            onClick={() =>
                                alert("Show completed tasks clicked")
                            }
                            className="p-2 px-4 hover:bg-gray-100 cursor-pointer hover:ps-6 duration-200"
                        >
                            Show completed tasks
                        </a>
                    </div>
                )}
            </div>

            {/* // ? Sample tasks placeholder */}

            <div className="flex-1 pb-10 ">
                {tasks.map((task) => (
                    <TodoCard
                        key={task.id}
                        title={task.title}
                        time={task.time}
                        isCompleted={task.isCompleted}
                        onToggleComplete={() => toggleComplete(task.id)}
                    />
                ))}
            </div>

            {/* // ? Conditional description and date-time picker: visible when textfield is focused*/}
            {isFocused && (
                <div className="sticky backdrop-blur-md border-t-2 bottom-16 flex flex-col items-start p-2 gap-2 w-full">
                    <TextareaAutosize
                        minRows={1}
                        maxRows={4}
                        maxLength={500}
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Description"
                        className="w-full px-2 py-2 focus:outline-none focus:ring-0 resize-none"
                    />
                    <input
                        type="datetime-local"
                        value={dateTime}
                        onChange={handleDateTimeChange}
                        className="px-2 py-2 focus:outline-none focus:ring-0 "
                    />
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
