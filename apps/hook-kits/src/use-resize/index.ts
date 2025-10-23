'use client';

import { useEffect, useRef, useState } from 'react';

const useResize = <T>() => {
  const ref = useRef<T | null>(null);
  const [rect, setRect] = useState<DOMRectReadOnly | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element || !(element instanceof HTMLElement)) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      setRect(entry.contentRect);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return { ref, rect };
};

export default useResize;
