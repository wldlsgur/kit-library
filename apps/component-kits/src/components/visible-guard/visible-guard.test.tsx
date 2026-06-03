import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import VisibleGuard from '.';

describe('VisibleGuard', () => {
  test('isVisible이 true이면 children을 렌더링한다', () => {
    render(
      <VisibleGuard isVisible={true}>
        <span>보이는 콘텐츠</span>
      </VisibleGuard>,
    );

    expect(screen.getByText('보이는 콘텐츠')).toBeInTheDocument();
  });

  test('isVisible이 false이면 children을 렌더링하지 않는다', () => {
    render(
      <VisibleGuard isVisible={false}>
        <span>숨겨진 콘텐츠</span>
      </VisibleGuard>,
    );

    expect(screen.queryByText('숨겨진 콘텐츠')).not.toBeInTheDocument();
  });

  test('isVisible이 false이고 fallback이 없으면 null을 반환한다', () => {
    const { container } = render(
      <VisibleGuard isVisible={false}>
        <span>콘텐츠</span>
      </VisibleGuard>,
    );

    expect(container.innerHTML).toBe('');
  });

  test('isVisible이 false이면 fallback을 렌더링한다', () => {
    render(
      <VisibleGuard isVisible={false} fallback={<span>대체 콘텐츠</span>}>
        <span>원본 콘텐츠</span>
      </VisibleGuard>,
    );

    expect(screen.getByText('대체 콘텐츠')).toBeInTheDocument();
    expect(screen.queryByText('원본 콘텐츠')).not.toBeInTheDocument();
  });

  test('isVisible이 true이면 fallback을 렌더링하지 않는다', () => {
    render(
      <VisibleGuard isVisible={true} fallback={<span>대체 콘텐츠</span>}>
        <span>원본 콘텐츠</span>
      </VisibleGuard>,
    );

    expect(screen.getByText('원본 콘텐츠')).toBeInTheDocument();
    expect(screen.queryByText('대체 콘텐츠')).not.toBeInTheDocument();
  });

  test('fallback으로 문자열을 전달할 수 있다', () => {
    render(
      <VisibleGuard isVisible={false} fallback="로딩 중...">
        <span>콘텐츠</span>
      </VisibleGuard>,
    );

    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  test('여러 children을 렌더링할 수 있다', () => {
    render(
      <VisibleGuard isVisible={true}>
        <span>첫 번째</span>
        <span>두 번째</span>
      </VisibleGuard>,
    );

    expect(screen.getByText('첫 번째')).toBeInTheDocument();
    expect(screen.getByText('두 번째')).toBeInTheDocument();
  });
});
