import inquirer from 'inquirer';

import { createProjectByTemplate, CodeType, Config, Template } from './helpers';

const Templates = [Template.React, Template.Node];

const Options = [CodeType.Redux, CodeType.Antd];

inquirer
  .prompt([
    {
      type: 'input',
      name: 'projectPath',
      message: 'Project name',
      default: 'my-app',
    },
    {
      type: 'list',
      name: 'template',
      message: '模板',
      choices: Templates,
    },
    {
      type: 'checkbox',
      name: 'options',
      message: '选项',
      choices: Options,
      when: (answers) => {
        return answers.template === Template.React;
      },
    },
  ])
  .then((answers: Config) => {
    console.log(answers);
    createProjectByTemplate(answers);
  });
