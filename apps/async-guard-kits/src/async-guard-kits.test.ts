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

describe('async-guard-kits', () => {
  it('async 함수 선언문을 try-catch로 감싼다', () => {
    const input = 'async function fetchData() { await fetch("/api"); }';
    const output = transform(input);

    expect(output).toContain('try');
    expect(output).toContain('catch');
    expect(output).toContain('console.error');
  });

  it('async 화살표 함수를 try-catch로 감싼다', () => {
    const input = 'const fn = async () => { await fetch("/api"); };';
    const output = transform(input);

    expect(output).toContain('try');
    expect(output).toContain('catch');
  });

  it('async 화살표 함수의 표현식 본문을 처리한다', () => {
    const input = 'const fn = async () => fetch("/api");';
    const output = transform(input);

    expect(output).toContain('try');
    expect(output).toContain('catch');
    expect(output).toContain('return');
  });

  it('async 함수 표현식을 try-catch로 감싼다', () => {
    const input = 'const fn = async function() { await fetch("/api"); };';
    const output = transform(input);

    expect(output).toContain('try');
    expect(output).toContain('catch');
  });

  it('async 클래스 메서드를 try-catch로 감싼다', () => {
    const input = `
      class Api {
        async getData() {
          await fetch("/api");
        }
      }
    `;
    const output = transform(input);

    expect(output).toContain('try');
    expect(output).toContain('catch');
  });

  it('async 객체 메서드를 try-catch로 감싼다', () => {
    const input = `
      const obj = {
        async getData() {
          await fetch("/api");
        }
      };
    `;
    const output = transform(input);

    expect(output).toContain('try');
    expect(output).toContain('catch');
  });

  it('일반 함수는 변환하지 않는다', () => {
    const input = 'function fetchData() { fetch("/api"); }';
    const output = transform(input);

    expect(output).not.toContain('try');
    expect(output).not.toContain('catch');
  });

  it('이미 try-catch로 감싸진 함수는 스킵한다', () => {
    const input =
      'async function fetchData() { try { await fetch("/api"); } catch(e) { handleError(e); } }';
    const output = transform(input);
    const tryCount = (output?.match(/try/g) || []).length;

    expect(tryCount).toBe(1);
  });

  it('커스텀 핸들러를 사용할 수 있다', () => {
    const input = 'async function fetchData() { await fetch("/api"); }';
    const output = transform(input, { handler: 'errorHandler' });

    expect(output).toContain('errorHandler');
    expect(output).not.toContain('console.error');
  });

  it('점 표기법 핸들러를 지원한다', () => {
    const input = 'async function fetchData() { await fetch("/api"); }';
    const output = transform(input, { handler: 'Sentry.captureException' });

    expect(output).toContain('Sentry');
    expect(output).toContain('captureException');
  });
});
