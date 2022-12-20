export class BaseError extends Error {
  constructor(public type: string, public message: string) {
    super(`${type}: ${message}`);
  }
}

export class NetWorkError extends BaseError {
  constructor(public code: number, message: string) {
    super('NetWorkError', message);
  }
}

export class NotImplemented extends BaseError {
  constructor() {
    super('NotImplemented', 'NotImplemented');
  }
}
