import type { PluginObj } from '@babel/core';
import type * as BabelTypes from '@babel/types';

const buildHandlerExpression = (
  types: typeof BabelTypes,
  name: string,
): BabelTypes.Expression =>
  name
    .split('.')
    .map<BabelTypes.Expression>((part) => types.identifier(part))
    .reduce((obj, prop) => types.memberExpression(obj, prop));

const isAlreadyWrapped = (
  types: typeof BabelTypes,
  body: BabelTypes.BlockStatement,
) => body.body.length === 1 && types.isTryStatement(body.body[0]);

interface Options {
  handler?: string;
}

const asyncGuardPlugin = (
  { types }: { types: typeof BabelTypes },
  options: Options,
): PluginObj => {
  const { handler = 'console.error' } = options;

  return {
    name: 'async-guard-kits',

    visitor: {
      Function(path) {
        if (!path.node.async) {
          return;
        }

        if (
          types.isArrowFunctionExpression(path.node) &&
          !types.isBlockStatement(path.node.body)
        ) {
          path.node.body = types.blockStatement([
            types.returnStatement(path.node.body),
          ]);
        }

        const body = path.node.body as BabelTypes.BlockStatement;

        if (isAlreadyWrapped(types, body)) {
          return;
        }

        const catchParam = path.scope.generateUidIdentifier('e');
        const tryCatch = types.tryStatement(
          types.blockStatement([...body.body]),
          types.catchClause(
            catchParam,
            types.blockStatement([
              types.expressionStatement(
                types.callExpression(buildHandlerExpression(types, handler), [
                  catchParam,
                ]),
              ),
            ]),
          ),
        );

        body.body = [tryCatch];
      },
    },
  };
};

export default asyncGuardPlugin;
