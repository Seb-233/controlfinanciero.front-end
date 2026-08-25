"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme, ThemeMode } from "@/features/theme/context/ThemeContext";

export interface ThemeToggleProps {
  variant?: "icon" | "segmented" | "dropdown";
  className?: string;
}

export function ThemeToggle({ variant = "icon", className = "" }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (variant === "segmented") {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#1f1f23] border border-slate-200 dark:border-[#3f3f46]/60 ${className}`}
        role="group"
        aria-label="Seleccionar tema"
      >
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
            theme === "light"
              ? "bg-white dark:bg-[#27272a] text-slate-900 dark:text-white shadow-2xs"
              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
          }`}
          aria-pressed={theme === "light"}
        >
          <SunIcon className="w-3.5 h-3.5" />
          <span>Claro</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
            theme === "dark"
              ? "bg-white dark:bg-[#27272a] text-slate-900 dark:text-white shadow-2xs"
              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
          }`}
          aria-pressed={theme === "dark"}
        >
          <MoonIcon className="w-3.5 h-3.5" />
          <span>Oscuro</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("system")}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
            theme === "system"
              ? "bg-white dark:bg-[#27272a] text-slate-900 dark:text-white shadow-2xs"
              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
          }`}
          aria-pressed={theme === "system"}
        >
          <SystemIcon className="w-3.5 h-3.5" />
          <span>Auto</span>
        </button>
      </div>
    );
  }

  if (variant === "dropdown") {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-slate-700 dark:text-zinc-300 rounded-lg hover:bg-slate-100 dark:hover:bg-[#222226] transition-colors"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-2">
            {resolvedTheme === "dark" ? (
              <MoonIcon className="w-4 h-4 text-teal-400" />
            ) : (
              <SunIcon className="w-4 h-4 text-amber-500" />
            )}
            <span>Tema: {theme === "system" ? "Sistema" : theme === "dark" ? "Oscuro" : "Claro"}</span>
          </span>
          <span aria-hidden="true" className="text-slate-400 text-[10px]">▼</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 bottom-full mb-1 w-40 rounded-xl bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] shadow-lg py-1 z-50">
            {(
              [
                { mode: "light", label: "Claro", icon: SunIcon },
                { mode: "dark", label: "Oscuro", icon: MoonIcon },
                { mode: "system", label: "Sistema", icon: SystemIcon },
              ] as const
            ).map(({ mode, label, icon: Icon }) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setTheme(mode as ThemeMode);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3 py-2 text-xs transition-colors ${
                  theme === mode
                    ? "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold"
                    : "text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </span>
                {theme === mode && <span className="text-teal-600 dark:text-teal-400">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default: Icon Toggle
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-colors focus-visible:outline-2 focus-visible:outline-teal-600 ${className}`}
      title={resolvedTheme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-label={resolvedTheme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {resolvedTheme === "dark" ? (
        <SunIcon className="w-5 h-5 text-amber-400 transition-transform hover:rotate-45 duration-300" />
      ) : (
        <MoonIcon className="w-5 h-5 text-slate-600 hover:text-slate-900 transition-transform hover:-rotate-12 duration-300" />
      )}
    </button>
  );
}

function SunIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  );
}

function MoonIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      />
    </svg>
  );
}

function SystemIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"
      />
    </svg>
  );
}
