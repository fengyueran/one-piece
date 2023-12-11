#!/usr/bin/env node
import fs from 'fs';
import inquirer from 'inquirer';

import { Template } from './helpers';
import { makeProject, CodeType, Config } from './make-project';

const Templates = [
  Template.ViteApp,
  Template.ViteBasicApp,
  Template.React,
  Template.ViteLib,
  Template.Node,
];

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
      type: 'confirm',
      name: 'confirm',
      message: (answers: Config) => {
        return `Target directory ${answers.projectPath} is not empty. Remove existing files and continue?`;
      },
      default: false,
      when: (answers: Config) => {
        return fs.existsSync(answers.projectPath.trim());
      },
    },
    {
      type: 'list',
      name: 'template',
      message: '模板',
      choices: Templates,
      when: (answers) => {
        return answers.confirm === undefined || answers.confirm;
      },
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
    const shouldCreate = answers.confirm === undefined || answers.confirm;
    if (shouldCreate) {
      console.log('Answers is', answers);
      makeProject({ ...answers, reWrite: true });
    } else {
      console.log('Canceled');
    }
  });
