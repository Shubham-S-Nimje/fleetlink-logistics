import { forwardRef } from "react";

const DatePicker = forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      error,
      required = false,
      disabled = false,
      min,
      max,
      includeTime = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const formatDateTimeLocal = (date) => {
      if (!date) return "";

      if (date instanceof Date && !isNaN(date)) {
        const pad = (n) => String(n).padStart(2, "0");
        const y = date.getFullYear();
        const m = pad(date.getMonth() + 1);
        const d = pad(date.getDate());
        const hh = pad(date.getHours());
        const mm = pad(date.getMinutes());
        return `${y}-${m}-${d}T${hh}:${mm}`;
      }

      if (typeof date === "string") {
        return includeTime ? date.slice(0, 16) : date.slice(0, 10);
      }
      return "";

      // const d = new Date(date);
      // const year = d.getFullYear();
      // const month = String(d.getMonth() + 1).padStart(2, "0");
      // const day = String(d.getDate()).padStart(2, "0");
      // const hours = String(d.getHours()).padStart(2, "0");
      // const minutes = String(d.getMinutes()).padStart(2, "0");

      // return includeTime
      //   ? `${year}-${month}-${day}T${hours}:${minutes}`
      //   : `${year}-${month}-${day}`;
    };

    const handleChange = (e) => {
      const dateValue = e.target.value;
      if (!e.target.validity.valid) return;

      onChange({
        ...e,
        target: {
          ...e.target,
          name,
          value: dateValue, // keep raw string
        },
      });

      // if (includeTime) {
      //   // Convert to ISO string for datetime-local
      //   const date = new Date(dateValue);
      //   onChange({
      //     ...e,
      //     target: {
      //       ...e.target,
      //       // value: date.toISOString(),
      //       value: dateValue,
      //     },
      //   });
      // } else {
      //   onChange(e);
      // }
    };

    const inputType = includeTime ? "datetime-local" : "date";
    const displayValue = includeTime ? formatDateTimeLocal(value) : value;

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
        <input
          ref={ref}
          type={inputType}
          id={name}
          name={name}
          value={displayValue}
          onChange={handleChange}
          min={min}
          max={max}
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
        />
        {error && <p className="text-sm text-danger-500">{error}</p>}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
