import fs from 'fs';
import path from 'path';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import generator from '@babel/generator';
import { visitor } from '../../src';

const sourceCode = fs.readFileSync(path.join(__dirname, './source-code.ts'), {
  encoding: 'utf-8',
});

const ast = parser.parse(sourceCode);
traverse(ast, visitor);
const output = generator(ast, {});

console.log(output.code);
