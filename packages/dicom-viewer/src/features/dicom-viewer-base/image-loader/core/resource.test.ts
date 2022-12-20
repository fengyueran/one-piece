import { Resource } from './resource';

class DummyResource extends Resource {
  constructor() {
    super('dummy');
  }
}

describe('Resource not implemented call', () => {
  test('data throw', () => {
    const r = new DummyResource();
    expect(() => r.getJson()).toThrow('Resource: getJson not implemented');
    expect(() => r.getArrayBuffer()).toThrow('Resource: getArrayBuffer not implemented');
    expect(() => r.getString()).toThrow('Resource: getString not implemented');
    expect(() => r.getData()).toThrow('Resource: getData not implemented');
    expect(() => r.getTypedArray()).toThrow('Resource: getTypedArray not implemented');
  });
});
