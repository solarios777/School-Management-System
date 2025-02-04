import { useState } from "react";
import { FieldError } from "react-hook-form";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type InputFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  register: any;
  name: string;
  defaultValue?: string | number;
  error?: FieldError;
  hidden?: boolean;
  as?: "input" | "select"; // Supports both input and select fields
  options?: { value: string | number; label: string }[]; // For select options
  inputProps?: React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement>;
};

const InputField = ({
  label,
  type = "text",
  as = "input",
  register,
  name,
  hidden,
  disabled,
  placeholder,
  defaultValue,
  error,
  options = [],
  inputProps,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`flex flex-col gap-2 w-full md:w-1/4 ${hidden ? "hidden" : ""}`}>
      <label className="text-xs text-gray-500">{label}</label>
      {as === "input" ? (
        <div className="relative w-full">
          <input
            type={type === "password" && showPassword ? "text" : type}
            {...register(name)}
            className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full ${
              error ? "ring-red-400" : ""
            }`}
            disabled={disabled}
            defaultValue={defaultValue}
            placeholder={placeholder}
            {...inputProps}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
               {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          )}
        </div>
      ) : (
        <select
          {...register(name)}
          className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full ${
            error ? "ring-red-400" : ""
          }`}
          disabled={disabled}
          defaultValue={defaultValue}
          {...inputProps}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
