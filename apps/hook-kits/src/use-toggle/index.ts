'use client';

import { useCallback, useState } from 'react';

const useToggle = (initialState?: boolean) => {
  const [isToggle, setIsToggle] = useState(initialState || false);

  const handleToggle = useCallback(() => {
    setIsToggle((prev) => !prev);
  }, []);

  const handleSetTrue = useCallback(() => {
    setIsToggle(true);
  }, []);

  const handleSetFalse = useCallback(() => {
    setIsToggle(false);
  }, []);

  const handleSetBoolean = useCallback((state: boolean) => {
    setIsToggle(state);
  }, []);

  return {
    isToggle,
    handleToggle,
    handleSetFalse,
    handleSetTrue,
    handleSetBoolean,
  };
};

export default useToggle;
