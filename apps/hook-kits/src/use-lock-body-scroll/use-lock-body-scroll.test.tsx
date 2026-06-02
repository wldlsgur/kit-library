import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';

import useLockBodyScroll from '.';

beforeEach(() => {
  document.body.style.overflow = '';
});

describe('useLockBodyScroll Hook', () => {
  test('마운트 시 body overflow가 hidden으로 설정된다.', () => {
    renderHook(() => useLockBodyScroll());

    expect(document.body.style.overflow).toBe('hidden');
  });

  test('언마운트 시 body overflow가 원래 값으로 복원된다.', () => {
    document.body.style.overflow = 'auto';

    const { unmount } = renderHook(() => useLockBodyScroll());

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('auto');
  });

  test('locked가 false이면 overflow를 변경하지 않는다.', () => {
    document.body.style.overflow = 'auto';

    renderHook(() => useLockBodyScroll(false));

    expect(document.body.style.overflow).toBe('auto');
  });

  test('locked가 true에서 false로 바뀌면 overflow가 복원된다.', () => {
    document.body.style.overflow = 'auto';

    const { rerender } = renderHook(({ locked }) => useLockBodyScroll(locked), {
      initialProps: { locked: true },
    });

    expect(document.body.style.overflow).toBe('hidden');

    rerender({ locked: false });

    expect(document.body.style.overflow).toBe('auto');
  });

  test('기본값은 locked가 true이다.', () => {
    renderHook(() => useLockBodyScroll());

    expect(document.body.style.overflow).toBe('hidden');
  });
});
