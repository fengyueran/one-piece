import path from 'path';
import fs from 'fs-extra';
import shell from 'shelljs';
import { execSync } from 'child_process';

import { Creator, Request } from './abstract-creator';
import { exec } from '../utils';
import { blueLog, Template } from '../helpers';

const createProjectByVite = (projectName: string) => {
  try {
    execSync(`yarn create vite ${projectName}  -- --template react-ts`);
  } catch (error) {
    throw new Error('通过vite创建项目失败');
  }
};

const cpTemplateFilesToProjectDir = (projectName: string) => {
  const viteSourceDir = path.join(__dirname, '../assets/vite/.');
  exec(`cp -r ${viteSourceDir} ${projectName}`);
};

const installDependencies = (projectName: string) => {
  shell.cd(projectName);
  exec(
    'yarn add vite-plugin-svgr vite-plugin-html rollup-plugin-bundle-analyzer babel-plugin-styled-components-px2vw @types/node --dev',
  );
};

const addCommandToPackageJSON = async () => {
  const packageJSON = 'package.json';
  const packageInfo = await fs.readJSON(packageJSON);

  packageInfo.scripts.analyze = 'Analyze=true vite build';
  const jsonString = JSON.stringify(packageInfo, null, 2);
  await fs.writeFile(packageJSON, jsonString);
};

export class ViteReactTSCreator extends Creator {
  private _process = async (projectName: string, saveDir: string, template: Template) => {
    shell.cd(saveDir);
    blueLog('Create project by vite');
    createProjectByVite(projectName);

    if (template === Template.ViteBasicApp) return;

    cpTemplateFilesToProjectDir(projectName);

    blueLog('install dependencies');
    installDependencies(projectName);
    await addCommandToPackageJSON();
  };

  public async create(request: Request) {
    const { template, projectName, saveDir } = request;
    const shouldProcess = template === Template.ViteApp || template === Template.ViteBasicApp;

    if (shouldProcess) {
      await this._process(projectName, saveDir, template);
    }

    this.passRequest(request);
  }
}
