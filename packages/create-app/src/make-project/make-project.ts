import fs from 'fs-extra';
import {
  // checkGit,
  // CodeType,
  // Template,
  // execPlugin,
  // cloneTemplate,
  // generateAppFile,
  // getDirName,
  getProjectInfo,
  rmProjectDir,
} from './helpers';
import { blueLog, greenLog } from '../helpers';

// import { CreateAppCodePlugin, AddAntdCodePlugin, AddReduxCodePlugin, Plugin } from '../plugins';
import { CommonCreator, ViteReactTSCreator } from '../creators';

export interface Config {
  projectPath: string;
  template: string;
  options?: string[];
  confirm: boolean;
  reWrite: boolean;
}

export const makeProject = async (config: Config) => {
  blueLog('Creating project');

  const { projectPath, template, reWrite } = config;
  const { projectName, saveDir, projectAbsolutePath } = getProjectInfo(projectPath);

  if (reWrite) {
    rmProjectDir(projectAbsolutePath);
  }

  await fs.mkdir(saveDir, { recursive: true });

  const commonCreator = new CommonCreator();
  const viteReactTSCreator = new ViteReactTSCreator();
  commonCreator.setNext(viteReactTSCreator);

  await commonCreator.create({ template, projectName, saveDir });

  greenLog('Congratulations, generate template success!!!');
};
