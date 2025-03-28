"use client";
import TempUserAvatar from "../../public/temp-user-avatar.png";
import FocusIconLight from "../../public/focus-icon-light.svg";
import FocusIconDark from "../../public/focus-icon-dark.svg";

import IconButton from "@/components/IconButton";
import { useState } from "react";
import Image from "next/image";

function DashBoard() {
    return (
        <div className="bg-amber-200 h-screen w-screen flex gap-4 p-5">
            <div className="absolute top-0 right-0 m-5 bg-amber-200 flex flex-col gap-2">
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

            <div className="bg-amber-300 h-full w-1/3">col 1</div>
            <div className="bg-amber-300 h-full w-2/3">col 1</div>
        </div>
    );
}

export default DashBoard;
