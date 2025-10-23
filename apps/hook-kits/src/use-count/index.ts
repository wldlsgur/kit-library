'use client';

import { useCallback, useState } from 'react';

import useEventCallback from '@/use-event-callback';

interface Props {
  initialState?: number;
  limit?: number;
  onChange?: (value: number) => void;
}

const useCount = ({ initialState = 1, limit, onChange }: Props = {}) => {
  const [count, setCount] = useState(() => {
    if (initialState <= 0) {
      return 1;
    }

    if (limit && initialState > limit) {
      return limit;
    }

    return initialState;
  });
  const callback = useEventCallback(onChange);

  const increase = useCallback(() => {
    setCount((prev) => {
      const nextCount = prev + 1;

      if (!limit || nextCount <= limit) {
        callback?.(nextCount);

        return nextCount;
      }

      return prev;
    });
  }, [callback, limit]);

  const decrease = useCallback(() => {
    setCount((prev) => {
      const nextCount = prev - 1;

      if (nextCount > 0) {
        if (callback) {
          callback(nextCount);
        }

        return nextCount;
      }

      return prev;
    });
  }, [callback]);

  const handleChangeCount = useCallback(
    (nextCount: number) => {
      if (nextCount <= 0) {
        return;
      }

      if (limit && nextCount > limit) {
        return;
      }

      if (callback) {
        callback(nextCount);
      }

      setCount(nextCount);
    },
    [callback, limit],
  );

  return { count, increase, decrease, handleChangeCount };
};

export default useCount;
