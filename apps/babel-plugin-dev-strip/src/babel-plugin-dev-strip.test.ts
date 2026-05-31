import { transformSync } from '@babel/core';
import { describe, expect, it } from 'vitest';

import plugin from './index';

const transform = (code: string, options = {}) => {
  const result = transformSync(code, {
    plugins: [[plugin, options]],
    configFile: false,
  });

  return result?.code;
};

describe('babel-plugin-dev-strip', () => {
  it('@dev-only가 붙은 if 블록을 제거한다', () => {
    const input = `
      // @dev-only
      if (window.__DEBUG__) {
        renderDebugOverlay();
      }
      doSomething();
    `;
    const output = transform(input);

    expect(output).not.toContain('__DEBUG__');
    expect(output).not.toContain('renderDebugOverlay');
    expect(output).toContain('doSomething');
  });

  it('@dev-only가 붙은 표현식을 제거한다', () => {
    const input = `
      // @dev-only
      console.log('debug info:', data);
      process(data);
    `;
    const output = transform(input);

    expect(output).not.toContain('console.log');
    expect(output).not.toContain('debug info');
    expect(output).toContain('process(data)');
  });

  it('@dev-only가 붙은 변수 선언을 제거한다', () => {
    const input = `
      // @dev-only
      const debugInfo = computeDebugInfo();
      const result = compute();
    `;
    const output = transform(input);

    expect(output).not.toContain('debugInfo');
    expect(output).not.toContain('computeDebugInfo');
    expect(output).toContain('compute');
  });

  it('@dev-only가 붙은 함수 선언을 제거한다', () => {
    const input = `
      // @dev-only
      function debugHelper() {
        return 'debug';
      }
      function main() {
        return 'main';
      }
    `;
    const output = transform(input);

    expect(output).not.toContain('debugHelper');
    expect(output).toContain('main');
  });

  it('@dev-only가 없는 코드는 그대로 유지한다', () => {
    const input = `
      console.log('production log');
      if (condition) {
        doWork();
      }
    `;
    const output = transform(input);

    expect(output).toContain('production log');
    expect(output).toContain('doWork');
  });

  it('여러 @dev-only 블록을 모두 제거한다', () => {
    const input = `
      // @dev-only
      console.log('debug 1');
      doWork();
      // @dev-only
      console.log('debug 2');
    `;
    const output = transform(input);

    expect(output).not.toContain('debug 1');
    expect(output).not.toContain('debug 2');
    expect(output).toContain('doWork');
  });

  it('블록 주석 /* @dev-only */ 도 처리한다', () => {
    const input = `
      /* @dev-only */
      console.log('debug');
      doWork();
    `;
    const output = transform(input);

    expect(output).not.toContain('debug');
    expect(output).toContain('doWork');
  });

  it('커스텀 디렉티브를 지원한다', () => {
    const input = `
      // @test-only
      setupMocks();
      runApp();
    `;
    const output = transform(input, { directive: '@test-only' });

    expect(output).not.toContain('setupMocks');
    expect(output).toContain('runApp');
  });

  it('클래스 메서드에서 @dev-only를 제거한다', () => {
    const input = `
      class App {
        // @dev-only
        debugMethod() {
          return 'debug';
        }
        run() {
          return 'run';
        }
      }
    `;
    const output = transform(input);

    expect(output).not.toContain('debugMethod');
    expect(output).toContain('run');
  });

  it('객체 프로퍼티에서 @dev-only를 제거한다', () => {
    const input = `
      const config = {
        // @dev-only
        debug: true,
        production: true,
      };
    `;
    const output = transform(input);

    expect(output).not.toContain('debug');
    expect(output).toContain('production');
  });
});
