import { act, renderHook } from '@testing-library/react';
import { describe } from 'vitest';

import useToggle from '.';

describe('useToggle Hook', () => {
  test('초기 값은 false다', () => {
    const { result } = renderHook(() => useToggle());

    expect(result.current.isToggle).toBe(false);
  });

  test('initialState값을 true 전달하면 초기 값은 true다', () => {
    const { result } = renderHook(() => useToggle(true));

    expect(result.current.isToggle).toBe(true);
  });

  test('initialState값을 false 전달하면 초기 값은 false다', () => {
    const { result } = renderHook(() => useToggle(false));

    expect(result.current.isToggle).toBe(false);
  });

  test('handleSetFalse를 호출하면 false가 된다', () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current.handleSetFalse();
    });

    expect(result.current.isToggle).toBe(false);
  });

  test('handleSetTrue를 호출하면 true가 된다', () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current.handleSetTrue();
    });

    expect(result.current.isToggle).toBe(true);
  });

  test('handleSetBoolean을 호출하여 boolean값을 매개변수로 전달하면 해당 값이 된다', () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current.handleSetBoolean(true);
    });

    expect(result.current.isToggle).toBe(true);

    act(() => {
      result.current.handleSetBoolean(false);
    });

    expect(result.current.isToggle).toBe(false);
  });

  test('handleToggle를 호출하면 현재 상태와 반대 값이 된다', () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current.handleToggle();
    });

    expect(result.current.isToggle).toBe(true);

    act(() => {
      result.current.handleToggle();
    });

    expect(result.current.isToggle).toBe(false);
  });
});
