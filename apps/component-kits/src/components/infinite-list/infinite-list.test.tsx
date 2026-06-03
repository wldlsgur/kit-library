import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import InfiniteList from '.';

let intersectionCallback: (entries: Partial<IntersectionObserverEntry>[]) => void;
let constructorOptions: IntersectionObserverInit | undefined;
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  mockObserve.mockClear();
  mockDisconnect.mockClear();
  constructorOptions = undefined;

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(
        callback: (entries: Partial<IntersectionObserverEntry>[]) => void,
        options?: IntersectionObserverInit,
      ) {
        intersectionCallback = callback;
        constructorOptions = options;
      }
      observe = mockObserve;
      disconnect = mockDisconnect;
      unobserve = vi.fn();
    },
  );
});

describe('InfiniteList', () => {
  const items = ['사과', '바나나', '체리'];

  test('items 배열을 렌더링한다', () => {
    render(
      <InfiniteList
        items={items}
        render={(item) => <span>{item}</span>}
        onIntersect={vi.fn()}
      />,
    );

    expect(screen.getByText('사과')).toBeInTheDocument();
    expect(screen.getByText('바나나')).toBeInTheDocument();
    expect(screen.getByText('체리')).toBeInTheDocument();
  });

  test('각 항목을 li 요소로 감싼다', () => {
    render(
      <InfiniteList
        items={items}
        render={(item) => <span>{item}</span>}
        onIntersect={vi.fn()}
      />,
    );

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  test('items가 1개 이상이면 감지용 div를 렌더링한다', () => {
    const { container } = render(
      <InfiniteList
        items={items}
        render={(item) => <span>{item}</span>}
        onIntersect={vi.fn()}
      />,
    );

    const observerDiv = container.querySelector('ul > div');
    expect(observerDiv).not.toBeNull();
    expect(mockObserve).toHaveBeenCalledTimes(1);
  });

  test('items가 빈 배열이면 감지용 div를 렌더링하지 않는다', () => {
    const { container } = render(
      <InfiniteList
        items={[]}
        render={(item: string) => <span>{item}</span>}
        onIntersect={vi.fn()}
      />,
    );

    const observerDiv = container.querySelector('ul > div');
    expect(observerDiv).toBeNull();
    expect(mockObserve).not.toHaveBeenCalled();
  });

  test('enabled가 false이면 감지용 div를 렌더링하지 않는다', () => {
    const { container } = render(
      <InfiniteList
        items={items}
        render={(item) => <span>{item}</span>}
        onIntersect={vi.fn()}
        enabled={false}
      />,
    );

    const observerDiv = container.querySelector('ul > div');
    expect(observerDiv).toBeNull();
  });

  test('감지용 div가 뷰포트에 진입하면 onIntersect를 호출한다', () => {
    const onIntersect = vi.fn();

    render(
      <InfiniteList
        items={items}
        render={(item) => <span>{item}</span>}
        onIntersect={onIntersect}
      />,
    );

    intersectionCallback([{ isIntersecting: true }]);

    expect(onIntersect).toHaveBeenCalledTimes(1);
  });

  test('감지용 div가 뷰포트를 벗어나면 onIntersect를 호출하지 않는다', () => {
    const onIntersect = vi.fn();

    render(
      <InfiniteList
        items={items}
        render={(item) => <span>{item}</span>}
        onIntersect={onIntersect}
      />,
    );

    intersectionCallback([{ isIntersecting: false }]);

    expect(onIntersect).not.toHaveBeenCalled();
  });

  test('keyExtractor로 key를 생성한다', () => {
    const keyExtractor = vi.fn((item: string) => `key-${item}`);

    render(
      <InfiniteList
        items={items}
        render={(item) => <span>{item}</span>}
        keyExtractor={keyExtractor}
        onIntersect={vi.fn()}
      />,
    );

    expect(keyExtractor).toHaveBeenCalledTimes(3);
    expect(keyExtractor).toHaveBeenCalledWith('사과', 0);
    expect(keyExtractor).toHaveBeenCalledWith('바나나', 1);
    expect(keyExtractor).toHaveBeenCalledWith('체리', 2);
  });

  test('추가 props를 ul 요소에 전달한다', () => {
    render(
      <InfiniteList
        items={items}
        render={(item) => <span>{item}</span>}
        onIntersect={vi.fn()}
        data-testid="infinite-list"
        aria-label="무한 스크롤 목록"
      />,
    );

    const list = screen.getByTestId('infinite-list');
    expect(list).toHaveAttribute('aria-label', '무한 스크롤 목록');
  });

  test('observerOptions를 IntersectionObserver에 전달한다', () => {
    const root = document.createElement('div');

    render(
      <InfiniteList
        items={items}
        render={(item) => <span>{item}</span>}
        onIntersect={vi.fn()}
        observerOptions={{ root, rootMargin: '100px', threshold: 0.5 }}
      />,
    );

    expect(constructorOptions).toEqual({
      root,
      rootMargin: '100px',
      threshold: 0.5,
    });
  });

  test('언마운트 시 observer를 disconnect한다', () => {
    const { unmount } = render(
      <InfiniteList
        items={items}
        render={(item) => <span>{item}</span>}
        onIntersect={vi.fn()}
      />,
    );

    unmount();

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
