import path from 'path';

import { Creator, Request } from './abstract-creator';
import { Template, cloneTemplate } from '../helpers';

export class CommonCreator extends Creator {
  public async create(request: Request) {
    const { template, projectName, saveDir } = request;
    const shouldProcess = template === Template.Node;
    if (shouldProcess) {
      cloneTemplate(template, path.join(saveDir, projectName));
    }

    this.passRequest(request);
  }
}
