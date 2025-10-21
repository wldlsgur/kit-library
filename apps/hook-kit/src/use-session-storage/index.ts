'use client';

import { useCallback, useState } from 'react';

const useSessionStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return defaultValue;
      }

      const storedValue = sessionStorage.getItem(key);

      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setItem = useCallback(
    (newValue: T) => {
      try {
        sessionStorage.setItem(key, JSON.stringify(newValue));
        setValue(newValue);
      } catch {
        sessionStorage.setItem(key, JSON.stringify(defaultValue));
        setValue(defaultValue);
      }
    },
    [defaultValue, key],
  );

  const removeItem = useCallback(() => {
    sessionStorage.removeItem(key);
    setValue(defaultValue);
  }, [defaultValue, key]);

  return { value, setItem, removeItem };
};

export default useSessionStorage;
