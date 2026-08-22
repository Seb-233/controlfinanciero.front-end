"use client";

import React, { useState } from "react";
import { AccountType } from "@/types/accounts";

export interface AccountLogoProps {
  name: string;
  logoUrl?: string | null;
  color?: string;
  type?: AccountType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-9 h-9 text-xs rounded-lg",
  md: "w-11 h-11 text-sm rounded-xl",
  lg: "w-12 h-12 text-base rounded-xl",
};

/**
 * Returns an automatic logo URL based on known account names or types if logoUrl is not explicitly given.
 */
export function resolveAccountLogoUrl(name: string, type?: AccountType, logoUrl?: string | null): string {
  if (logoUrl) return logoUrl;

  const normalized = name.toLowerCase().trim();

  if (normalized.includes("bancolombia")) {
    return "/icons/accounts/bancolombia.svg";
  }
  if (normalized.includes("nequi")) {
    return "/icons/accounts/nequi.svg";
  }
  if (normalized.includes("nu") || normalized.includes("nubank")) {
    return "/icons/accounts/nu.svg";
  }
  if (normalized.includes("efectivo") || type === "CASH") {
    return "/icons/accounts/cash.svg";
  }
  if (type === "BANK") {
    return "/icons/accounts/bank-generic.svg";
  }

  return "";
}

export function AccountLogo({
  name,
  logoUrl,
  color = "#0f766e",
  type,
  size = "sm",
  className = "",
}: AccountLogoProps) {
  const resolvedUrl = resolveAccountLogoUrl(name, type, logoUrl);
  const [hasError, setHasError] = useState(false);

  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials =
    words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();

  if (resolvedUrl && !hasError) {
    return (
      <div
        className={`relative flex items-center justify-center shrink-0 overflow-hidden shadow-2xs ${sizeClasses[size]} ${className}`}
        style={{ backgroundColor: color }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedUrl}
          alt={`Logo de ${name}`}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center text-white font-bold shrink-0 shadow-2xs ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: color }}
      aria-label={`Iniciales de ${name}`}
    >
      {initials}
    </div>
  );
}
