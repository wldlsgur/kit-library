import { ChangeEvent } from 'react';

import { act, renderHook } from '@testing-library/react';

import useInput from '.';

const event = {
  target: { name: 'name', value: 'value' },
} as ChangeEvent<HTMLInputElement>;

describe('useInput', () => {
  test('초기값을 올바르게 설정한다', () => {
    const { result } = renderHook(() => useInput(''));

    expect(result.current.value).toBe('');
  });

  test('handleInputChange로 단일 값이 변경된다', () => {
    const { result } = renderHook(() => useInput(''));

    act(() => {
      result.current.handleInputChange(event);
    });

    expect(result.current.value).toBe('value');
  });

  test('handleFieldChange로 객체 필드 값이 변경된다', () => {
    const { result } = renderHook(() => useInput({ name: '' }));

    act(() => {
      result.current.handleFieldChange(event);
    });

    expect(result.current.value).toEqual({
      name: 'value',
    });
  });

  test('resetValue로 초기값으로 돌아간다', () => {
    const initialValue = { name: '' };
    const { result } = renderHook(() => useInput(initialValue));

    act(() => {
      result.current.handleFieldChange(event);
    });

    expect(result.current.value).toEqual({
      name: 'value',
    });

    act(() => {
      result.current.resetValue();
    });

    expect(result.current.value).toEqual(initialValue);
  });
});
