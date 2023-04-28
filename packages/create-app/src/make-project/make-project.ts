import {
  blueLog,
  checkGit,
  CodeType,
  Template,
  execPlugin,
  cloneTemplate,
  generateAppFile,
  formatProjectPath,
  greenLog,
} from './helpers';
import { CreateAppCodePlugin, AddAntdCodePlugin, AddReduxCodePlugin, Plugin } from '../plugins';

export interface Config {
  projectPath: string;
  template: string;
  options?: string[];
}

export const makeProject = async (config: Config) => {
  blueLog('Make project');

  checkGit();

  const { projectPath, template, options } = config;
  const savePath = formatProjectPath(projectPath);

  blueLog('Clone template');

  await cloneTemplate(template, savePath);

  const shouldAddAntd = options?.includes(CodeType.Antd);
  const shouldAddRedux = options?.includes(CodeType.Redux);
  const shouldAddAppFile = template === Template.React;

  const plugins = [
    shouldAddAppFile && new CreateAppCodePlugin(savePath),
    shouldAddAntd && new AddAntdCodePlugin(savePath),
    shouldAddRedux && new AddReduxCodePlugin(savePath),
  ].filter((p) => p);

  const appCode = await execPlugin(plugins as Plugin[]);
  if (appCode) {
    generateAppFile(appCode, savePath);
  }

  greenLog('Congratulations, generate template success!!!');
};
