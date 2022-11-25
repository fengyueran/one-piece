import { NodePath } from '@babel/traverse';
import * as types from '@babel/types';

export const getFuncName = (funcPath: NodePath) => {
  let funcName = '';

  const type = funcPath.node.type;

  switch (type) {
    case 'FunctionExpression':
    case 'ArrowFunctionExpression':
      if (types.isFunctionExpression(funcPath.node) && funcPath.node.id) {
        funcName = funcPath.node.id.name;
      } else {
        const siblingPath = funcPath.getSibling('id');
        funcName = types.isIdentifier(siblingPath.node)
          ? siblingPath.node.name
          : '';
      }
      break;
    case 'FunctionDeclaration':
      funcName =
        types.isFunctionDeclaration(funcPath.node) && funcPath.node.id
          ? funcPath.node.id.name
          : '';
      break;
    case 'ObjectMethod':
      const methodNode = funcPath.node;
      funcName =
        (types.isIdentifier(methodNode.key) && methodNode.key.name) || '';
      break;
  }

  return funcName;
};
