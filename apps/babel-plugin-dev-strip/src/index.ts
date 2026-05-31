import type { PluginObj, NodePath } from '@babel/core';
import type * as BabelTypes from '@babel/types';

interface Options {
  directive?: string;
}

const devStripPlugin = (
  _api: { types: typeof BabelTypes },
  options: Options,
): PluginObj => {
  const directive = options.directive ?? '@dev-only';

  /**
   * 노드의 선행 주석(leading comments) 중 디렉티브가 포함되어 있는지 확인
   * 예: // @dev-only 또는 /* @dev-only *\/
   */
  const hasDirective = (node: BabelTypes.Node): boolean =>
    (node.leadingComments ?? []).some(
      (comment) => comment.value.trim() === directive,
    );

  /**
   * 디렉티브 주석을 제거한 뒤 해당 노드를 AST에서 삭제
   * 주석을 먼저 제거하지 않으면 인접 노드에 주석이 옮겨붙을 수 있음
   */
  const removeWithComments = (path: NodePath<BabelTypes.Node>) => {
    const node = path.node;
    const comments = node.leadingComments;

    // 디렉티브 주석만 필터링하여 제거 (다른 주석은 보존)
    if (comments) {
      node.leadingComments = comments.filter(
        (comment) => comment.value.trim() !== directive,
      );
    }

    // AST에서 노드 자체를 삭제
    path.remove();
  };

  return {
    name: 'babel-plugin-dev-strip',
    visitor: {
      // if문, 표현식, 변수 선언, 함수 선언 등 모든 Statement 처리
      Statement(path) {
        if (hasDirective(path.node)) {
          removeWithComments(path);
        }
      },

      // 클래스 프로퍼티 (예: debug = true)
      ClassProperty(path) {
        if (hasDirective(path.node)) {
          removeWithComments(path);
        }
      },

      // 클래스 메서드 (예: debugMethod() {})
      ClassMethod(path) {
        if (hasDirective(path.node)) {
          removeWithComments(path);
        }
      },

      // 객체 프로퍼티 (예: { debug: true })
      ObjectProperty(path) {
        if (hasDirective(path.node)) {
          removeWithComments(path);
        }
      },

      // 객체 메서드 (예: { debugMethod() {} })
      ObjectMethod(path) {
        if (hasDirective(path.node)) {
          removeWithComments(path);
        }
      },
    },
  };
};

export default devStripPlugin;
