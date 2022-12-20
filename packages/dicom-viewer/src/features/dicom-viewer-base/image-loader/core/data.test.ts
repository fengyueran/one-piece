import { Data, PayLoadType, DataGetInvalid, DataPayloadInvalid } from '.';
import { str2ab } from './string';

describe('dicom json data read', () => {
  const testData = (type: PayLoadType, value: any) => {
    const d = new Data(type, value);
    expect(d.type).toBe(type);
    expect(d.getAny<any>()).toBe(value);
  };
  test('checkData', () => {
    testData(PayLoadType.NO_CONTENT, undefined);
    expect(() => testData(PayLoadType.NO_CONTENT, 'string')).toThrow(DataPayloadInvalid);

    testData(PayLoadType.PAGED_CONTENT, {
      data: new Data(PayLoadType.ARRAY_BUFFER, new ArrayBuffer(10)),
      more: 1,
    });
    expect(() =>
      testData(PayLoadType.PAGED_CONTENT, new Data(PayLoadType.ARRAY_BUFFER, new ArrayBuffer(10))),
    ).toThrow(DataPayloadInvalid);

    testData(PayLoadType.STRING, 'string');
    expect(() =>
      testData(PayLoadType.STRING, new Data(PayLoadType.ARRAY_BUFFER, new ArrayBuffer(10))),
    ).toThrow(DataPayloadInvalid);

    testData(PayLoadType.JSON, {});
    expect(() => testData(PayLoadType.JSON, 'string')).toThrow(DataPayloadInvalid);
    expect(() => testData(PayLoadType.JSON, new ArrayBuffer(10))).toThrow(DataPayloadInvalid);
    expect(() => testData(PayLoadType.JSON, new Uint8Array())).toThrow(DataPayloadInvalid);

    testData(PayLoadType.ARRAY_BUFFER, new ArrayBuffer(10));
    expect(() => testData(PayLoadType.ARRAY_BUFFER, 'string')).toThrow(DataPayloadInvalid);

    testData(PayLoadType.TYPED_ARRAY, new Uint8Array());
    expect(() => testData(PayLoadType.TYPED_ARRAY, undefined)).toThrow(DataPayloadInvalid);

    testData(PayLoadType.OTHERS, 'string');
    testData(PayLoadType.OTHERS, new Uint8Array());
    testData(PayLoadType.OTHERS, {});
  });

  test('getTypedArray', () => {
    const uint8Array = new Uint8Array();
    const uint8Data = new Data(PayLoadType.TYPED_ARRAY, uint8Array);
    const stringData = new Data(PayLoadType.STRING, 'string');
    expect(uint8Data.getTypedArray<Uint8Array>()).toBe(uint8Array);
    expect(() => stringData.getTypedArray<Uint8Array>()).toThrow(DataGetInvalid);
    // TODO: Make the following test pass.
    // expect(() => uint8Data.getTypedArray<Int16Array>()).toThrow(DataGetInvalid);
  });

  test('getArrayBuffer', () => {
    const ab = new ArrayBuffer(10);
    expect(new Data(PayLoadType.ARRAY_BUFFER, ab).getArrayBuffer()).toBe(ab);
    expect(() => new Data(PayLoadType.NO_CONTENT, undefined).getArrayBuffer()).toThrow(
      DataGetInvalid,
    );
  });

  test('getString', () => {
    const str = 'string1';
    expect(new Data(PayLoadType.STRING, str).getString()).toBe(str);
    const ab = str2ab(str);
    expect(new Data(PayLoadType.ARRAY_BUFFER, ab.buffer).getString()).toBe(str);
    const ab2 = new Uint8Array(8);
    ab2.set(ab);
    expect(new Data(PayLoadType.ARRAY_BUFFER, ab2.buffer).getString()).toBe(str);
    expect(() => new Data(PayLoadType.NO_CONTENT, undefined).getString()).toThrow(DataGetInvalid);
  });

  test('getJson', () => {
    const json = {};
    expect(new Data(PayLoadType.JSON, json).getJson()).toBe(json);
    expect(() => new Data(PayLoadType.NO_CONTENT, undefined).getJson()).toThrow(DataGetInvalid);
  });

  test('getArray', () => {
    const array = [3, 3];
    expect(new Data(PayLoadType.JSON, array).getArray()).toStrictEqual(array);
    const obj = {};
    expect(() => new Data(PayLoadType.JSON, obj).getArray()).toThrow(DataGetInvalid);
    // expect(() => new Data(PayLoadType.NO_CONTENT, undefined).getJson()).toThrow(DataGetInvalid);
  });
});
