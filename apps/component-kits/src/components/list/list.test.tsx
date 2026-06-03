import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import List from '.';

describe('List', () => {
  const items = ['사과', '바나나', '체리'];

  test('items 배열의 각 항목을 렌더링한다', () => {
    render(
      <List
        items={items}
        render={(item) => <span>{item}</span>}
      />,
    );

    expect(screen.getByText('사과')).toBeInTheDocument();
    expect(screen.getByText('바나나')).toBeInTheDocument();
    expect(screen.getByText('체리')).toBeInTheDocument();
  });

  test('각 항목을 li 요소로 감싼다', () => {
    render(
      <List
        items={items}
        render={(item) => <span>{item}</span>}
      />,
    );

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  test('ul 요소를 렌더링한다', () => {
    render(
      <List
        items={items}
        render={(item) => <span>{item}</span>}
      />,
    );

    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  test('items가 undefined이면 아무 항목도 렌더링하지 않는다', () => {
    render(<List render={(item: string) => <span>{item}</span>} />);

    const list = screen.getByRole('list');
    expect(list.children).toHaveLength(0);
  });

  test('빈 배열이면 아무 항목도 렌더링하지 않는다', () => {
    render(
      <List
        items={[]}
        render={(item: string) => <span>{item}</span>}
      />,
    );

    const list = screen.getByRole('list');
    expect(list.children).toHaveLength(0);
  });

  test('render 함수에 item과 index를 전달한다', () => {
    const renderFn = vi.fn((item: string, index: number) => (
      <span>{`${index}-${item}`}</span>
    ));

    render(
      <List
        items={items}
        render={renderFn}
      />,
    );

    expect(renderFn).toHaveBeenCalledTimes(3);
    expect(renderFn).toHaveBeenCalledWith('사과', 0);
    expect(renderFn).toHaveBeenCalledWith('바나나', 1);
    expect(renderFn).toHaveBeenCalledWith('체리', 2);
  });

  test('keyExtractor가 제공되면 해당 함수로 key를 생성한다', () => {
    const keyExtractor = vi.fn((item: string) => `key-${item}`);

    render(
      <List
        items={items}
        render={(item) => <span>{item}</span>}
        keyExtractor={keyExtractor}
      />,
    );

    expect(keyExtractor).toHaveBeenCalledTimes(3);
    expect(keyExtractor).toHaveBeenCalledWith('사과', 0);
    expect(keyExtractor).toHaveBeenCalledWith('바나나', 1);
    expect(keyExtractor).toHaveBeenCalledWith('체리', 2);
  });

  test('liProps를 li 요소에 전달한다', () => {
    render(
      <List
        items={items}
        render={(item) => <span>{item}</span>}
        liProps={{ 'data-testid': 'list-item' }}
      />,
    );

    const listItems = screen.getAllByTestId('list-item');
    expect(listItems).toHaveLength(3);
  });

  test('추가 props를 ul 요소에 전달한다', () => {
    render(
      <List
        items={items}
        render={(item) => <span>{item}</span>}
        data-testid='custom-list'
        aria-label='과일 목록'
      />,
    );

    const list = screen.getByTestId('custom-list');
    expect(list).toHaveAttribute('aria-label', '과일 목록');
  });

  test('className을 ul 요소에 추가한다', () => {
    render(
      <List
        items={items}
        render={(item) => <span>{item}</span>}
        className='custom-class'
        data-testid='list'
      />,
    );

    const list = screen.getByTestId('list');
    expect(list.className).toContain('custom-class');
  });

  test('객체 배열도 렌더링할 수 있다', () => {
    const users = [
      { id: 1, name: '홍길동' },
      { id: 2, name: '김철수' },
    ];

    render(
      <List
        items={users}
        render={(user) => <span>{user.name}</span>}
        keyExtractor={(user) => user.id}
      />,
    );

    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('김철수')).toBeInTheDocument();
  });
});
