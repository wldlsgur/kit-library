import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import SwitchCase from '.';

describe('SwitchCase', () => {
  test('value에 해당하는 case를 렌더링한다', () => {
    render(
      <SwitchCase
        value='apple'
        cases={{
          apple: <span>사과</span>,
          banana: <span>바나나</span>,
        }}
      />,
    );

    expect(screen.getByText('사과')).toBeInTheDocument();
    expect(screen.queryByText('바나나')).not.toBeInTheDocument();
  });

  test('value가 변경되면 해당하는 case를 렌더링한다', () => {
    const { rerender } = render(
      <SwitchCase
        value='apple'
        cases={{
          apple: <span>사과</span>,
          banana: <span>바나나</span>,
        }}
      />,
    );

    expect(screen.getByText('사과')).toBeInTheDocument();

    rerender(
      <SwitchCase
        value='banana'
        cases={{
          apple: <span>사과</span>,
          banana: <span>바나나</span>,
        }}
      />,
    );

    expect(screen.getByText('바나나')).toBeInTheDocument();
    expect(screen.queryByText('사과')).not.toBeInTheDocument();
  });

  test('숫자 value도 처리할 수 있다', () => {
    render(
      <SwitchCase
        value={1}
        cases={{
          1: <span>첫 번째</span>,
          2: <span>두 번째</span>,
        }}
      />,
    );

    expect(screen.getByText('첫 번째')).toBeInTheDocument();
    expect(screen.queryByText('두 번째')).not.toBeInTheDocument();
  });

  test('case에 JSX 요소를 전달할 수 있다', () => {
    render(
      <SwitchCase
        value='status'
        cases={{
          status: (
            <div>
              <h1>제목</h1>
              <p>내용</p>
            </div>
          ),
        }}
      />,
    );

    expect(screen.getByText('제목')).toBeInTheDocument();
    expect(screen.getByText('내용')).toBeInTheDocument();
  });

  test('case에 문자열을 전달할 수 있다', () => {
    render(
      <SwitchCase
        value='greeting'
        cases={{
          greeting: '안녕하세요',
        }}
      />,
    );

    expect(screen.getByText('안녕하세요')).toBeInTheDocument();
  });

  test('defaultCase가 있어도 일치하는 case를 렌더링한다', () => {
    render(
      <SwitchCase
        value='apple'
        cases={{
          apple: <span>사과</span>,
          test: <span>테스트</span>,
        }}
        defaultCase={<span>기본값</span>}
      />,
    );

    expect(screen.getByText('사과')).toBeInTheDocument();
    expect(screen.queryByText('기본값')).not.toBeInTheDocument();
  });
});
