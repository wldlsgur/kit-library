import { useEffect, useRef, useState } from 'react';

import useEventCallback from '@/use-event-callback';

interface Props extends IntersectionObserverInit {
  onIntersect: () => void;
}

const useObserver = <T extends HTMLElement>({
  root,
  rootMargin,
  threshold,
  onIntersect,
}: Props) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<T | null>(null);

  const callback = useEventCallback(onIntersect);

  useEffect(() => {
    const $element = ref.current;

    if (!$element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        setIsIntersecting(isIntersecting);

        if (isIntersecting) {
          callback?.();
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe($element);

    return () => {
      if ($element) {
        observer.unobserve($element);
        observer.disconnect();
      }
    };
  }, [callback, root, rootMargin, threshold]);

  return { ref, isIntersecting };
};

export default useObserver;
