import React from "react";
import "material-icons/iconfont/material-icons.css";

interface NextRoundButtonProps {
    onClick: () => void;
}

const NextRoundButton: React.FC<NextRoundButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="h-16 w-16 rounded-full border-2 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all duration-100"
        >
            <span className="material-icons">arrow_forward</span>
        </button>
    );
};

export default NextRoundButton;
