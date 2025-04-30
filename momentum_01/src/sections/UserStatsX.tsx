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
import TodayFocusCard from "@/components/dashboard/TodayFocusCard";
import WeeklyFocusBarChartCard from "@/components/dashboard/WeeklyFocusBarChartCard";

interface Category {
    id: string;
    cat_name: string;
}

function UserStatsX() {
    const [dateStr, setDateStr] = useState<string>("");

    // Compute today's date string and total focus
    useEffect(() => {
        // format date
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: "short",
            month: "short",
            day: "numeric",
        };
        setDateStr(now.toLocaleDateString(undefined, options));
    }, []);

    return (
        <div className="h-full w-full flex flex-col overflow-auto no-scrollbar ">
            {/* Top Header bar Fixed */}
            <div className="backdrop-blur-md sticky top-0 z-10 mb-15">
                <div className=" flex items-center justify-between ps-4 pe-20 py-4 bg-red-100">
                    <div className="text-4xl ">My Stats</div>
                    <div className="">{dateStr}</div>
                </div>
            </div>

            {/* !!! Stats area MAIN BODY*/}
            <div className="h-full flex flex-col">
                {/* Row 1 */}
                <div className="h-1/2 bg-amber-100">Row 1</div>

                {/* ROW 2 */}
                <div className="flex h-1/2 ">
                    <div className="flex-1/4 h-full">
                        <TodayFocusCard />
                    </div>
                    <div className="flex-1/2 h-full">
                        <WeeklyFocusBarChartCard />
                    </div>
                    <div className="flex-1/4 h-full">
                        <TodayFocusCard />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserStatsX;
