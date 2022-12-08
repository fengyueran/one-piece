import path from 'path';
import shell from 'shelljs';

const exec = (command: string) => {
  const isFailed = shell.exec(command).code !== 0;
  if (isFailed) {
    throw new Error(`Exec ${command} error`);
  }
};

export const checkGit = () => {
  try {
    exec('which git');
  } catch (error) {
    throw new Error('未检测到Git工具，请先安装Git');
  }
};

export const fillProjectPath = (project: string) => {
  const isAbsolutePath = path.isAbsolute(project);
  if (isAbsolutePath) return project;
  const pwd = shell.pwd().toString();
  console.log('pwd', pwd);
  const projectPath = path.join(pwd, project);
  return projectPath;
};

export const cloneTemplate = (templateName: string, project: string) => {
  try {
    const REPOSITORY = 'https://github.com/fengyueran';
    exec(`git clone ${REPOSITORY}/${templateName}.git ${project}`);
  } catch (error) {
    throw new Error('git clone 失败');
  }
};

export const addRedux = (project: string) => {
  const storeFile = path.join(__filename, '../redux-code/store.ts');
  const appFile = path.join(__filename, '../redux-code/app.tsx');
  const projectSrc = path.join(project, 'src');

  shell.cp(storeFile, projectSrc);
  shell.cp(appFile, projectSrc);
};

export const installPackage = (project: string) => {
  shell.cd(project);
  shell.exec('yarn');
};

export const installReduxDependencies = (project: string) => {
  shell.cd(project);
  shell.exec('yarn add @reduxjs/toolkit redux redux-persist react-redux');
};
