import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function to merge class names
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}
