import { renderHook } from '@testing-library/react';
import { describe, test } from 'vitest';

import useIsClient from '.';

describe('useIsClient Hook', () => {
  test('useEffect 호출 후 true를 반환한다', () => {
    const { result } = renderHook(() => useIsClient());

    expect(result.current).toBeTruthy();
  });
});
