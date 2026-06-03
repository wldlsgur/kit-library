'use client';

import { ReactNode } from 'react';

interface Props {
  value: string | number;
  cases: Record<string | number, ReactNode>;
  defaultCase?: ReactNode;
}

const SwitchCase = ({ value, cases, defaultCase = null }: Props) => {
  return <>{cases[value] ?? defaultCase}</>;
};

export default SwitchCase;
