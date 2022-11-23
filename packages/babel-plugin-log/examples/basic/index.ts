import * as parser from '@babel/parser';
import traverse, { Visitor } from '@babel/traverse';
import generator from '@babel/generator';
import * as types from '@babel/types';

const fs = require('fs');
const path = require('path');

const sourceCode = fs.readFileSync(path.join(__dirname, './source-code.js'), {
  encoding: 'utf-8',
});

const visitor: Visitor = {
  CallExpression(path) {
    // 拿到 callee 数据
    const { callee } = path.node;
    // 判断是否是调用了 console.log 方法
    // 1. 判断是否是成员表达式节点，上面截图有详细介绍
    // 2. 判断是否是 console 对象
    // 3. 判断对象的属性是否是 log

    const isConsoleLog =
      types.isMemberExpression(callee) &&
      types.isIdentifier(callee.object) &&
      types.isIdentifier(callee.property) &&
      callee.object.name === 'console' &&
      callee.property.name === 'log';
    if (isConsoleLog) {
      // 如果是 console.log 的调用 找到上一个父节点是函数
      const funcPath = path.findParent((p) => {
        return p.isFunctionDeclaration();
      });

      if (
        funcPath &&
        types.isFunctionDeclaration(funcPath.node) &&
        funcPath.node.id
      ) {
        // 取函数的名称
        const funcName = funcPath.node.id.name;
        // 将名称通过 types 来放到函数的参数前面去
        path.node.arguments.unshift(types.stringLiteral(funcName));
      }
    }
  },
};

const ast = parser.parse(sourceCode);
traverse(ast, visitor);
const output = generator(ast, {});

console.log(output.code);
