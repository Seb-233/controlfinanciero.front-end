import React, { useId } from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, children, className = "", id: customId, ...props }, ref) => {
    const defaultId = useId();
    const selectId = customId || defaultId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`w-full rounded-lg border bg-white dark:bg-[#18181b] px-3 py-2 text-sm text-slate-900 dark:text-zinc-100 shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-zinc-800 disabled:text-slate-500 ${
            error ? "border-red-500 focus-visible:outline-red-600" : "border-slate-300 dark:border-[#27272a]"
          } ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && (
          <p id={errorId} className="text-xs font-medium text-red-600">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
