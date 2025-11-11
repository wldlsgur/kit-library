import { renderHook } from '@testing-library/react';
import { describe, test } from 'vitest';

import useMount from '.';

describe('useMount Hook', () => {
  test('마운트 후 true를 반환한다', () => {
    const { result } = renderHook(() => useMount());

    expect(result.current).toBeTruthy();
  });
});
