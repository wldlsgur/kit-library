import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import useSessionStorage from '.';

describe('useSessionStorage', () => {
  const key = 'test-key';

  beforeEach(() => {
    sessionStorage.clear();
  });

  test('기본값을 반환한다 (스토리지 비어 있음)', () => {
    const { result } = renderHook(() => useSessionStorage(key, 'default'));

    expect(result.current.value).toBe('default');
  });

  test('스토리지에 값이 있으면 그 값을 초기값으로 사용한다', () => {
    sessionStorage.setItem(key, JSON.stringify('stored'));

    const { result } = renderHook(() => useSessionStorage(key, 'default'));

    expect(result.current.value).toBe('stored');
  });

  test('setItem 호출 시 상태와 storage 둘 다 업데이트', () => {
    const { result } = renderHook(() => useSessionStorage(key, 'default'));

    act(() => {
      result.current.setItem('new-value');
    });

    expect(result.current.value).toBe('new-value');
    expect(sessionStorage.getItem(key)).toBe(JSON.stringify('new-value'));
  });

  test('removeItem 호출 시 값 초기화', () => {
    sessionStorage.setItem(key, JSON.stringify('stored'));

    const { result } = renderHook(() => useSessionStorage(key, 'default'));

    act(() => {
      result.current.removeItem();
    });

    expect(result.current.value).toBe('default');
    expect(sessionStorage.getItem(key)).toBe(null);
  });

  test('JSON parse 실패하면 default로 리턴', () => {
    sessionStorage.setItem(key, 'invalid-json'); // JSON.parse 에러 만들기

    const { result } = renderHook(() => useSessionStorage(key, 'default'));

    expect(result.current.value).toBe('default');
  });

  test('setItem 실패 시 default 값으로 롤백한다', () => {
    const { result } = renderHook(() => useSessionStorage(key, 'default'));

    const spy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementationOnce(() => {
        throw new Error('forced error');
      });

    act(() => {
      result.current.setItem('invalid-json');
    });

    expect(result.current.value).toBe('default');
    expect(sessionStorage.getItem(key)).toBe(JSON.stringify('default'));

    spy.mockRestore();
  });
});
