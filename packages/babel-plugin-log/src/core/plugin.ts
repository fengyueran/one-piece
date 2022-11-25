import { declare } from '@babel/helper-plugin-utils';

import { createVisitor } from './visitor';

const babelPlugin = declare((api, options, dirname) => {
  return {
    visitor: createVisitor(api, options, dirname),
  };
});

export default babelPlugin;
