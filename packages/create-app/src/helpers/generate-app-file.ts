import fs from 'fs-extra';
import path from 'path';

export enum CodeType {
  Redux = 'Redux',
  Antd = 'Antd',
}

interface CodeItem {
  type?: CodeType;
  code: string;
}

const codeLineItems = [
  { code: `import React from 'react';` },
  { type: CodeType.Redux, code: `import { Provider } from 'react-redux';` },
  { type: CodeType.Redux, code: `import { PersistGate } from 'redux-persist/integration/react';` },
  { type: CodeType.Redux, code: `import { persistStore } from 'redux-persist';` },
  { code: `\n` },

  { code: `import { IntlProviderWrapper } from 'src/components';` },
  { type: CodeType.Redux, code: `import { store } from './store';` },
  { code: `import { Router } from './router';` },
  { code: `\n` },

  { type: CodeType.Redux, code: `const persistor = persistStore(store);` },
  { type: CodeType.Redux, code: `\n` },

  { code: `export const App = () => {` },
  { code: `  return (` },
  { type: CodeType.Redux, code: `<Provider store={store}>` },
  { type: CodeType.Redux, code: `<PersistGate persistor={persistor}>` },
  { code: `<IntlProviderWrapper>` },
  { code: `<Router />` },
  { code: `</IntlProviderWrapper>` },
  { type: CodeType.Redux, code: `</PersistGate>` },
  { type: CodeType.Redux, code: `</Provider>` },
  { code: `  );` },
  { code: `};` },
];

const getTag = (tagCode: string) => {
  try {
    const res = tagCode.match(/<\/?(\w+)/);
    return res[1];
  } catch (error) {
    throw new Error(`getTag error:${error.message}'`);
  }
};

const calcSpace = (() => {
  const tagStack: { isStartTag: boolean; name: string; spaceLength: number }[] = [];

  return (c: CodeItem) => {
    const isTag = c.code.startsWith('<');
    const isEndTag = c.code.startsWith('</');
    const isStartTag = isTag && !isEndTag;
    const isEmptyTag = c.code.endsWith('/>');
    const tagName = isTag && getTag(c.code);

    if (!tagName) return '';

    let spaceLength = 4;

    if (isStartTag) {
      spaceLength += tagStack.length * 2;
      tagStack.push({ isStartTag, name: tagName, spaceLength });
    } else if (isEmptyTag) {
      const findIndex = tagStack.findIndex(({ isStartTag }) => isStartTag);
      if (findIndex >= 0) {
        spaceLength += (findIndex + 1) * 2;
        tagStack.push({ isStartTag, name: tagName, spaceLength });
      }
    } else {
      const findIndex = tagStack.findIndex(({ name }) => name === tagName);
      spaceLength += findIndex * 2;
      tagStack.splice(findIndex);
    }

    const space = isTag ? ' '.repeat(spaceLength) : '';
    return space;
  };
})();

const getValidCodeLines = (targetCodeTypes: string[]) => {
  const validCodelines = codeLineItems.filter(({ type }) => {
    if (!type) return true;
    return targetCodeTypes.find((codeType) => codeType === type);
  });
  return validCodelines;
};

const makeAppFileCode = (validCodelines: CodeItem[]) => {
  const appFileCode = validCodelines.reduce((p, c) => {
    const lineBreak = c.code === '\n' ? '' : '\n';
    const space = calcSpace(c);
    return p + space + `${c.code}` + lineBreak;
  }, '');
  return appFileCode;
};

export const generateAppFile = async (targetCodeTypes: string[] = [], saveDir: string) => {
  const validCodelines = getValidCodeLines(targetCodeTypes);
  const appFileCode = makeAppFileCode(validCodelines);
  const target = path.join(saveDir, 'src//app.tsx');
  await fs.writeFile(target, appFileCode);
};
