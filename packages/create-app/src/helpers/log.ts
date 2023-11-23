import chalk from 'chalk';

const fillStrWithStar = (log: string) => `****************** ${log} ******************`;

export const blueLog = (log: string) => console.log(chalk.blue(fillStrWithStar(log)));
export const greenLog = (log: string) => console.log(chalk.green(fillStrWithStar(log)));
