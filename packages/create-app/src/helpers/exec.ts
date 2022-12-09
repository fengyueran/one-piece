import shell from 'shelljs';

export const exec = (command: string) => {
  const isFailed = shell.exec(command).code !== 0;
  if (isFailed) {
    throw new Error(`Exec ${command} error`);
  }
};
