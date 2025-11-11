import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import useWheel from '.';

describe('useWheel Hook', () => {
  test('초기 상태값은 false가 된다', () => {
    const { result } = renderHook(() => useWheel());

    expect(result.current.isWheel).toBe(false);
  });

  test('handleWheelTrue를 호출하면 true가 된다', () => {
    const { result } = renderHook(() => useWheel());

    act(() => {
      result.current.handleWheelTrue();
    });

    expect(result.current.isWheel).toBe(true);
  });

  test('handleWheelFalse 호출하면 false가 된다', () => {
    const { result } = renderHook(() => useWheel());

    act(() => {
      result.current.handleWheelFalse();
    });

    expect(result.current.isWheel).toBe(false);
  });

  test('handleWheelTrue를 호출 후 true가 되고 후에 handleWheelFalse 호출하면 false가 된다 ', () => {
    const { result } = renderHook(() => useWheel());

    act(() => {
      result.current.handleWheelTrue();
    });

    expect(result.current.isWheel).toBe(true);

    act(() => {
      result.current.handleWheelFalse();
    });

    expect(result.current.isWheel).toBe(false);
  });
});
