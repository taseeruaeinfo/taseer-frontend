import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "white";
    className?: string;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = "primary",
    className = "",
    disabled = false,
}) => {
    const baseStyles =
        "px-6 py-2 text-lg font-medium rounded-full transition duration-300";

    const variants = {
        primary: "bg text-white hover:bg-gray-800",
        white: "bg-white text-black border border-gray-900 hover:bg-purple-500 hover:text-white",
    };

    const disabledStyles = disabled 
        ? "opacity-50 cursor-not-allowed hover:bg-inherit hover:text-inherit" 
        : "";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${disabledStyles} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;