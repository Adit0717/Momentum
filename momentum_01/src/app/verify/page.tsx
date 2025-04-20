"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function VerifyPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleResend = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);

        // We need the user's email – you could
        // store it in localStorage/session, or prompt them:
        const email = window.localStorage.getItem("pendingEmail");
        if (!email) {
            setError("No email on file; please sign up again.");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.resend({
            email,
            type: "signup",
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Confirmation email resent. Check your inbox!");
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-md text-center space-y-4">
                <h1 className="text-2xl font-bold">Almost there…</h1>
                <p>
                    We’ve sent you an email to confirm your address. Please
                    click the link in that message to activate your account.
                </p>

                {message && <p className="text-green-600">{message}</p>}
                {error && <p className="text-red-600">{error}</p>}

                <button
                    onClick={handleResend}
                    disabled={loading}
                    className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                >
                    {loading ? "Resending…" : "Resend confirmation email"}
                </button>
            </div>
        </main>
    );
}
