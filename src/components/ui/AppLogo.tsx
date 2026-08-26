import React from "react";
import Link from "next/link";

export interface AppLogoProps {
  href?: string;
  className?: string;
  showTagline?: boolean;
}

export function AppLogo({ href = "/app", className = "", showTagline = false }: AppLogoProps) {
  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div
        className="w-8 h-8 rounded-lg bg-teal-800 text-white font-bold flex items-center justify-center text-base tracking-wider shadow-xs"
        aria-hidden="true"
      >
        CF
      </div>
      <div className="flex flex-col">
        <span className="text-base font-bold tracking-tight text-slate-900 dark:text-zinc-100 leading-tight">
          Control Financiero
        </span>
        {showTagline && (
          <span className="text-[10px] uppercase font-semibold tracking-wider text-teal-700 dark:text-teal-400">
            Gestión Personal
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus-visible:rounded-lg" aria-label="Ir al inicio de Control Financiero">
        {content}
      </Link>
    );
  }

  return content;
}
