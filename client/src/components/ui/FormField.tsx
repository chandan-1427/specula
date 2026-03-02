import React from "react";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, children }) => {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-300">
        {label}
      </label>
      {children}
    </div>
  );
};

export default FormField;