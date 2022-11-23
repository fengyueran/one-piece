import { NodePath } from '@babel/traverse';
import * as types from '@babel/types';

export interface Options {
  include: string[];
  exclude: string[];
  customCatchCode: (
    filePath: string,
    funcName: string,
    errLiteral: string
  ) => string;
}
export interface PluginPass {
  filename: string;
  opts: Options;
}

export const getFuncName = (callFuncPath: NodePath, asyncPath: NodePath) => {
  let asyncFuncName = '';

  const type = asyncPath.node.type;

  switch (type) {
    case 'FunctionExpression':
    case 'ArrowFunctionExpression':
      const siblingPath = asyncPath.getSibling('id');
      asyncFuncName = types.isIdentifier(siblingPath.node)
        ? siblingPath.node.name
        : '';
      break;
    case 'FunctionDeclaration':
      asyncFuncName =
        types.isFunctionDeclaration(asyncPath.node) && asyncPath.node.id
          ? asyncPath.node.id.name
          : '';
      break;
    case 'ObjectMethod':
      const methodNode = asyncPath.node;
      asyncFuncName =
        (types.isIdentifier(methodNode.key) && methodNode.key.name) || '';
      break;
  }

  // 若asyncFuncName不存在，通过argument.callee获取当前执行函数的name
  const argument =
    types.isAwaitExpression(callFuncPath.node) && callFuncPath.node.argument;
  const callee =
    argument && types.isCallExpression(argument) && argument.callee;
  const callFuncName =
    (callee && types.isIdentifier(callee) && callee.name) || '';

  const funcName = asyncFuncName || callFuncName;

  return funcName;
};

export const makeConsole = (
  filePath: string,
  funcName: string,
  errorLiteral: string
) => `
funcName: ${funcName}
filePath: ${filePath}
${errorLiteral}:`;

export const isAsyncForm = (node: any) => {
  const canAsyncFunc =
    types.isArrowFunctionExpression(node) ||
    types.isFunctionDeclaration(node) ||
    types.isFunctionExpression(node) ||
    types.isObjectMethod(node);
  return canAsyncFunc;
};

export const shouldIgnoreFile = (pluginPass?: PluginPass) => {
  const filePath = pluginPass?.filename;
  const include = pluginPass?.opts?.include;
  const exclude = pluginPass?.opts?.exclude;
  const isIncludeFile = include?.some((filename) =>
    filePath.includes(filename)
  );
  const isExcludeFile = exclude?.some((filename) =>
    filePath.includes(filename)
  );
  const shouldIgnore = !isIncludeFile && isExcludeFile;
  return shouldIgnore;
};
