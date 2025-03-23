import React from "react";
import Image from "next/image";
import "material-icons/iconfont/material-icons.css";

interface IconButtonProps {
    icon?: string; // Material Icon name
    imgSrc?: string; // Image source (for SVG or PNG)
    alt?: string; // Alt text for image
    onClick?: () => void; // Click event handler
    size?: string; // Tailwind size (e.g., "w-6 h-6")
    color?: string; // Tailwind text color (e.g., "text-black", "text-gray-500")
}

const IconButton: React.FC<IconButtonProps> = ({
    icon,
    imgSrc,
    alt = "icon",
    onClick,
    size = "w-6 h-6",
    color = "text-black",
}) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition"
        >
            {imgSrc ? (
                <Image
                    src={imgSrc}
                    alt={alt}
                    width={24}
                    height={24}
                    className={size}
                />
            ) : icon ? (
                <span className={`material-icons ${size} ${color}`}>
                    {icon}
                </span>
            ) : null}
        </button>
    );
};

export default IconButton;
