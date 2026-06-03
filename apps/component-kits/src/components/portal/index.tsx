'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  container?: Element | string;
}

const Portal = ({ container, children }: PropsWithChildren<Props>) => {
  const [mountNode, setMountNode] = useState<Element | null>(null);

  useEffect(() => {
    if (container instanceof Element) {
      setMountNode(container);
      return;
    }

    const target = container
      ? document.querySelector(container)
      : document.body;

    setMountNode(target);
  }, [container]);

  if (!mountNode) {
    return null;
  }

  return createPortal(children, mountNode);
};

export default Portal;
