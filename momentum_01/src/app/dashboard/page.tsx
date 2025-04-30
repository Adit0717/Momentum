"use client";
import TempUserAvatar from "../../../public/temp-user-avatar.png";
import IconButton from "@/components/IconButton";
import { useState } from "react";
import Image from "next/image";
import TodoSection from "@/sections/TodoSection";
import UserProfilePanel from "@/sections/UserProfilePanel";
import useUserProfile from "@/hooks/useUserProfiles";
import FocusView from "@/sections/FocusView";
import UserStatsX from "@/sections/UserStatsX";

export default function DashBoard() {
    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
    const { profile } = useUserProfile();
    const [isFocusMode, setIsFocusMode] = useState(false);

    return (
        <div className="h-screen w-screen flex gap-4 p-5">
            {/* top-right avatar + focus toggle */}
            <div
                className="absolute top-0 right-0 m-5 flex flex-col gap-2 bg-white pt-3 pb-3 ps-3 border-gray-300 border-b-1 border-s-1 z-50 cursor-pointer"
                style={{ borderEndStartRadius: "36px" }}
            >
                <Image
                    src={profile?.avatar_url ?? TempUserAvatar}
                    alt="user avatar"
                    width={50}
                    height={50}
                    className="rounded-full"
                    onClick={() => setIsUserProfileOpen(true)}
                />
                <UserProfilePanel
                    isOpen={isUserProfileOpen}
                    onClose={() => setIsUserProfileOpen(false)}
                />
                <button
                    onClick={() => setIsFocusMode((m) => !m)}
                    style={{ width: 50, height: 50 }}
                    className={`
            rounded-full flex border-2 border-black justify-center items-center 
            duration-200 ${isFocusMode ? "bg-black text-white" : "bg-white"}`}
                >
                    <span className="material-icons" style={{ fontSize: 30 }}>
                        adjust
                    </span>
                </button>
            </div>

            {/* left column: only in non-focus */}
            {!isFocusMode && (
                <div
                    className="border border-gray-300 h-full overflow-hidden transition-opacity duration-500"
                    style={{ minWidth: 400, maxWidth: 400 }}
                >
                    <TodoSection />
                </div>
            )}

            {/* right / main column */}
            <div className="border border-gray-300 h-full flex-1 relative overflow-hidden">
                {/* Normal content placeholder */}
                <div
                    className={`
            absolute inset-0 transition-opacity duration-500
            ${isFocusMode ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}
                >
                    <div className=" h-full w-full">
                        <UserStatsX />
                    </div>
                </div>

                {/* Focus View */}
                <div
                    className={`
            absolute inset-0 transition-opacity duration-200
            ${isFocusMode ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
                >
                    <FocusView />
                </div>
            </div>
        </div>
    );
}
