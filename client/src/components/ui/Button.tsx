import React from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const base =
    "inline-flex items-center cursor-pointer justify-center rounded-md font-medium transition-all duration-150 ease-out " +
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-black " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-white text-black font-semibold shadow-sm " +
      "hover:bg-zinc-100 hover:shadow-sm" +
      "active:shadow-none",
    secondary:
      "border border-zinc-700 text-zinc-200 " +
      "hover:border-zinc-500 hover:bg-zinc-900 hover:text-white "
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
