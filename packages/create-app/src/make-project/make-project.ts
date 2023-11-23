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
import { ViteReactTSCreator } from '../creators';

export interface Config {
  projectPath: string;
  template: string;
  options?: string[];
  confirm: boolean;
  reWrite: boolean;
}

export const makeProject = async (config: Config) => {
  blueLog('Creating project');

  // checkGit();

  const { projectPath, template, reWrite } = config;
  const { projectName, saveDir, projectAbsolutePath } = getProjectInfo(projectPath);

  if (reWrite) {
    rmProjectDir(projectAbsolutePath);
  }

  await fs.mkdir(saveDir, { recursive: true });

  const viteReactTSCreator = new ViteReactTSCreator();
  await viteReactTSCreator.create({ template, projectName, saveDir });

  // blueLog('Cloning template');

  // await cloneTemplate(template, savePath);

  // const shouldAddAntd = options?.includes(CodeType.Antd);
  // const shouldAddRedux = options?.includes(CodeType.Redux);
  // const shouldAddAppFile = template === Template.React;

  // const plugins = [
  //   shouldAddAppFile && new CreateAppCodePlugin(savePath),
  //   shouldAddAntd && new AddAntdCodePlugin(savePath),
  //   shouldAddRedux && new AddReduxCodePlugin(savePath),
  // ].filter((p) => p);

  // const appCode = await execPlugin(plugins as Plugin[]);
  // if (appCode) {
  //   generateAppFile(appCode, savePath);
  // }

  greenLog('Congratulations, generate template success!!!');
};
