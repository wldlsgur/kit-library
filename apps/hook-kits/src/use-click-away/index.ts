'use client';

import { useEffect, useRef } from 'react';

import useEventCallback from '@/use-event-callback';

const events = ['mousedown', 'touchstart'] as const;

const useClickAway = <T extends HTMLElement>(
  onClick: (e?: MouseEvent | TouchEvent) => void,
) => {
  const ref = useRef<T | null>(null);
  const callback = useEventCallback(onClick);

  useEffect(() => {
    const element = ref.current;

    if (!element || !(element instanceof HTMLElement)) {
      return;
    }

    const eventHandler = (event: MouseEvent | TouchEvent) => {
      const { target } = event;

      if (!target || !(target instanceof HTMLElement)) {
        return;
      }

      if (element.contains(target)) {
        return;
      }

      callback?.(event);
    };

    events.forEach((event) => {
      document.addEventListener(event, eventHandler);
    });

    return () => {
      events.forEach((eventName) => {
        document.removeEventListener(eventName, eventHandler);
      });
    };
  }, [callback]);

  return ref;
};

export default useClickAway;
