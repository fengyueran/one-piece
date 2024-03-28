import { exec } from '../utils';

export enum Template {
  ViteApp = 'vite-react-ts-template',
  ViteBasicApp = 'vite-react-ts-basic-template',
  // React = 'react-app-ts-template',
  // ViteLib = 'vite-lib-ts-template',
  Node = 'node-app-ts-template',
}

export const cloneTemplate = (templateName: string, projectPath: string) => {
  try {
    const REPOSITORY = 'https://github.com/fengyueran';
    exec(`git clone ${REPOSITORY}/${templateName}.git ${projectPath}`);
  } catch (error) {
    throw new Error('git clone 失败');
  }
};
