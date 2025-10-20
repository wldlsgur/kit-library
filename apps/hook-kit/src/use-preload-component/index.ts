'use client';

import React, { useEffect } from 'react';

type PreloadableComponent<T extends React.ComponentType<any>> = T & {
  preload: () => Promise<void>;
};

interface Props<T extends React.ComponentType<any>> {
  loader: () => Promise<{ default: T }>;
  onMount?: boolean;
}

const usePreloadComponent = <T extends React.ComponentType<any>>({
  loader,
  onMount = false,
}: Props<T>): PreloadableComponent<React.LazyExoticComponent<T>> => {
  // Promise 캐시 — import() 중복 실행 방지
  let cachedPromise: Promise<{ default: T }> | null = null;
  const LazyComponent = React.lazy(loader);

  const preload = async () => {
    if (!cachedPromise) {
      cachedPromise = loader();
    }

    await cachedPromise;
  };

  const Component = Object.assign(LazyComponent, { preload });

  useEffect(() => {
    if (onMount) {
      Component.preload();
    }
  }, [onMount, Component]);

  return Component;
};

export default usePreloadComponent;
