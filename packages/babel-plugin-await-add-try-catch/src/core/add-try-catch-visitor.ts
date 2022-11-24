import { Visitor, NodePath } from '@babel/traverse';
import * as types from '@babel/types';
import template from '@babel/template';

import {
  PluginPass,
  isAsyncForm,
  makeConsole,
  shouldIgnoreFile,
  getFuncName,
} from './helpers';

const TryCatchTemplate = `
  try {
  } catch (err) {
    %%CustomCatchCode%%
    console.error(%%Error%%, err);
  }
`;

const temp = template(TryCatchTemplate);

const handleAwaitExpression = function (
  path: NodePath,
  pluginPass?: PluginPass
) {
  if (shouldIgnoreFile(pluginPass)) return false;

  if (path.findParent((p) => p.isTryStatement())) {
    return false;
  }

  const asyncPath = path.findParent(
    (p) => isAsyncForm(p.node) && (p.node as types.FunctionDeclaration).async
  );

  const asyncPathNode = asyncPath?.node as types.FunctionDeclaration;

  if (
    asyncPath &&
    asyncPathNode &&
    isAsyncForm(asyncPathNode) &&
    types.isBlockStatement(asyncPathNode.body)
  ) {
    const filePath = pluginPass?.filename;

    const funcName = getFuncName(path, asyncPath);

    const tempArgumentObj = {
      CustomCatchCode: pluginPass?.opts.customCatchCode || undefined,
      Error: types.stringLiteral(
        makeConsole(filePath, funcName, path.node.loc, 'err')
      ),
    };
    const tryNode = temp(tempArgumentObj) as types.TryStatement;

    const info = asyncPathNode.body;

    tryNode.block.body.push(...info.body);

    info.body = [tryNode];
  }
};

export const visitor: Visitor = {
  Function(path) {
    const pluginPass = this as PluginPass;
    path.traverse({
      AwaitExpression: function (awaitPath) {
        handleAwaitExpression(awaitPath, pluginPass);
      },
    });
  },
};
