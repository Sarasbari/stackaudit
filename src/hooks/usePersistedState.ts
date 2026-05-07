import { useState, useEffect, useCallback, type SetStateAction, type Dispatch } from 'react';

const STORAGE_KEY = 'stackaudit_form';

type SetState<T> = Dispatch<SetStateAction<T>>;

/**
 * useState backed by localStorage.
 * - Hydrates from localStorage on mount (falls back to `defaultValue`).
 * - Persists every state change automatically.
 * - Exposes the same `[value, setValue]` tuple as useState.
 */
export function usePersistedState<T>(defaultValue: T): [T, SetState<T>] {
  const [state, setStateRaw] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as T;
    } catch {
      // corrupted or unavailable — fall through
    }
    return defaultValue;
  });

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full / private mode — silent fail
    }
  }, [state]);

  // Wrap setter to accept both value and updater fn (same API as useState)
  const setState: SetState<T> = useCallback((action: SetStateAction<T>) => {
    setStateRaw(action);
  }, []);

  return [state, setState];
}
