import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import useScrollToTop from '.';

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

describe('useScrollToTop Hook', () => {
  test('마운트 시 scrollTo가 호출된다.', () => {
    renderHook(() => useScrollToTop('/home'));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  test('의존값이 변경되면 scrollTo가 다시 호출된다.', () => {
    const { rerender } = renderHook(({ dep }) => useScrollToTop(dep), {
      initialProps: { dep: '/home' },
    });

    vi.mocked(window.scrollTo).mockClear();

    rerender({ dep: '/about' });

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  test('의존값이 같으면 scrollTo가 다시 호출되지 않는다.', () => {
    const { rerender } = renderHook(({ dep }) => useScrollToTop(dep), {
      initialProps: { dep: '/home' },
    });

    vi.mocked(window.scrollTo).mockClear();

    rerender({ dep: '/home' });

    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
