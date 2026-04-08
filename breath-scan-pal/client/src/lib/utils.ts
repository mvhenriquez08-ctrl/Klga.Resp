import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function oxygenColor(score: number | null | undefined): string {
  if (score == null) return "text-gray-400";
  if (score >= 94) return "text-emerald-400";
  if (score >= 90) return "text-yellow-400";
  return "text-red-400";
}

export function scoreColor(score: number | null | undefined): string {
  if (score == null) return "text-gray-400";
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
}

export function scoreLabel(score: number | null | undefined): string {
  if (score == null) return "N/A";
  if (score >= 75) return "Good";
  if (score >= 50) return "Fair";
  return "Poor";
}
