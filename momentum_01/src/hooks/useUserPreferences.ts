"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface UserPreferences {
    show_descriptions: boolean;
    show_completed_tasks: boolean;
    show_categories: boolean;
}

const defaultPreferences: UserPreferences = {
    show_descriptions: true,
    show_completed_tasks: true,
    show_categories: true,
};

export function useUserPreferences() {
    const [preferences, setPreferences] =
        useState<UserPreferences>(defaultPreferences);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPreferences = async () => {
            const { data: userData } = await supabase.auth.getUser();
            const userId = userData?.user?.id;

            if (!userId) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("user_preferences")
                .select("*")
                .eq("user_id", userId)
                .single();

            if (error && error.code !== "PGRST116") {
                console.error("Error fetching preferences:", error.message);
                setLoading(false);
                return;
            }

            if (data) {
                setPreferences({
                    show_descriptions: data.show_descriptions,
                    show_completed_tasks: data.show_completed_tasks,
                    show_categories: data.show_categories,
                });
            } else {
                // no record yet — insert a new one
                await supabase.from("user_preferences").insert({
                    user_id: userId,
                    ...defaultPreferences,
                });
            }

            setLoading(false);
        };

        fetchPreferences();
    }, []);

    const updatePreference = async (
        key: keyof UserPreferences,
        value: boolean
    ) => {
        setPreferences((prev) => ({
            ...prev,
            [key]: value,
        }));

        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;

        if (!userId) return;

        const { error } = await supabase
            .from("user_preferences")
            .update({ [key]: value })
            .eq("user_id", userId);

        if (error) {
            console.error("Error updating preference:", error.message);
        }
    };

    return { preferences, updatePreference, loading };
}
