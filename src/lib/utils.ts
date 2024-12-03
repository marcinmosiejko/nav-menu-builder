import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStateFromLocalStorage = <T>(storageKey: string) => {
  const savedData = localStorage.getItem(storageKey);
  return savedData ? (JSON.parse(savedData) as T) : undefined;
};
