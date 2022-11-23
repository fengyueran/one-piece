import { visitor } from './add-try-catch-visitor';

const babelPlugin = function (babel) {
  return {
    name: 'babel-plugin-await-add-try-catch',
    visitor,
  };
};

export default babelPlugin;
