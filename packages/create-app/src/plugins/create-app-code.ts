import shell from 'shelljs';
import fs from 'fs-extra';
import path from 'path';

import { exec } from '../utils';
import { Plugin } from './abstract-plugin';

export const installPackage = (project: string) => {
  shell.cd(project);
  exec('yarn');
};

export const readAppCode = (project: string) => {
  const appCodePath = path.join(project, 'src', 'app.tsx');
  const appCode = fs.readFileSync(appCodePath, 'utf-8');
  return appCode;
};

export class CreateAppCodePlugin extends Plugin {
  createAppCode = () => {
    const code = readAppCode(this.projectPath);
    return code;
  };
  addDependencies = () => {
    installPackage(this.projectPath);
  };
}
