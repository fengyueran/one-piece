import fs from 'fs';
import path from 'path';
import * as babel from '@babel/core';
import { visitor } from '../../src';

const sourceCode = fs.readFileSync(path.join(__dirname, './source-code.ts'), {
  encoding: 'utf-8',
});

const obj = babel.transformSync(sourceCode, {
  plugins: [
    [
      function MyPlugin(babel) {
        return {
          visitor,
        };
      },
      {
        include: [],
        exclude: [],
        customCatchCode: 'console.log("+++++++++++++++---")',
      },
    ],
  ],
});

console.log(obj.code);
