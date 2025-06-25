import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Принимает произвольное количество классов и объединяет их,
 * используя clsx и twMerge для устранения конфликтов Tailwind.
 *
 * @param {...ClassValue[]} inputs - Список классов для объединения.
 * @returns {string} - Объединённая строка классов.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}