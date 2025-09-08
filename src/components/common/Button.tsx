import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}
const Button: React.FC<ButtonProps> = ({ label, onClick, className, type = "button" }) => {
  return (
    <button
      onClick={onClick}
      className={className ?? "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}
      type={type}
    >
      {label}
    </button>
  );
};

export default Button;
