'use client';

import { useEffect } from 'react';

const useScrollToTop = (dependency: unknown) => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [dependency]);
};

export default useScrollToTop;
