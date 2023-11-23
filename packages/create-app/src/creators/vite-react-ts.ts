import path from 'path';
import fs from 'fs-extra';
import shell from 'shelljs';

import { Creator, Request } from './abstract-creator';
import { exec } from '../utils';
import { blueLog } from '../helpers';

const TempalteName = 'vite-react-ts-template';

const createProjectByVite = (projectName: string) => {
  try {
    exec(`npm create vite@latest ${projectName}  -- --template react-ts`);
  } catch (error) {
    throw new Error('通过vite创建项目失败');
  }
};

const cpTemplateFilesToProjectDir = (projectName: string) => {
  const antdSourceDir = path.join(__dirname, '../assets/vite/*');
  exec(`cp -r ${antdSourceDir} ${projectName}`);
};

const installDependencies = (projectName: string) => {
  shell.cd(projectName);
  exec(
    'yarn add vite-plugin-svgr vite-plugin-html rollup-plugin-bundle-analyzer babel-plugin-styled-components-px2vw --dev',
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
  private _process = async (projectName: string, saveDir: string) => {
    shell.cd(saveDir);
    blueLog('Create project by vite');
    await createProjectByVite(projectName);
    await cpTemplateFilesToProjectDir(projectName);

    blueLog('install dependencies');
    await installDependencies(projectName);
    await addCommandToPackageJSON();
  };

  public async create(request: Request) {
    const { template, projectName, saveDir } = request;
    const shouldProcess = template === TempalteName;

    if (shouldProcess) {
      await this._process(projectName, saveDir);
    }

    this.passRequest(request);
  }
}
