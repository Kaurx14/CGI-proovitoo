import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Created by shadcn automatically to easily combine classnames
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
