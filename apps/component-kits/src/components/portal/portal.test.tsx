import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import Portal from '.';

describe('Portal', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'portal-root';
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  });

  test('children을 document.body에 렌더링한다', () => {
    render(
      <Portal>
        <span>포털 콘텐츠</span>
      </Portal>,
    );

    expect(screen.getByText('포털 콘텐츠')).toBeInTheDocument();
    expect(document.body.contains(screen.getByText('포털 콘텐츠'))).toBe(true);
  });

  test('지정된 DOM 요소에 children을 렌더링한다', () => {
    render(
      <Portal container={container}>
        <span>포털 콘텐츠</span>
      </Portal>,
    );

    expect(container.querySelector('span')).not.toBeNull();
    expect(container.textContent).toBe('포털 콘텐츠');
  });

  test('CSS 선택자로 지정된 컨테이너에 children을 렌더링한다', () => {
    render(
      <Portal container="#portal-root">
        <span>포털 콘텐츠</span>
      </Portal>,
    );

    expect(container.querySelector('span')).not.toBeNull();
    expect(container.textContent).toBe('포털 콘텐츠');
  });

  test('존재하지 않는 선택자이면 아무것도 렌더링하지 않는다', () => {
    render(
      <Portal container="#non-existent">
        <span>포털 콘텐츠</span>
      </Portal>,
    );

    expect(screen.queryByText('포털 콘텐츠')).not.toBeInTheDocument();
  });

  test('여러 children을 렌더링할 수 있다', () => {
    render(
      <Portal container={container}>
        <span>첫 번째</span>
        <span>두 번째</span>
      </Portal>,
    );

    expect(container.textContent).toContain('첫 번째');
    expect(container.textContent).toContain('두 번째');
  });

  test('언마운트 시 children을 제거한다', () => {
    const { unmount } = render(
      <Portal container={container}>
        <span>포털 콘텐츠</span>
      </Portal>,
    );

    expect(container.textContent).toBe('포털 콘텐츠');

    unmount();

    expect(container.textContent).toBe('');
  });

  test('container가 변경되면 새로운 컨테이너에 렌더링한다', () => {
    const newContainer = document.createElement('div');
    newContainer.id = 'new-portal-root';
    document.body.appendChild(newContainer);

    const { rerender } = render(
      <Portal container={container}>
        <span>포털 콘텐츠</span>
      </Portal>,
    );

    expect(container.textContent).toBe('포털 콘텐츠');

    rerender(
      <Portal container={newContainer}>
        <span>포털 콘텐츠</span>
      </Portal>,
    );

    expect(newContainer.textContent).toBe('포털 콘텐츠');
    expect(container.textContent).toBe('');

    document.body.removeChild(newContainer);
  });
});
