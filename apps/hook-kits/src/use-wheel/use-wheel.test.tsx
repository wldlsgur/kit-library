import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import useWheel from '.';

describe('useWheel Hook', () => {
  test('초기 상태값은 false가 된다', () => {
    const { result } = renderHook(() => useWheel());

    expect(result.current.isWheel).toBe(false);
  });
});
