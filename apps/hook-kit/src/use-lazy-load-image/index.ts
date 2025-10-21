'use client';

import { useEffect, useRef, useState } from 'react';

interface Props extends IntersectionObserverInit {
  isLazy?: boolean;
}

const LOAD_IMG_EVENT_TYPE = 'loadImage';
let observer = null;

const onIntersection = (
  entries: IntersectionObserverEntry[],
  io: IntersectionObserver,
) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (isIntersecting) {
      io.unobserve(target);
      target.dispatchEvent(new CustomEvent(LOAD_IMG_EVENT_TYPE));
    }
  });
};

const useLazyImageLoad = ({ isLazy, root, threshold, rootMargin }: Props) => {
  const [loaded, setLoaded] = useState(!isLazy);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!isLazy) {
      return;
    }

    const imgElement = ref.current;

    const handleLoadImage = () => {
      setLoaded(true);
    };

    if (imgElement) {
      imgElement.addEventListener(LOAD_IMG_EVENT_TYPE, handleLoadImage);
    }

    return () => {
      if (imgElement) {
        imgElement.removeEventListener(LOAD_IMG_EVENT_TYPE, handleLoadImage);
      }
    };
  }, [isLazy]);

  useEffect(() => {
    if (!isLazy || !ref.current) {
      return;
    }

    observer = new IntersectionObserver(onIntersection, {
      root,
      threshold,
      rootMargin,
    });

    observer.observe(ref.current);
  }, [isLazy, threshold, rootMargin, root]);

  return { ref, loaded };
};

export default useLazyImageLoad;
