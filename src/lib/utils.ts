import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStateFromLocalStorage = <T>(storageKey: string) => {
  const savedData = localStorage.getItem(storageKey);
  return savedData ? (JSON.parse(savedData) as T) : undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const runAtEndOfCallStack = <T extends (...args: any[]) => void>(
  fn: T,
): ((...args: Parameters<T>) => void) => {
  return (...args: Parameters<T>) => {
    setTimeout(() => {
      fn(...args);
    }, 0);
  };
};
