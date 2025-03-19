import React, { useState } from "react";

interface TextFieldProps {
    placeholder: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextField: React.FC<TextFieldProps> = ({
    placeholder,
    type,
    value,
    onChange,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="flex flex-col gap-2">
            <input
                placeholder={placeholder}
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full p-2 border-b-2 border-gray-300 transition-all duration-200 
                    ${
                        isFocused
                            ? "bg-gray-900 text-white border-b-2 border-black placeholder:text-gray-100 ps-6 p-4"
                            : "bg-transparent text-black"
                    } 
                    focus:outline-none`}
            />
        </div>
    );
};

export default TextField;
