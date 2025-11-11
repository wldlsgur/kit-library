'use client';

import { useCallback, useRef } from 'react';

const useEventCallback = <T extends (...args: any[]) => any>(
  callback?: T,
): T => {
  const ref = useRef(callback);

  ref.current = callback;

  const stableCallback = useCallback((...args: Parameters<T>) => {
    return ref.current?.(...args);
  }, []);

  return stableCallback as T;
};

export default useEventCallback;
