import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

export function isEmail(value: string) {
  const v = value.trim();
  return v.length <= 200 && !v.includes("..") && EMAIL_RE.test(v);
}
