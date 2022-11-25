import fs from 'fs';
import path from 'path';
import * as babel from '@babel/core';
import LogPlugin, { ValueType } from '../../src';

const sourceCode = fs.readFileSync(path.join(__dirname, './source-code.ts'), {
  encoding: 'utf-8',
});

const obj = babel.transformSync(sourceCode, {
  plugins: [
    [
      LogPlugin,
      {
        trackerModule: '@sentry/react',
        trackFuncs: [
          { funcName: 'test1', event: 'T1', valueType: ValueType.Number },
          { funcName: 'test2', event: 'T2', valueType: ValueType.Return },
          { funcName: 'test8', event: 'T8', valueType: ValueType.Number },
          { funcName: 'test9', event: 'T9', valueType: ValueType.Number },
          { funcName: 'test10', event: 'T10', valueType: ValueType.Number },
        ],
      },
    ],
  ],
});

console.log(obj.code);
