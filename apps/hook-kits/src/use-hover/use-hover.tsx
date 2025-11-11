import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import useHover from '.';

describe('useHover', () => {
  test('초기 상태는 hover되지 않은 상태여야 한다', () => {
    const { result } = renderHook(() => useHover<HTMLDivElement>());

    expect(result.current.isHover).toBeFalsy();
  });

  test('ref가 DOM 요소에 연결된 후 mouseover 이벤트 발생 시 isHover가 true가 된다', () => {
    const { result } = renderHook(() => useHover<HTMLDivElement>());

    const div = document.createElement('div');

    result.current.ref.current = div;

    act(() => {
      div.dispatchEvent(new Event('mouseover'));
    });

    expect(result.current.isHover).toBeTruthy();
  });

  test('mouseout 이벤트 발생 시 isHover가 false로 돌아간다', () => {
    const { result } = renderHook(() => useHover<HTMLDivElement>());

    const div = document.createElement('div');

    result.current.ref.current = div;

    act(() => {
      div.dispatchEvent(new Event('mouseover'));
    });

    expect(result.current.isHover).toBeTruthy();

    act(() => {
      div.dispatchEvent(new Event('mouseout'));
    });

    expect(result.current.isHover).toBeFalsy();
  });

  test('정상적으로 이벤트 리스너가 클린업된다', () => {
    const addSpy = vi.spyOn(HTMLElement.prototype, 'addEventListener');
    const removeSpy = vi.spyOn(HTMLElement.prototype, 'removeEventListener');

    const { unmount } = renderHook(() => useHover<HTMLDivElement>());

    unmount();

    expect(addSpy).toHaveBeenCalledWith('mouseover', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('mouseout', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('mouseover', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('mouseout', expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
