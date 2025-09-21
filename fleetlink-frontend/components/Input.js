import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      name,
      value,
      onChange,
      placeholder,
      error,
      required = false,
      disabled = false,
      className = "",
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700"
          >
            {label} {required && <span className="text-danger-500">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
            focus:outline-none focus:ring-primary-500 focus:border-primary-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${leftIcon ? "pl-10" : ""}
            ${rightIcon ? "pr-10" : ""}
            ${
              error
                ? "border-danger-500 focus:ring-danger-500 focus:border-danger-500"
                : ""
            }
            ${className}
          `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-danger-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
