import React, { useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id: customId, ...props }, ref) => {
    const defaultId = useId();
    const inputId = customId || defaultId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`w-full rounded-lg border bg-white dark:bg-[#18181b] px-3 py-2 text-sm text-slate-900 dark:text-zinc-100 shadow-xs transition-colors placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-zinc-800 disabled:text-slate-500 ${
            error ? "border-red-500 focus-visible:outline-red-600" : "border-slate-300 dark:border-[#27272a]"
          } ${className}`}
          {...props}
        />
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

Input.displayName = "Input";
