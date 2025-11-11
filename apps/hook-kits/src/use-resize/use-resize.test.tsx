import { renderHook } from '@testing-library/react';

import useResize from '.';

describe('useResize Hook', () => {
  test('초기 rect는 null이다', () => {
    const { result } = renderHook(() => useResize());

    expect(result.current.rect).toBeNull();
  });
});
