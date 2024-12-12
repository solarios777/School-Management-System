import { FieldError } from "react-hook-form";

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
  as?: "input" | "select"; // Added to support both input and select fields
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
  return (
    <div className={`flex flex-col gap-2 w-full md:w-1/4 ${hidden ? "hidden" : ""}`}>
      <label className="text-xs text-gray-500">{label}</label>
      {as === "input" ? (
        <input
          type={type}
          {...register(name)}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          disabled={disabled}
          defaultValue={defaultValue}
          placeholder={placeholder}
          {...inputProps}
        />
      ) : (
        <select
          {...register(name)}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
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
