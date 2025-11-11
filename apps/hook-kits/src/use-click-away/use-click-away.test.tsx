import { fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import useClickAway from '.';

interface Props {
  callback: (e?: Event) => void;
}

const TestComponent = ({ callback }: Props) => {
  const ref = useClickAway<HTMLDivElement>(callback);

  return (
    <div>
      <div ref={ref}>내부 요소</div>
      <div>외부 요소</div>
    </div>
  );
};

const BrokenComponent = ({ callback }: Props) => {
  useClickAway<HTMLDivElement>(callback);

  return (
    <div>
      <div>내부 요소</div>
      <div>외부 요소</div>
    </div>
  );
};

const mockCallback = vi.fn();

beforeEach(() => {
  mockCallback.mockClear();
});

describe('useClickAway Hook', () => {
  test('참조된 요소 외부에서 클릭이 발생하면 콜백함수가 호출된다.', () => {
    const { getByText } = render(<TestComponent callback={mockCallback} />);
    const outsideElement = getByText('외부 요소');

    fireEvent.click(outsideElement);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('참조된 요소 내부에서 클릭이 발생하면 콜백함수가 호출되지 않는다.', () => {
    const { getByText } = render(<TestComponent callback={mockCallback} />);
    const insideElement = getByText('내부 요소');

    fireEvent.click(insideElement);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('컴포넌트 언마운트 시 이벤트 리스너가 제거된다.', () => {
    const { getByText, unmount } = render(
      <TestComponent callback={mockCallback} />,
    );
    const outsideElement = getByText('외부 요소');

    unmount();

    fireEvent.click(outsideElement);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('ref가 null일 때 콜백함수가 호출되지 않는다.', () => {
    const { getByText } = render(<BrokenComponent callback={mockCallback} />);
    const outsideElement = getByText('외부 요소');

    fireEvent.click(outsideElement);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('언마운트 후에도 콜백함수가 호출되지 않는다.', () => {
    const { getByText, unmount } = render(
      <TestComponent callback={mockCallback} />,
    );
    const outsideElement = getByText('외부 요소');

    unmount();

    fireEvent.click(outsideElement);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('클릭 타겟이 HTMLElement가 아니면 콜백이 호출되지 않는다.', () => {
    render(<TestComponent callback={mockCallback} />);

    const fakeEvent = new MouseEvent('click', { bubbles: true });

    Object.defineProperty(fakeEvent, 'target', {
      value: 'not-an-element',
      writable: false,
    });

    document.dispatchEvent(fakeEvent);
    expect(mockCallback).not.toHaveBeenCalled();
  });
});
