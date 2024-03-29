import path from 'path';
import shell from 'shelljs';
import fs from 'fs-extra';

import { exec } from '../utils';
import { blueLog } from '../helpers';
import { Plugin } from '../plugins';

export const checkGit = () => {
  try {
    exec('which git');
  } catch (error) {
    throw new Error('未检测到Git工具，请先安装Git');
  }
};

export enum CodeType {
  Redux = 'Redux',
  Antd = 'Antd',
}

export enum Template {
  ViteApp = 'vite-react-ts-template',
  ViteBasicApp = 'vite-react-ts-basic-template',
  React = 'react-app-ts-template',
  ViteLib = 'vite-lib-ts-template',
  Node = 'node-app-ts-template',
}

export const getAbosolutePath = (projectPath: string) => {
  const newProjectPath = projectPath.trim();
  const isAbsolutePath = path.isAbsolute(newProjectPath);
  if (isAbsolutePath) return newProjectPath;

  const pwd = shell.pwd().toString();
  const absolutePath = path.join(pwd, projectPath);
  return absolutePath;
};

export const getDirName = (project: string) => {
  return path.dirname(project);
};

export const execPlugin = async (plugins: Plugin[]) => {
  let appCode;
  while (plugins.length) {
    const p = plugins.shift();
    if (p) {
      blueLog(p.getName());
      appCode = p.createAppCode(appCode);
      await p.addDependencies();
    }
  }
  return appCode;
};

const getTag = (tagCode: string) => {
  try {
    const res = tagCode.match(/<\/?(\w+)/);
    return res![1];
  } catch (error) {
    throw new Error(`getTag error:${error.message}'`);
  }
};

const calcSpace = (() => {
  const tagStack: { isStartTag: boolean; name: string; spaceLength: number }[] = [];

  return (c: string) => {
    const isTag = c.startsWith('<');
    const isEndTag = c.startsWith('</');
    const isStartTag = isTag && !isEndTag;
    const isEmptyTag = c.endsWith('/>');
    const tagName = isTag && getTag(c);

    if (!tagName) return '';

    let spaceLength = 2;

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

const shouldLineBreak = (str: string) => {
  return str === '' || str.endsWith(';') || str.endsWith('>') || str.startsWith('export');
};

const makeAppFileCode = (validCodelines: string[]) => {
  const appFileCode = validCodelines.reduce((p, c) => {
    const str = c.trim();
    const lineBreak = shouldLineBreak(str) ? '\n' : '';
    const space = calcSpace(str);
    return p + space + str + lineBreak;
  }, '');
  return appFileCode;
};

export const generateAppFile = async (appCode: string, saveDir: string) => {
  const lines = appCode.split('\n');
  const appFileCode = makeAppFileCode(lines);
  const target = path.join(saveDir, 'src/app/app.tsx');
  await fs.writeFile(target, appFileCode);
};

export const getProjectInfo = (projectPath: string) => {
  const projectAbsolutePath = getAbosolutePath(projectPath);
  const projectName = path.basename(projectAbsolutePath);
  const saveDir = path.join(projectAbsolutePath, '../');

  return { projectName, projectAbsolutePath, saveDir };
};

export const rmProjectDir = (projectPath: string) => {
  exec(`rm -rf ${projectPath}`);
};
