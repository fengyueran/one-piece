import shell from 'shelljs';
import path from 'path';

import { exec } from '../utils';
import { Plugin } from './abstract-plugin';

const addTagToAppCode = (appCode: string) => {
  const lines = appCode.split('\n');
  const ROOT_TAG = 'IntlProviderWrapper';
  const rootTagStartIndex = lines.findIndex((line) => line.includes(`<${ROOT_TAG}>`));
  const rootTagEndIndex = lines.findIndex((line) => line.includes(`</${ROOT_TAG}>`));

  lines.splice(rootTagStartIndex, 0, `<Provider store={store}>`);
  lines.splice(rootTagStartIndex + 1, 0, `<PersistGate persistor={persistor}>`);
  lines.splice(rootTagEndIndex + 3, 0, `</PersistGate>`);
  lines.splice(rootTagEndIndex + 4, 0, `</Provider>`);

  return lines;
};

const addAbsoluteImportCode = (lines: string[]) => {
  const Target = 'React';
  const index = lines.findIndex((line) => line.includes(Target));
  const importRedux = `import { Provider } from 'react-redux';
  import { persistStore } from 'redux-persist';
  import { PersistGate } from 'redux-persist/integration/react';`;
  const newLines = lines
    .slice(0, index + 1)
    .concat(importRedux.split('\n'))
    .concat(lines.slice(index + 1));

  return newLines;
};

const addImportStoreCode = (lines: string[]) => {
  const Target = 'import';
  let lastImportIndex = 0;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].includes(Target)) {
      lastImportIndex = i;
    }
  }

  const importStore = `import { store } from './store';\n
  const persistor = persistStore(store);`;
  const newLines = lines
    .slice(0, lastImportIndex + 1)
    .concat(importStore.split('\n'))
    .concat(lines.slice(lastImportIndex + 1));

  return newLines;
};

const addImportCodeToAppCode = (lines: string[]) => {
  let newLines = addAbsoluteImportCode(lines);
  newLines = addImportStoreCode(newLines);
  return newLines;
};

const addReduxCodeToAppCode = (appCode: string) => {
  let lines = addTagToAppCode(appCode);
  lines = addImportCodeToAppCode(lines);
  return lines.join('\n');
};

const installReduxDependencies = (project: string) => {
  shell.cd(project);
  exec('yarn add redux redux-persist react-redux @reduxjs/toolkit');
};

const copyReduxSource = (project: string) => {
  const storeFile = path.join(__dirname, '../assets/redux-code/store.ts');
  const dist = path.join(project, 'src/app/store.ts');
  exec(`cp ${storeFile} ${dist}`);
};

const addReduxDependencies = async (project: string) => {
  copyReduxSource(project);
  installReduxDependencies(project);
};

export class AddReduxCodePlugin extends Plugin {
  getName = () => 'AddReduxCodePlugin';

  createAppCode = (appCode: string) => {
    const code = addReduxCodeToAppCode(appCode);
    return code;
  };

  addDependencies = async () => {
    await addReduxDependencies(this.projectPath);
  };
}
