import { act, renderHook } from '@testing-library/react';
import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest';

import useRafState from '.';

const rafSpy = vi
  .spyOn(global, 'requestAnimationFrame')
  .mockImplementation(() => 1);

const cancelSpy = vi
  .spyOn(global, 'cancelAnimationFrame')
  .mockImplementation(() => {});

beforeEach(() => {
  rafSpy.mockClear();
  cancelSpy.mockClear();
});

afterAll(() => {
  rafSpy.mockRestore();
  cancelSpy.mockRestore();
});

describe('useRafState Hook', () => {
  test('초기 값이 설정된다.', () => {
    const { result } = renderHook(() => useRafState(0));

    expect(result.current.state).toBe(0);
  });

  test('setRafState를 연속으로 호출하면 첫 호출은 requestAnimationFrame이 호출되고 이후 호출은 cancelAnimationFrame과 requestAnimationFrame이 호출된다.', () => {
    const { result } = renderHook(() => useRafState(0));

    expect(rafSpy).not.toHaveBeenCalled();
    expect(cancelSpy).not.toHaveBeenCalled();

    act(() => {
      result.current.setRafState(1);
    });

    expect(cancelSpy).toHaveBeenCalledTimes(0);
    expect(rafSpy).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.setRafState(1);
    });

    expect(cancelSpy).toHaveBeenCalledTimes(1);
    expect(rafSpy).toHaveBeenCalledTimes(2);
  });
});
