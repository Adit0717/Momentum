"use client";

import React from "react";
import "material-icons/iconfont/material-icons.css";

interface NextRoundButtonProps {
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
}

const NextRoundButton: React.FC<NextRoundButtonProps> = ({
    onClick,
    disabled = false,
    loading = false,
}) => {
    const isDisabled = disabled || loading;

    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`
        h-16 w-16 rounded-full border-2 flex items-center justify-center 
        transition-all duration-100
        ${
            isDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-black hover:border-black hover:text-white"
        }
      `}
        >
            {loading ? (
                // spinner icon (Material icon + Tailwind spin)
                <span className="material-icons animate-spin">autorenew</span>
            ) : (
                <span className="material-icons">arrow_forward</span>
            )}
        </button>
    );
};

export default NextRoundButton;
