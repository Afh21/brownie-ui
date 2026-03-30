import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as a CSS pixel value
 */
export function px(value: number): string {
  return `${value}px`;
}

/**
 * Generate a unique ID
 */
export function generateId(prefix = 'brownie'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}
