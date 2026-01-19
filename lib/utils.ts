import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind Class Merger
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * LocalStorage Utility for Guest Mode
 */
interface StorageItem<T> {
  value: T;
  timestamp: number;
}

export const storage = {
  set: <T>(key: string, value: T): void => {
    try {
      const item: StorageItem<T> = { value, timestamp: Date.now() };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },
  get: <T>(key: string): T | null => {
    try {
      if (typeof window === 'undefined') return null;
      const item = localStorage.getItem(key);
      if (!item) return null;
      const parsed: StorageItem<T> = JSON.parse(item);
      return parsed.value;
    } catch (error) {
      return null;
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }
};

export const STORAGE_KEYS = {
  GUEST_PROGRESS: 'seevoca_guest_progress',
  GUEST_SESSION: 'seevoca_guest_session',
  USER_PREFERENCES: 'seevoca_user_prefs',
} as const;

/**
 * Format Utilities
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
