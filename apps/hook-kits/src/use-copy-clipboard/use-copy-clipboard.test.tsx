import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import useCopyClipBoard from '.';

describe('useCopyClipboard Hook', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('초기 상태값은 null이다', () => {
    const { result } = renderHook(() => useCopyClipBoard());

    expect(result.current.copiedText).toBeNull();
  });

  test('정상적으로 텍스트를 복사하면 copiedText가 갱신된다', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);

    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    const { result } = renderHook(() => useCopyClipBoard());

    await act(async () => {
      await result.current.copy('Hello world');
    });

    expect(writeTextMock).toHaveBeenCalledWith('Hello world');
    expect(result.current.copiedText).toBe('Hello world');
  });

  test('복사 중 에러가 발생하면 copiedText는 null로 유지된다', async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Copy failed'));

    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    const { result } = renderHook(() => useCopyClipBoard());

    await act(async () => {
      await result.current.copy('Oops');
    });

    expect(writeTextMock).toHaveBeenCalledWith('Oops');
    expect(result.current.copiedText).toBeNull();
  });

  test('navigator.clipboard가 없으면 경고를 출력하고 아무 일도 하지 않는다', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    Object.assign(navigator, { clipboard: undefined });

    const { result } = renderHook(() => useCopyClipBoard());

    await act(async () => {
      await result.current.copy('No clipboard');
    });

    expect(warnSpy).toHaveBeenCalledWith('Clipboard not supported');
    expect(result.current.copiedText).toBeNull();
  });
});
