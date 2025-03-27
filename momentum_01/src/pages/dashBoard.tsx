"use client";
import TempUserAvatar from "../../public/temp-user-avatar.png";
import FocusIconLight from "../../public/focus-icon-light.svg";
import FocusIconDark from "../../public/focus-icon-dark.svg";

import IconButton from "@/components/IconButton";
import { useState } from "react";
import Image from "next/image";
import TodoSection from "@/sections/TodoSection";

function DashBoard() {
    return (
        <div className=" h-screen w-screen flex gap-4 p-5">
            {/* // ? Right top button */}
            <div
                className="absolute top-0 right-0 m-5  flex flex-col gap-2 bg-white pb-3 ps-3 border-gray-300 border-b-1 border-s-1"
                style={{
                    borderEndStartRadius: "36px",
                }}
            >
                <Image
                    src={TempUserAvatar}
                    alt="user avatar"
                    width={50}
                    height={50}
                    className="rounded-full border-2 border-black p-0.5"
                />
                <button
                    style={{ width: "50px", height: "50px" }}
                    className="rounded-full flex border-2 border-black justify-center items-center hover:bg-black duration-200"
                >
                    <Image src={FocusIconLight} alt="focus-icon-light" />
                </button>
            </div>

            <div
                className="border border-gray-300 h-full overflow-hidden "
                style={{ minWidth: "400px", maxWidth: "800px" }}
            >
                <TodoSection />
            </div>

            <div className="border border-gray-300 h-full flex-1">col 2</div>
        </div>
    );
}

export default DashBoard;
