"use client";

import React from "react";
import { UserMenu } from "./UserMenu";
import { AppLogo } from "../ui/AppLogo";
import { Badge } from "../ui/Badge";
import { ThemeToggle } from "../ui/ThemeToggle";
import { env } from "@/lib/env/env";

export function Header() {
  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Mobile Logo */}
      <div className="flex items-center gap-3 md:hidden">
        <AppLogo />
      </div>

      {/* Desktop Section / Context */}
      <div className="hidden md:flex items-center gap-3">
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-400">
          Espacio Personal
        </span>
        {env.NEXT_PUBLIC_USE_MOCKS && (
          <Badge variant="warning">MOCK</Badge>
        )}
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle variant="icon" />
        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" aria-hidden="true" />
        <UserMenu />
      </div>
    </header>
  );
}
