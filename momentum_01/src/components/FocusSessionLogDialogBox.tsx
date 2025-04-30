// components/FocusSessionLogDialogBox.tsx
"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CategoryPill from "./CategoryPill";
import { supabase } from "@/lib/supabaseClient";

interface Session {
    id: string;
    name: string;
    started_at: string;
    ended_at: string;
    category_id: string | null;
}

export default function FocusSessionLogDialogBox({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [logs, setLogs] = useState<Session[]>([]);
    const [categories, setCategories] = useState<Record<string, string>>({});

    // Fetch logs + categories when opened
    useEffect(() => {
        if (!isOpen) return;

        (async () => {
            const { data: userData, error: userErr } =
                await supabase.auth.getUser();
            if (userErr || !userData.user) return;

            const userId = userData.user.id;

            // get sessions
            const { data: sessions, error: sessErr } = await supabase
                .from("focus_sessions")
                .select("id, name, started_at, ended_at, category_id")
                .eq("user_id", userId)
                .order("started_at", { ascending: false });

            if (sessErr) {
                console.error("fetch sessions:", sessErr.message);
                return;
            }

            setLogs(sessions || []);

            // and categories map
            const { data: cats } = await supabase
                .from("task_categories")
                .select("id, cat_name")
                .eq("user_id", userId);

            if (cats) {
                const map: Record<string, string> = {};
                cats.forEach((c) => (map[c.id] = c.cat_name));
                setCategories(map);
            }
        })();
    }, [isOpen]);

    if (!isOpen) return null;

    // portal root
    const root =
        document.getElementById("modal-root") ??
        (() => {
            const d = document.createElement("div");
            d.id = "modal-root";
            document.body.appendChild(d);
            return d;
        })();

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });

    const fmtDuration = (start: string, end: string) => {
        const sec = Math.floor(
            (new Date(end).getTime() - new Date(start).getTime()) / 1000
        );
        const h = Math.floor(sec / 3600),
            m = Math.floor((sec % 3600) / 60),
            s = sec % 60;
        const pad = (v: number) => v.toString().padStart(2, "0");
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    };

    return createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
            <div className="bg-white rounded-xl overflow-hidden w-[90%] max-w-2xl mx-auto rounded-t-[25]">
                <div className="flex justify-between items-center">
                    <div className="text-sm p-4 h-[50] flex w-fit items-center">
                        FOCUS SESSIONS LOG
                    </div>
                    <button
                        onClick={onClose}
                        className="text-black flex items-center justify-center h-[50] w-[50] hover:bg-black focus:outline-none hover:text-white rounded-full duration-150"
                    >
                        <span className="material-icons">close</span>
                    </button>
                </div>
                <div className="flex px-4 py-2  text-xs mb-4 mt-3 text-gray-500">
                    <div className="flex-1">
                        <div className="font-medium">Session Name</div>
                    </div>
                    <div className="w-[200] justify-end">Category</div>
                    <div className="w-[200] text-right">Time</div>
                </div>
                <div className="max-h-120 overflow-auto">
                    {logs.length === 0 ? (
                        <div className="p-4 text-gray-500">
                            No sessions yet.
                        </div>
                    ) : (
                        logs.map((s) => (
                            <div
                                key={s.id}
                                className="flex px-4 py-2 border-b border-gray-300 last:border-none"
                            >
                                <div className="flex-1">
                                    <div className="font-medium">{s.name}</div>
                                </div>
                                <div className="w-[200] justify-end">
                                    {s.category_id && (
                                        <CategoryPill
                                            label={
                                                categories[s.category_id] || ""
                                            }
                                            deletable={false}
                                        />
                                    )}
                                </div>
                                <div className="w-[200] text-right">
                                    <div className="text-xs text-gray-500">
                                        {formatDate(s.started_at)} -{" "}
                                        {formatDate(s.ended_at)}
                                    </div>
                                    <span className="text-sm font-mono">
                                        {fmtDuration(s.started_at, s.ended_at)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>,
        root
    );
}
