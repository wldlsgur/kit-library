'use client';

import { useEffect, useRef } from 'react';

const useEventCallback = <T extends (...args: any[]) => any>(callback?: T) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return callbackRef.current;
};

export default useEventCallback;
