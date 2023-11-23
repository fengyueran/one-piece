export interface Request {
  template: string;
  projectName: string;
  saveDir: string;
}

export abstract class Creator {
  private next: Creator;

  public getNext(): Creator {
    return this.next;
  }

  public setNext(next: Creator) {
    this.next = next;
  }

  public passRequest = (request: Request) => {
    const next = this.getNext();
    if (next) return next.create(request);
  };

  public abstract create(request: Request): Promise<void>;
}
