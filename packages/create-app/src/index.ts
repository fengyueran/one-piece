#!/usr/bin/env node
import inquirer from 'inquirer';

import { makeProject, CodeType, Config, Template } from './make-project';

const Templates = [Template.React, Template.ViteLib, Template.Node];

const Options = [
  {
    name: CodeType.Redux,
    checked: true,
  },
  {
    name: CodeType.Antd,
    checked: true,
  },
];

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
      default: [0, 1],
      when: (answers) => {
        return answers.template === Template.React;
      },
    },
  ])
  .then((answers: Config) => {
    console.log('Answers is', answers);
    makeProject(answers);
  });
