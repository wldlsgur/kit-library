'use client';

import { useEffect, useRef } from 'react';

const useCallback = <T extends (...args: any[]) => any>(callback: T): T => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return callbackRef.current;
};

export default useCallback;
