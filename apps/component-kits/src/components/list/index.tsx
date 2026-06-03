'use client';

import { ComponentProps, ReactNode } from 'react';
import clsx from 'clsx';

import * as styles from './list.css';

interface Props<T> extends ComponentProps<'ul'>, styles.ListVariants {
  items?: T[];
  render: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  liProps?: ComponentProps<'li'> & { [key: `data-${string}`]: string };
}

const List = <T,>({
  items,
  render,
  keyExtractor,
  direction,
  className,
  liProps,
  ...rest
}: Props<T>) => {
  return (
    <ul
      className={clsx(styles.listContainer({ direction }), className)}
      {...rest}
    >
      {items?.map((item, index) => {
        const props: ComponentProps<'li'> = {
          key: keyExtractor ? keyExtractor(item, index) : index,
          ...liProps,
        };

        return <li {...props}>{render(item, index)}</li>;
      })}
    </ul>
  );
};

export default List;
