"use client";
import Image from "next/image";
import LogoExtendedLight from "../../public/logo-extendend-light.svg";
import TextField from "../components/TextField";
import NextRoundButton from "../components/NextRoundButton";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabaseClient";

function HomePage() {
    useEffect(() => {
        console.log("Supabase client:", supabase);
    }, []);

    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [signUpName, setSignUpName] = useState("");

    return (
        <div>
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
                        <Image
                            src={LogoExtendedLight}
                            alt="logo-extended-light"
                        />
                        <div className="pr-15">
                            A productivity tracker that helps you manage tasks,
                            optimize workflow, and track progress with smart
                            insights and focus mode.
                        </div>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="h-full w-full flex flex-col justify-end">
                    {/* Sign in container */}
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
                                onChange={(e) =>
                                    setSignInPassword(e.target.value)
                                }
                            />
                            <div className="flex justify-between items-center mt-4">
                                <a href="#" className="text-sm">
                                    Reset Password
                                </a>

                                <NextRoundButton
                                    onClick={() => {
                                        alert("sign in button clicked");
                                    }}
                                />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Column 3 */}
                <div className="h-full w-full flex flex-col justify-end gap-4">
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

                    {/* Sign up container */}
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
                                    onClick={() => {
                                        alert("Sign up button clicked!");
                                    }}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
