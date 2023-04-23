import shell from 'shelljs';
import fs from 'fs-extra';
import path from 'path';

import { exec } from '../utils';
import { Plugin } from './abstract-plugin';

const addTagToAppCode = (appCode: string) => {
  const lines = appCode.split('\n');
  const ROOT_TAG = 'IntlProviderWrapper';
  const rootTagStartIndex = lines.findIndex((line) => line.includes(`<${ROOT_TAG}>`));
  const rootTagEndIndex = lines.findIndex((line) => line.includes(`</${ROOT_TAG}>`));

  lines.splice(rootTagStartIndex + 1, 0, `<AntdConfigProvider>`);
  lines.splice(rootTagEndIndex + 1, 0, `</AntdConfigProvider>`);

  return lines;
};

const addImportCodeToAppCode = (lines: string[]) => {
  const Target = 'src/components';
  const index = lines.findIndex((line) => line.includes(Target));
  const line = lines[index];

  const res = line.match(/{(.*)}/);

  const newLine = `import { ${res![1].trim()}, AntdConfigProvider } from 'src/components';`;

  lines[index] = newLine;

  return lines;
};

const addAntdCodeToAppCode = (appCode: string) => {
  let lines = addTagToAppCode(appCode);
  lines = addImportCodeToAppCode(lines);
  return lines.join('\n');
};

const readComponentIndex = (project: string) => {
  const indexPath = path.join(project, 'src/components', 'index.ts');
  const indexCode = fs.readFileSync(indexPath, 'utf-8');
  return indexCode;
};

const addToComponentIndex = (indexCode: string) => {
  const lines = indexCode.split('\n');
  lines.unshift(`export * from './antd-config-provider';`);
  return lines.join('\n');
};

const changeComponentIndex = async (project: string) => {
  let indexCode = await readComponentIndex(project);
  indexCode = addToComponentIndex(indexCode);
  const target = path.join(project, 'src/components/index.ts');
  await fs.writeFile(target, indexCode);
};

const installAntdDependencies = (project: string) => {
  shell.cd(project);
  exec('yarn add antd');
};

const copyAntdSource = (project: string) => {
  const antdSourceDir = path.join(__dirname, '../assets/antd-config-provider');
  const dist = path.join(project, 'src/components');
  exec(`cp -r ${antdSourceDir} ${dist}`);
};

const addAntdDependencies = async (project: string) => {
  copyAntdSource(project);
  await changeComponentIndex(project);
  installAntdDependencies(project);
};

export class AddAntdCodePlugin extends Plugin {
  createAppCode = (appCode: string) => {
    const code = addAntdCodeToAppCode(appCode);
    return code;
  };

  addDependencies = async () => {
    await addAntdDependencies(this.projectPath);
  };
}
