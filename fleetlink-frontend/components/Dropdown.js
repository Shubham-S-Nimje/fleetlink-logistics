import { forwardRef } from "react";

const Dropdown = forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      options = [],
      placeholder = "Select an option",
      error,
      required = false,
      disabled = false,
      className = "",
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
        <select
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
          text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          focus:outline-none focus:ring-primary-500 focus:border-primary-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${
            error
              ? "border-danger-500 focus:ring-danger-500 focus:border-danger-500"
              : ""
          }
          ${className}
        `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={typeof option === "object" ? option.value : option}
              value={typeof option === "object" ? option.value : option}
            >
              {typeof option === "object" ? option.label : option}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-danger-500">{error}</p>}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

export default Dropdown;
