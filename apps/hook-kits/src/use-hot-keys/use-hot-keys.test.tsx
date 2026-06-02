import { fireEvent, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import useHotKeys from '.';

const mockCallback = vi.fn();

beforeEach(() => {
  mockCallback.mockClear();
});

describe('useHotKeys Hook', () => {
  describe('modifier + 일반 키', () => {
    test('키 조합이 일치하면 콜백이 호출된다.', () => {
      renderHook(() =>
        useHotKeys({ keys: ['Ctrl', 's'], callback: mockCallback }),
      );

      fireEvent.keyDown(window, { key: 's', ctrlKey: true });

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test('일반 키가 다르면 콜백이 호출되지 않는다.', () => {
      renderHook(() =>
        useHotKeys({ keys: ['Ctrl', 's'], callback: mockCallback }),
      );

      fireEvent.keyDown(window, { key: 'a', ctrlKey: true });

      expect(mockCallback).not.toHaveBeenCalled();
    });

    test('modifier가 눌리지 않으면 콜백이 호출되지 않는다.', () => {
      renderHook(() =>
        useHotKeys({ keys: ['Ctrl', 's'], callback: mockCallback }),
      );

      fireEvent.keyDown(window, { key: 's' });

      expect(mockCallback).not.toHaveBeenCalled();
    });

    test('등록하지 않은 modifier가 함께 눌리면 콜백이 호출되지 않는다.', () => {
      renderHook(() =>
        useHotKeys({ keys: ['Ctrl', 's'], callback: mockCallback }),
      );

      fireEvent.keyDown(window, { key: 's', ctrlKey: true, shiftKey: true });

      expect(mockCallback).not.toHaveBeenCalled();
    });

    test('여러 modifier 조합을 지원한다.', () => {
      renderHook(() =>
        useHotKeys({ keys: ['Ctrl', 'Shift', 'k'], callback: mockCallback }),
      );

      fireEvent.keyDown(window, { key: 'k', ctrlKey: true, shiftKey: true });

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('일반 키 단독', () => {
    test('등록한 키가 눌리면 콜백이 호출된다.', () => {
      renderHook(() =>
        useHotKeys({ keys: ['Escape'], callback: mockCallback }),
      );

      fireEvent.keyDown(window, { key: 'Escape' });

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test('다른 키가 눌리면 콜백이 호출되지 않는다.', () => {
      renderHook(() =>
        useHotKeys({ keys: ['Escape'], callback: mockCallback }),
      );

      fireEvent.keyDown(window, { key: 'Enter' });

      expect(mockCallback).not.toHaveBeenCalled();
    });

    test('modifier가 함께 눌리면 콜백이 호출되지 않는다.', () => {
      renderHook(() =>
        useHotKeys({ keys: ['Escape'], callback: mockCallback }),
      );

      fireEvent.keyDown(window, { key: 'Escape', ctrlKey: true });

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('modifier 단독', () => {
    test('등록한 modifier만 눌리면 콜백이 호출된다.', () => {
      renderHook(() => useHotKeys({ keys: ['Ctrl'], callback: mockCallback }));

      fireEvent.keyDown(window, { key: 'Control', ctrlKey: true });

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('대소문자 무시', () => {
    test('keys 배열의 대소문자와 관계없이 매칭된다.', () => {
      renderHook(() =>
        useHotKeys({ keys: ['Ctrl', 'S'], callback: mockCallback }),
      );

      fireEvent.keyDown(window, { key: 's', ctrlKey: true });

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('정리 및 부수효과', () => {
    test('언마운트 시 이벤트 리스너가 제거된다.', () => {
      const { unmount } = renderHook(() =>
        useHotKeys({ keys: ['Ctrl', 's'], callback: mockCallback }),
      );

      unmount();

      fireEvent.keyDown(window, { key: 's', ctrlKey: true });

      expect(mockCallback).not.toHaveBeenCalled();
    });

    test('매칭 시 preventDefault가 호출된다.', () => {
      renderHook(() =>
        useHotKeys({ keys: ['Ctrl', 's'], callback: mockCallback }),
      );

      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        bubbles: true,
      });
      const spy = vi.spyOn(event, 'preventDefault');

      window.dispatchEvent(event);

      expect(spy).toHaveBeenCalled();
    });
  });
});
