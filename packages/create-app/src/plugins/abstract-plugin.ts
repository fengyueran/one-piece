export abstract class Plugin {
  constructor(protected projectPath: string) {
    this.projectPath = projectPath;
  }
  abstract createAppCode(appCode?: string): string;
  abstract addDependencies(): void;
}
