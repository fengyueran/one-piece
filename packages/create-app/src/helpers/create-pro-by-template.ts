import path from 'path';
import shell from 'shelljs';

import { exec } from './exec';
import { CodeType, generateAppFile } from './generate-app-file';

export enum Template {
  React = 'react-app-ts-template',
  Node = 'node-app-ts-template',
}

export interface Config {
  projectPath: string;
  template: string;
  options?: string[];
}

export const cloneTemplate = (templateName: string, project: string) => {
  try {
    const REPOSITORY = 'https://github.com/fengyueran';
    exec(`git clone ${REPOSITORY}/${templateName}.git ${project}`);
  } catch (error) {
    throw new Error('git clone 失败');
  }
};

export const fillProjectPath = (project: string) => {
  const isAbsolutePath = path.isAbsolute(project);
  if (isAbsolutePath) return project;
  const pwd = shell.pwd().toString();
  const projectPath = path.join(pwd, project);
  return projectPath;
};

export const installPackage = (project: string) => {
  shell.cd(project);
  shell.exec('yarn');
};

const installReduxDependencies = (project: string) => {
  shell.cd(project);
  shell.exec('yarn add @reduxjs/toolkit redux redux-persist react-redux');
};

export const addRedux = (project: string) => {
  const storeFile = path.join(__filename, '../../redux-code/store.ts');
  const projectSrc = path.join(project, 'src');

  shell.cp(storeFile, projectSrc);
};

export const addAntd = (project: string) => {
  const storeFile = path.join(__filename, '../../antd-code/');
  const projectSrc = path.join(project, 'src/components');

  shell.cp(storeFile, projectSrc);
};

export const installAntd = (project: string) => {
  shell.cd(project);
  shell.exec('yarn add antd');
};

export const checkGit = () => {
  try {
    exec('which git');
  } catch (error) {
    throw new Error('未检测到Git工具，请先安装Git');
  }
};

export const createProjectByTemplate = async (config: Config) => {
  checkGit();

  const { projectPath, template, options } = config;
  const savePath = fillProjectPath(projectPath);

  cloneTemplate(template, savePath);

  installPackage(savePath);

  const shouldAddRedux = options?.includes(CodeType.Redux);
  if (shouldAddRedux) {
    addRedux(savePath);
    installReduxDependencies(savePath);
  }

  const shouldAddAntd = options?.includes(CodeType.Antd);
  if (shouldAddAntd) {
    addRedux(savePath);
    installAntd(savePath);
  }

  const shouldAddAppFile = template === Template.React;
  if (shouldAddAppFile) {
    await generateAppFile(options, savePath);
  }
};
