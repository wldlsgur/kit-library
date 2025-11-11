import { act } from 'react';

import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import useCount from '.';

describe('useCount Hook', () => {
  test('초기 상태를 전달하지 않으면 1이 기본 상태다', () => {
    const { result } = renderHook(() => useCount());

    expect(result.current.count).toBe(1);
  });

  test('초기 상태가 매개변수로 설정된다', () => {
    const { result } = renderHook(() => useCount({ initialState: 10 }));

    expect(result.current.count).toBe(10);
  });

  test('초기 상태를 0이하로 주면 1로 설정된다', () => {
    const { result } = renderHook(() => useCount({ initialState: -1 }));

    expect(result.current.count).toBe(1);
  });

  test('limit가 설정되어있고 초기 상태가 limit를 초과하면 초기 상태가 limit로 설정된다', () => {
    const { result } = renderHook(() =>
      useCount({ initialState: 6, limit: 5 }),
    );

    expect(result.current.count).toBe(5);
  });

  test('increase를 호출하면 상태가 1 증가한다', () => {
    const { result } = renderHook(() => useCount({ initialState: 1 }));

    expect(result.current.count).toBe(1);

    act(() => {
      result.current.increase();
    });

    expect(result.current.count).toBe(2);
  });

  test('increase를 호출했을 때 limit를 초과하면 상태가 유지된다', () => {
    const { result } = renderHook(() =>
      useCount({ initialState: 2, limit: 2 }),
    );

    act(() => {
      result.current.increase();
    });

    expect(result.current.count).toBe(2);
  });

  test('decrease를 호출하면 상태가 1 감소한다', () => {
    const { result } = renderHook(() => useCount({ initialState: 5 }));

    act(() => {
      result.current.decrease();
    });

    expect(result.current.count).toBe(4);
  });

  test('decrease를 호출했을 때 0이하로 감소되면 1로 고정된다', () => {
    const { result } = renderHook(() => useCount({ initialState: 1 }));

    act(() => {
      result.current.decrease();
    });

    expect(result.current.count).toBe(1);
  });

  test('상태가 변경될 때마다 onChange 콜백함수가 실행된다', () => {
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useCount({ initialState: 1, onChange: callback }),
    );

    act(() => {
      result.current.increase();
    });

    expect(callback).toHaveBeenCalledWith(2);
    expect(result.current.count).toBe(2);

    act(() => {
      result.current.decrease();
    });

    expect(callback).toHaveBeenCalledWith(1);
    expect(result.current.count).toBe(1);
  });
});
