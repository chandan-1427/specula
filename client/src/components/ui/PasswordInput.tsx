import React, { useState } from "react";
import clsx from "clsx";
import Input from "./Input";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const PasswordInput: React.FC<PasswordInputProps> = ({
  className,
  ...props
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        className={clsx("pr-16", className)}
        {...props}
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="cursor-pointer absolute inset-y-0 right-3 text-xs font-medium text-indigo-400 hover:text-indigo-300"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
};

export default PasswordInput;
