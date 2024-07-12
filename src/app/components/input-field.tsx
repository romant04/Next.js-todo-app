import React, { HTMLInputTypeAttribute } from "react";

interface Props {
  type: HTMLInputTypeAttribute;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  value: string;
}

export const InputField = React.forwardRef<HTMLInputElement, Props>(
  ({ type, label, onChange, onBlur, value }, ref) => {
    return (
      <div className="flex flex-col">
        <label>{label}</label>
        <input
          type={type}
          name={label}
          value={value}
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          className="rounded-sm bg-gray-500 p-1 text-lg text-white dark:bg-gray-200 dark:text-black"
        />
      </div>
    );
  },
);
