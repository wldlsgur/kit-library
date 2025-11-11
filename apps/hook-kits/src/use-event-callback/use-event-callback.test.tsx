import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import useEventCallback from '.';

describe('useEventCallback Hook (stable version)', () => {
  test('항상 동일한 함수 참조를 반환한다', () => {
    const fn = vi.fn();
    const { result, rerender } = renderHook(({ cb }) => useEventCallback(cb), {
      initialProps: { cb: fn },
    });

    const firstReturn = result.current;

    rerender({ cb: vi.fn() });

    expect(result.current).toBe(firstReturn);
  });

  test('최신 callback을 호출한다', () => {
    const firstFn = vi.fn(() => 'first');
    const secondFn = vi.fn(() => 'second');

    const { result, rerender } = renderHook(({ cb }) => useEventCallback(cb), {
      initialProps: { cb: firstFn },
    });

    const stableFn = result.current;

    act(() => stableFn());
    expect(firstFn).toHaveBeenCalledTimes(1);
    expect(secondFn).not.toHaveBeenCalled();

    rerender({ cb: secondFn });

    act(() => stableFn());
    expect(secondFn).toHaveBeenCalledTimes(1);
    expect(firstFn).toHaveBeenCalledTimes(1);
  });
});
