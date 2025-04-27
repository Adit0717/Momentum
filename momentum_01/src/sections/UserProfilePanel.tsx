// User profile panel slides in from the right
"use client";

import React, { useEffect, useRef, useState } from "react";
import "material-icons/iconfont/material-icons.css";
import TempUserAvatar from "../../public/temp-user-avatar.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import useUserProfile from "@/hooks/useUserProfiles";

interface UserProfilePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserProfilePanel({
    isOpen,
    onClose,
}: UserProfilePanelProps) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loggingOut, setLoggingOut] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const { profile, loading, error } = useUserProfile();

    // ? Fetch & guard current user whenever the panel opens
    useEffect(() => {
        if (!isOpen) return;

        supabase.auth.getUser().then(({ data, error }) => {
            if (error || !data.user) {
                // Not signed in, or error fetching user → send them back to /auth
                router.replace("/auth");
            } else {
                setUser(data.user);
            }
        });
    }, [isOpen, router]);

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

    // ? Handling Logout
    const handleLogout = async () => {
        setLoggingOut(true);

        setTimeout(async () => {
            const { error } = await supabase.auth.signOut();
            if (!error) {
                onClose();
                router.replace("/auth");
            } else {
                console.error("Logout failed:", error.message);
                setLoggingOut(false);
            }
        }, 800);
    };

    const [updatePasswordView, setUpdatePasswordView] = useState(false);

    const toggleUpdatePasswordView = () => {
        setUpdatePasswordView((prev) => !prev);
    };

    if (!isOpen || !user) return null;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0  bg-opacity-30 z-40"
                    style={{ backgroundColor: "#00000040" }}
                ></div>
            )}
            <div
                ref={panelRef}
                className={`fixed top-0 right-0 me-0 mt-5 bg-white shadow-xl z-50 rounded-t-[25]
            transform transition-transform duration-300 ease-in-out h-fit
            ${isOpen ? "translate-x-0 me-5" : "translate-x-full"}`}
                style={{ minWidth: "400px", maxWidth: "400px" }}
            >
                {/* // ? Main menu */}
                <div>
                    <div className="flex items-center justify-between w-full">
                        {updatePasswordView ? (
                            <div className="text-sm ps-0 pe-3 h-[50] flex w-fit items-center rounded-full cursor-pointer">
                                <button
                                    onClick={toggleUpdatePasswordView}
                                    className="text-black flex items-center justify-center h-[50] w-[50] hover:bg-gray-200 focus:outline-none  rounded-full duration-150"
                                >
                                    <span className="material-icons">
                                        chevron_left
                                    </span>
                                </button>
                                CHANGE PASSWORD
                            </div>
                        ) : (
                            <div className="text-sm ps-4 pe-3 h-[50] flex w-fit items-center ">
                                USER PROFILE
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            className="text-black flex items-center justify-center h-[50] w-[50] hover:bg-black focus:outline-none hover:text-white rounded-full duration-150"
                        >
                            <span className="material-icons">close</span>
                        </button>
                    </div>

                    {updatePasswordView ? (
                        <>
                            {/* //? Update Password View */}
                            <div className="flex flex-col items-start px-5 py-2 w-full   mt-4 ">
                                <div className="text-sm text-gray-500">
                                    Current password
                                </div>
                                <input
                                    className="mb-3 border-b border-b-gray-500 flex-1 px-4 w-full focus:outline-none focus:ring-0 focus:border-b-blue-400"
                                    type="text"
                                />
                            </div>
                            <div className="flex flex-col items-start px-5 py-2 w-full   ">
                                <div className="text-sm text-gray-500">
                                    New password
                                </div>
                                <input
                                    className="mb-3 border-b border-b-gray-500 flex-1 px-4 w-full focus:outline-none focus:ring-0 focus:border-b-blue-400"
                                    type="text"
                                />
                            </div>
                            <div className="flex flex-col items-start px-5 py-2 w-full   ">
                                <div className="text-sm text-gray-500">
                                    Repeat again
                                </div>
                                <input
                                    className="mb-3 border-b border-b-gray-500 flex-1 px-4 w-full focus:outline-none focus:ring-0 focus:border-b-blue-400"
                                    type="text"
                                />
                            </div>
                            <button className="p-5 text-sm flex gap-2 items-center text-blue-500 cursor-pointer">
                                Show password
                                <span
                                    className="material-icons"
                                    style={{ fontSize: "20px" }}
                                >
                                    visibility
                                </span>
                            </button>
                            <div className="flex gap-2 p-3 justify-end">
                                <button
                                    // onClick={handleClose}
                                    className="px-4 py-2 bg-gray-300 text-black rounded-none hover:bg-gray-400 transition "
                                >
                                    Cancel
                                </button>
                                <button
                                    // onClick={handleSave}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-none hover:bg-blue-600 transition duration-150 ease-in"
                                    style={{ transitionDuration: "100ms" }}
                                >
                                    Update
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* //? User Profile Main View */}
                            <div className="p-4 flex items-center gap-2.5 hover:bg-gray-200 cursor-pointer w-full">
                                {/* Profile content here, e.g. avatar, name, email, etc. */}
                                <Image
                                    src={profile?.avatar_url ?? TempUserAvatar}
                                    alt="user avatar"
                                    width={70}
                                    height={70}
                                    className="rounded-full border border-black hover:bg-amber-300"
                                />
                                <div className="text-2xl font-medium">
                                    {/* //? fetch full_name */}
                                    {/* <ProfileField
                                        field="full_name"
                                        placeholder="— no name —"
                                    /> */}
                                    {profile?.full_name}
                                </div>
                            </div>
                            <div
                                onClick={() => alert("Logout clicked!")}
                                className="flex items-center px-4 py-2 w-full cursor-pointer  hover:bg-gray-200 hover:ps-6 duration-200 "
                            >
                                <div className="text-sm text-gray-500 w-1/4">
                                    Email
                                </div>
                                <div className="flex-1 ">{user.email}</div>
                            </div>
                            <div
                                onClick={toggleUpdatePasswordView}
                                className="flex items-center px-4 py-2 w-full cursor-pointer  hover:bg-gray-200 hover:ps-6 duration-200 "
                            >
                                <div className="text-sm text-gray-500 w-1/4">
                                    Password
                                </div>
                                <div className="flex-1 ">••••••••</div>
                            </div>

                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="flex item-center justify-between p-4 w-full bg-red-100 cursor-pointer hover:text-red-900 hover:bg-red-300 hover:ps-6 duration-200 "
                            >
                                {loggingOut ? (
                                    <>
                                        <span className="material-icons animate-spin text-lg">
                                            loop
                                        </span>
                                        <span>Logging you out…</span>
                                    </>
                                ) : (
                                    "Log out"
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
