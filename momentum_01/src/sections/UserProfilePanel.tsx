// User profile panel slides in from the right
"use client";

import React, { useEffect, useRef } from "react";
import "material-icons/iconfont/material-icons.css";
import TempUserAvatar from "../../public/temp-user-avatar.png";
import Image from "next/image";

interface UserProfilePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserProfilePanel({
    isOpen,
    onClose,
}: UserProfilePanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                isOpen &&
                panelRef.current &&
                !panelRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-opacity-30 z-40"
                    style={{ backgroundColor: "#00000040" }}
                ></div>
            )}
            <div
                ref={panelRef}
                className={`fixed top-0 right-0 me-0 mt-5 bg-white shadow-xl z-50 rounded-tr-[25]
            transform transition-transform duration-300 ease-in-out h-fit
            ${isOpen ? "translate-x-0 me-5" : "translate-x-full"}`}
                style={{ minWidth: "400px", maxWidth: "400px" }}
            >
                <div className="flex items-center justify-between w-full">
                    <div className="text-sm p-4">USER PROFILE</div>

                    <button
                        onClick={onClose}
                        className="text-black flex items-center justify-center h-[50] w-[50] hover:bg-black focus:outline-none hover:text-white rounded-full duration-150"
                    >
                        <span className="material-icons">close</span>
                    </button>
                </div>
                <div className="p-4 flex items-center gap-2.5 hover:bg-gray-200 cursor-pointer w-full">
                    {/* Profile content here, e.g. avatar, name, email, etc. */}
                    <Image
                        src={TempUserAvatar}
                        alt="user avatar"
                        width={70}
                        height={70}
                        className="rounded-full border border-black hover:bg-amber-300"
                    />
                    <div className="text-2xl font-medium">Joseph Fernandez</div>
                </div>
                <div
                    onClick={() => alert("Logout clicked!")}
                    className="flex items-center px-4 py-2 w-full cursor-pointer  hover:bg-gray-200 hover:ps-6 duration-200 "
                >
                    <div className="text-sm text-gray-500 w-1/4">Email</div>
                    <div className="flex-1">fernandezjo1@gmail.com</div>
                </div>
                <div
                    onClick={() => alert("Logout clicked!")}
                    className="flex items-center px-4 py-2 w-full cursor-pointer  hover:bg-gray-200 hover:ps-6 duration-200 "
                >
                    <div className="text-sm text-gray-500 w-1/4">Password</div>
                    <div className="flex-1">••••••••</div>
                </div>

                <div
                    onClick={() => alert("Logout clicked!")}
                    className="flex item-center justify-between p-4 w-full bg-red-100 cursor-pointer hover:text-red-900 hover:bg-red-300 hover:ps-6 duration-200"
                >
                    Logout
                    <span className="material-icons">logout</span>
                </div>
            </div>
        </>
    );
}
