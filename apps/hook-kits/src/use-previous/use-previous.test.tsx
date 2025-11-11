import { renderHook } from '@testing-library/react';

import usePrevious from '.';

describe('usePrevious', () => {
  test('초기에는 undefined 를 반환한다', () => {
    const { result } = renderHook(() => usePrevious(0));

    expect(result.current).toBeUndefined();
  });

  test('값 변화 시 이전 값을 반환한다', () => {
    let value = 0;
    const { result, rerender } = renderHook(() => usePrevious(value));

    expect(result.current).toBeUndefined();

    value = 1;
    rerender();

    expect(result.current).toBe(0);
  });

  test('계속 업데이트해도 직전 값이 들어온다', () => {
    let value = 0;
    const { result, rerender } = renderHook(() => usePrevious(value));

    expect(result.current).toBeUndefined();

    value = 1;
    rerender();
    expect(result.current).toBe(0);

    value = 2;
    rerender();
    expect(result.current).toBe(1);
  });
});
