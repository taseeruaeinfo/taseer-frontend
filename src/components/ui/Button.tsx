import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "white";
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = "primary",
    className = "",
}) => {
    const baseStyles =
        "px-6 py-2 text-lg font-medium rounded-full transition duration-300";

    const variants = {
        primary: "bg text-white  hover:bg-gray-800",
        white: "bg-white text-black border border-gray-900 hover:bg-purple-500 hover:text-white",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
