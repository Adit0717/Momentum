"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Profile {
    user_id: string;
    created_at: string;
    email: string;
    full_name: string;
    avatar_url: string;
    // …add any other columns you have
}

export default function useUserProfile() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;

        async function fetchProfile() {
            // 1) get the logged‑in user
            const {
                data: { user },
                error: authErr,
            } = await supabase.auth.getUser();

            if (authErr || !user) {
                if (alive) setError("Not authenticated");
                return;
            }

            // 2) select * from profiles where user_id = user.id limit 1
            const { data, error: profErr } = await supabase
                .from("profiles")
                .select("*")
                .eq("user_id", user.id)
                .single();

            if (profErr) {
                if (alive) setError(profErr.message);
            } else if (alive) {
                setProfile(data);
            }
        }

        fetchProfile()
            .catch((err) => alive && setError(err.message))
            .finally(() => alive && setLoading(false));

        return () => {
            alive = false;
        };
    }, []);

    return { profile, loading, error };
}
