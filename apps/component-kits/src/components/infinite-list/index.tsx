'use client';

import { ComponentProps, ReactNode } from 'react';

import useIntersectionObserver from '../../hooks/use-intersection-observer';

interface Props<T> extends ComponentProps<'ul'> {
  items?: T[];
  render: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  onIntersect: () => void;
  enabled?: boolean;
  observerOptions?: IntersectionObserverInit;
  liProps?: ComponentProps<'li'>;
}

const InfiniteList = <T,>({
  items,
  render,
  keyExtractor,
  liProps,
  onIntersect,
  enabled = true,
  observerOptions,
  ...rest
}: Props<T>) => {
  const observerRef = useIntersectionObserver({
    onIntersect,
    enabled: items && items.length > 0 && enabled,
    ...observerOptions,
  });

  return (
    <ul {...rest}>
      {items?.map((item, index) => (
        <li
          key={keyExtractor ? keyExtractor(item, index) : index}
          {...liProps}
        >
          {render(item, index)}
        </li>
      ))}
      {items && items.length > 0 && enabled && <div ref={observerRef} />}
    </ul>
  );
};

export default InfiniteList;
