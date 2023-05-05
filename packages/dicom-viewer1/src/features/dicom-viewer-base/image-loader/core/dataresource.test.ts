import { Data, PayLoadType, DataResource } from '.';

describe('test DataResource', () => {
  test('data resource', () => {
    const str = '{"T": "t"}';
    const d = new Data(PayLoadType.STRING, str);
    const r = new DataResource(d);
    expect(r.getString()).toBe(str);
    expect(r.getData()).toBe(d);
    expect(r.getJson()).toStrictEqual({ T: 't' });
    const ab = new ArrayBuffer(10);
    const r2 = new DataResource(new Data(PayLoadType.ARRAY_BUFFER, ab));
    expect(r2.getArrayBuffer()).toBe(ab);
    const r3 = new DataResource(new Data(PayLoadType.TYPED_ARRAY, new Uint8Array(ab)));
    expect(r3.getTypedArray<Int8Array>().length).toBe(10);
  });
});
