#!/usr/bin/env node
import { program } from 'commander';
import chalk from 'chalk';

import {
  checkGit,
  addRedux,
  cloneTemplate,
  installPackage,
  fillProjectPath,
  installReduxDependencies,
} from './helpers';

program.usage('<Template> <myproject>');
program.version('1.0.0').description('快速创建项目CLI');
program.option('-r | --redux', 'Add redux');
program
  .command('list')
  .description('显示所有模板')
  .action(() => {
    console.info(`node-app-ts-template`);
    console.info('react-app-ts-template');
  });

program.command('* <tpl> <project>').action(function (tpl, project) {
  checkGit();
  const opts = program.opts();
  const projectPath = fillProjectPath(project);
  if (tpl && project) {
    console.log(chalk.green(`拉取模板...`));
    cloneTemplate(tpl, projectPath);

    console.log(chalk.green('安装依赖...'));
    installPackage(projectPath);

    if (opts.redux && tpl === 'react-app-ts-template') {
      console.log(chalk.green('安装redux依赖...'));
      addRedux(projectPath);
      installReduxDependencies(projectPath);
    }

    console.log(chalk.green('创建完成'));
  } else {
    console.error('正确命令例子：initapp-cli AppTemp myproject');
  }
});

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
