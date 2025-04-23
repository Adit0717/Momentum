"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CategoryPill from "./CategoryPill";
import TextareaAutosize from "react-textarea-autosize";
import "material-icons/iconfont/material-icons.css";

interface TodoDialogBoxProps {
    title: string;
    time?: string;
    description?: string;
    category?: string;
    onClose: () => void;
}

export default function TodoDialogBox({
    title,
    description,
    time,
    category,
    onClose,
}: TodoDialogBoxProps) {
    // ? Local states for editable fields
    const [localTitle, setLocalTitle] = useState(title);
    const [localDescription, setLocalDescription] = useState(description ?? "");

    const [isVisible, setIsVisible] = useState(false);

    // ? modalRoot
    const modalRoot =
        document.getElementById("modal-root") ||
        (() => {
            const div = document.createElement("div");
            div.setAttribute("id", "modal-root");
            document.body.appendChild(div);
            return div;
        })();

    // trigger transition on mount
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // function to handle closing with transition
    const handleClose = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 200);
    };

    // ? close window on clicking outside of it
    const dialogRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dialogRef.current &&
                !dialogRef.current.contains(e.target as Node)
            ) {
                handleClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    // ? Handle save
    const handleSave = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        console.log("Saved Task:", {
            title: localTitle,
            description: localDescription,
            time,
            category, // todo: This category gives out undefined type. Maybe do "No Category".
        });
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 200); // Match the transition duration
    };

    return createPortal(
        <div
            className={`fixed inset-0 flex backdrop-blur-md items-start pt-44 justify-center z-50 transition duration-200 ease-in-out ${
                isVisible ? "opacity-100 pt-40" : "opacity-0"
            }`}
            style={{ backgroundColor: "#00000040" }}
        >
            <div
                ref={dialogRef}
                className={`bg-white  transform transition-transform duration-200 ease-in-out ${
                    isVisible ? "scale-100" : "scale-105"
                }`}
                style={{ width: "550px" }}
            >
                <div className="flex flex-col p-6">
                    <input
                        type="text"
                        className="text-2xl font-bold mb-3  border-white border-b pb-2 w-full focus:border-b focus:border-b-gray-600 focus:outline-none"
                        value={localTitle}
                        onChange={(e) => setLocalTitle(e.target.value)}
                    />

                    <div className="flex items-center gap-3 mb-4">
                        <div className="text-gray-600">Time: {time}</div>
                        {category ? (
                            <CategoryPill label={category} deletable={true} />
                        ) : (
                            // Todo: Add category function
                            <CategoryPill
                                label="+ Add Category"
                                color="bg-black"
                                textColor="text-white"
                                deletable={false}
                                onClick={() => {
                                    alert("add category clicked!");
                                }}
                            />
                        )}
                    </div>
                    <TextareaAutosize
                        className="text-gray-700 w-full border-white border-t pt-2 focus:border-t focus:border-black fo focus:outline-none"
                        minRows={10}
                        maxRows={26}
                        placeholder="Description"
                        value={localDescription}
                        onChange={(e) => setLocalDescription(e.target.value)}
                    />
                </div>
                <div className="flex justify-between p-3 border-t-1 border-t-gray-400">
                    <button
                        onClick={() => {
                            console.log(`Delete: ${title}`);

                            handleClose();
                        }}
                        className="ps-2 pe-3 py-2 bg-red-300 text-red-900 rounded-none hover:bg-red-400 transition duration-150 ease-in flex items-center gap-1"
                        style={{ transitionDuration: "100ms" }}
                    >
                        <span className="material-icons-outlined">delete</span>
                        Delete
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 bg-gray-300 text-black rounded-none hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded-none hover:bg-blue-600 transition duration-150 ease-in"
                            style={{ transitionDuration: "100ms" }}
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
