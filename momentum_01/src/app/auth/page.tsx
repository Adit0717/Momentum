"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import TextField from "@/components/TextField";
import IconButton from "@/components/IconButton";
import NextRoundButton from "@/components/NextRoundButton";
import LogoExtendedLight from "../../../public/logo-extendend-light.svg";
import Image from "next/image";

export default function AuthPage() {
    const router = useRouter();

    // which form is showing
    // const [mode, setMode] = useState<"signIn" | "signUp">("signIn");

    // sign‑in form fields
    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");

    // sign‑up form fields
    const [signUpName, setSignUpName] = useState("");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");

    // shared state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [msg, setMsg] = useState<string | null>(null);

    // ? Handling Sign In
    const handleSignIn = async () => {
        setLoading(true);
        setError(null);

        const { data, error: supaErr } = await supabase.auth.signInWithPassword(
            {
                email: signInEmail,
                password: signInPassword,
            }
        );

        if (supaErr) {
            setError(supaErr.message);
        } else {
            router.push("/dashboard"); // or wherever
        }
        setLoading(false);
    };

    // ? Handling Sign Up
    const handleSignUp = async () => {
        setLoading(true);
        setError(null);

        // 1) Create the auth user
        const { data: signUpData, error: signUpErr } =
            await supabase.auth.signUp({
                email: signUpEmail,
                password: signUpPassword,
            });

        if (signUpErr) {
            setError(signUpErr.message);
            setLoading(false);
            return;
        }

        // 2) Now insert into profiles. user_id will default to auth.uid()
        const userId = signUpData.user?.id!;
        const { error: profileErr } = await supabase.from("profiles").insert([
            {
                user_id: userId,
                email: signUpEmail,
                full_name: signUpName,
                avatar_url: "https://i.postimg.cc/placeholder/avatar.png",
            },
        ]);

        if (profileErr) {
            console.error("Could not insert profile:", profileErr);
            setError(profileErr.message);
            setLoading(false);
            return;
        }

        // 3) Success → clear form & redirect
        setSignUpName("");
        setSignUpEmail("");
        setSignUpPassword("");
        router.push("/verify");
        setLoading(false);
    };

    // ? Handle Reset Password
    const handleResetPassword = async () => {
        if (!signInEmail) {
            setError("Please enter your email first.");
            return;
        }
        setLoading(true);
        setError(null);
        setMsg(null);

        const { error } = await supabase.auth.resetPasswordForEmail(
            signInEmail,
            {
                redirectTo: `${window.location.origin}/auth`,
            }
        );

        if (error) {
            setError(error.message);
        } else {
            setMsg("Check your inbox for a password reset link!");
        }
        setLoading(false);
    };

    return (
        <div className="w-full h-screen flex flex-col sm:flex-row gap-4 p-10">
            <div className="h-full w-full  flex flex-col justify-between">
                {/* Top Content */}
                <div className="flex flex-col">
                    <div className="uppercase text-light">developers</div>

                    <a href="#" className="indent-8">
                        Shubhdeep Sarkar
                    </a>
                    <a href="#" className="indent-8">
                        Aditya Krishnamurthi
                    </a>
                    <a href="#" className="indent-8">
                        Rohan Boorugu
                    </a>
                </div>

                {/* Bottom Content */}
                <div className=" flex flex-col gap-4 mt-10">
                    <Image src={LogoExtendedLight} alt="logo-extended-light" />
                    <div className="pr-15">
                        A productivity tracker that helps you manage tasks,
                        optimize workflow, and track progress with smart
                        insights and focus mode.
                    </div>
                </div>
            </div>

            {/* Column 2 */}
            <div className="h-full w-full flex flex-col justify-end">
                {/* //? Sign in container */}
                <div className="bg-gray-100 p-6 flex flex-col mt-10">
                    <div className="text-3xl">Sign into your account</div>
                    <form className="flex flex-col gap-4 mt-8">
                        <TextField
                            placeholder="Email"
                            type="text"
                            value={signInEmail}
                            onChange={(e) => setSignInEmail(e.target.value)}
                        />
                        <TextField
                            placeholder="Password"
                            type="password"
                            value={signInPassword}
                            onChange={(e) => setSignInPassword(e.target.value)}
                        />
                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={handleResetPassword}
                                disabled={loading}
                                className="text-sm text-blue-600 hover:underline cursor-pointer disabled:opacity-0"
                            >
                                Reset Password
                            </button>

                            {/* //? Sign in button */}
                            <NextRoundButton
                                onClick={handleSignIn}
                                disabled={loading}
                            />
                        </div>
                    </form>
                </div>
            </div>

            {/* Column 3 */}
            <div className="h-full w-full flex flex-col justify-between">
                <div className=" text-end">
                    {error && (
                        <p className="text-red-600 text-end mb-2 text-sm">
                            ERROR
                            <br />
                            {error}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    {/* Demo Mode container */}
                    <div className="bg-gray-100 p-6 flex flex-col">
                        <div className="text-3xl">Enter Demo Mode</div>
                        <div className="text-sm mt-4">
                            Explore features without signing up. Your data will
                            be lost if your end the session.
                        </div>

                        <div className="flex justify-end items-center mt-4">
                            <NextRoundButton
                                onClick={() => {
                                    alert("Demo mode button clicked!");
                                }}
                            />
                        </div>
                    </div>

                    {/* //? Sign up container */}
                    <div className="bg-gray-100 p-6 flex flex-col">
                        <div className="text-3xl">Or create a new account</div>
                        <form className="flex flex-col gap-4 mt-8">
                            <TextField
                                placeholder="Your Name"
                                value={signUpName}
                                onChange={(e) => setSignUpName(e.target.value)}
                            />
                            <TextField
                                placeholder="Email"
                                type="email"
                                value={signUpEmail}
                                onChange={(e) => setSignUpEmail(e.target.value)}
                            />
                            <TextField
                                placeholder="Set password"
                                type="password"
                                value={signUpPassword}
                                onChange={(e) =>
                                    setSignUpPassword(e.target.value)
                                }
                            />
                            <div className="flex justify-end items-center mt-4">
                                <NextRoundButton
                                    onClick={handleSignUp}
                                    disabled={loading}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
