'use client';

import { useCallback, useEffect, useState } from 'react';

const useWheel = () => {
  const [isWheel, setIsWheel] = useState(false);

  const handleWheelTrue = useCallback(() => {
    setIsWheel(true);
  }, []);

  const handleWheelFalse = useCallback(() => {
    setIsWheel(false);
  }, []);

  useEffect(() => {
    window.addEventListener('wheel', handleWheelTrue);

    return () => {
      window.removeEventListener('wheel', handleWheelTrue);
    };
  }, [handleWheelTrue]);

  return { isWheel, handleWheelTrue, handleWheelFalse };
};

export default useWheel;
