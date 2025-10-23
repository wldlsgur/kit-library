'use client';

import { useCallback, useRef, useState } from 'react';

const useRafState = <T>(defaultValue: T) => {
  const [state, setState] = useState(defaultValue);
  const frame = useRef<number | null>(null);

  const setRafState = useCallback((value: T) => {
    if (frame.current) {
      cancelAnimationFrame(frame.current);
    }

    frame.current = requestAnimationFrame(() => setState(value));
  }, []);

  return { state, setRafState };
};

export default useRafState;
