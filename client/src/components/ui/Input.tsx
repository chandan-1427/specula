import React from "react";
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={clsx(
        "w-full rounded-lg border border-white/5 bg-zinc-900/80",
        "px-4 py-2 text-sm text-white outline-none transition",

        "focus:border-indigo-400/70 focus:ring-[0.5px] focus:ring-indigo-400/50",
        className
      )}
      {...props}
    />
  );
};

export default Input;
