'use client';

import { useEffect, useRef } from 'react';

interface Props extends IntersectionObserverInit {
  onIntersect: () => void;
  enabled?: boolean;
}

const useIntersectionObserver = ({
  root,
  rootMargin,
  threshold,
  onIntersect,
  enabled = true,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const onIntersectRef = useRef(onIntersect);

  onIntersectRef.current = onIntersect;

  useEffect(() => {
    const element = ref.current;

    if (!element || !enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersectRef.current();
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, enabled]);

  return ref;
};

export default useIntersectionObserver;
