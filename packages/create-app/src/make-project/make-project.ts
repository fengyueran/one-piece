import {
  checkGit,
  CodeType,
  Template,
  execPlugin,
  cloneTemplate,
  generateAppFile,
  formatProjectPath,
} from './helpers';
import { CreateAppCodePlugin, AddAntdCodePlugin, Plugin } from '../plugins';

export interface Config {
  projectPath: string;
  template: string;
  options?: string[];
}

export const makeProject = async (config: Config) => {
  checkGit();

  const { projectPath, template, options } = config;
  const savePath = formatProjectPath(projectPath);

  await cloneTemplate(template, savePath);
  // const shouldAddRedux = options?.includes(CodeType.Redux);
  const shouldAddAntd = options?.includes(CodeType.Antd);
  const shouldAddAppFile = template === Template.React;

  const plugins = [
    shouldAddAppFile && new CreateAppCodePlugin(savePath),
    shouldAddAntd && new AddAntdCodePlugin(savePath),
  ].filter((p) => p);

  const appCode = await execPlugin(plugins as Plugin[]);

  generateAppFile(appCode, savePath);
};
