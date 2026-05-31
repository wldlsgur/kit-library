import { PropsWithChildren, ReactNode } from 'react';

interface Props {
  isVisible: boolean;
  fallback?: ReactNode;
}

const VisibleGuard = ({
  isVisible,
  fallback = null,
  children,
}: PropsWithChildren<Props>) => {
  if (!isVisible) {
    return fallback;
  }

  return children;
};

export default VisibleGuard;
