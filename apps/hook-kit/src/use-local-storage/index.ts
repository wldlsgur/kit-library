'use client';

import { useCallback, useState } from 'react';

const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState(() => {
    try {
      if (typeof window === 'undefined') {
        return defaultValue;
      }

      const storedValue = localStorage.getItem(key);

      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setItem = useCallback(
    (newValue: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
        setValue(newValue);
      } catch {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        setValue(defaultValue);
      }
    },
    [defaultValue, key],
  );

  const removeItem = useCallback(() => {
    localStorage.removeItem(key);
    setValue(defaultValue);
  }, [defaultValue, key]);

  return { value, setItem, removeItem };
};

export default useLocalStorage;
