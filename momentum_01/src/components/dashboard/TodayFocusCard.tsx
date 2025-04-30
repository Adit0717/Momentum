"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TodayFocusCard() {
    const [totalSec, setTotalSec] = useState(0);
    const [todaySec, setTodaySec] = useState(0);
    const [yesterdaySec, setYesterdaySec] = useState(0);

    // helper to sum sessions between two dates
    const sumSessions = (
        sessions: { started_at: string; ended_at: string }[]
    ) =>
        sessions.reduce((acc, s) => {
            const start = new Date(s.started_at).getTime();
            const end = new Date(s.ended_at).getTime();
            return acc + (end - start) / 1000;
        }, 0);

    // load today & yesterday totals
    useEffect(() => {
        (async () => {
            const { data: u } = await supabase.auth.getUser();
            if (!u?.user?.id) return;
            const uid = u.user.id;

            // boundaries
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            const yesterdayStart = new Date(todayStart);
            yesterdayStart.setDate(yesterdayStart.getDate() - 1);

            // fetch both days
            const { data: sessions, error } = await supabase
                .from("focus_sessions")
                .select("started_at,ended_at")
                .eq("user_id", uid)
                .gte("started_at", yesterdayStart.toISOString())
                .lte("started_at", new Date().toISOString());

            if (error || !sessions) return;

            // split today vs yesterday
            const ySessions = sessions.filter(
                (s) => new Date(s.started_at) < todayStart
            );
            const tSessions = sessions.filter(
                (s) => new Date(s.started_at) >= todayStart
            );

            setYesterdaySec(Math.floor(sumSessions(ySessions)));
            setTodaySec(Math.floor(sumSessions(tSessions)));
        })();
    }, []);

    const hrs = Math.floor(todaySec / 3600);
    const mins = Math.floor((todaySec % 3600) / 60);

    // Comparing today's and yesterday's in percentage delta
    let comparison = "";
    if (yesterdaySec > 0) {
        const diff = todaySec - yesterdaySec;
        const pct = Math.abs(Math.round((diff / yesterdaySec) * 100));
        if (diff > 0) comparison = `That's ${pct}% more than yesterday.`;
        else if (diff < 0) comparison = `That's ${pct}% less than yesterday.`;
        else comparison = `Same as yesterday.`;
    } else if (todaySec > 0) {
        comparison = "First session more than yesterday!";
    } else if (todaySec == 0) {
        comparison = "You haven't focused today.";
    }

    return (
        <div className="w-full h-full flex flex-col p-4 justify-between hover:bg-gray-100 duration-150">
            <div className="text-sm text-gray-700 mb-2">FOCUS</div>
            <div className="text-5xl flex flex-col">
                <div className="font-semibold">
                    <span className="font-mono">
                        {hrs.toString().padStart(2, "0")}
                    </span>
                    hrs{" "}
                    <span className="font-mono">
                        {" "}
                        {mins.toString().padStart(2, "0")}
                    </span>
                    mins
                </div>
                <div className="opacity-45">today's focus duration</div>
            </div>

            <div className="italic">
                {comparison && (
                    <div className="text-gray-500 text-sm mt-2">
                        {comparison}
                    </div>
                )}
            </div>
        </div>
    );
}
