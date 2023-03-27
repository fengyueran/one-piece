import { isArray, keys, isPlainObject } from 'lodash-es';
// For consistency. This class only receive name as key to get value.
// Follow DICOM JSON MODEL

// Each DcmItem is a DataSet as well. We only use DataSet here for simplicity.
import { getTagFromName, getJsonTagCodeFromName } from './tags';
import { ImageTags } from './types';

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

class DataSetInternalError extends Error {}

const getValueFromIndex = (v: any, index: number) => {
  if (v.Value) {
    if (v.vr === 'PN') {
      const pnV = v.Value[index];
      if (pnV.Alphabetic) {
        return pnV.Alphabetic;
      }
      if (pnV.Ideographic) {
        return pnV.Ideographic;
      }
      if (pnV.Phonetic) {
        return pnV.Phonetic;
      }
      return null;
    }
    return v.Value[index];
  }

  if (v.BulkDataURI) {
    return v.BulkDataURI;
  }
  if (v.InlineBinary) {
    return v.InlineBinary;
  }
  return undefined;
};

export class DataSet {
  constructor(public json: { [Key in string]?: any } = {}) {
    if (!isPlainObject(json)) {
      throw new Error('DataSet constructor: parameter is not an object');
    }
  }

  private pixelDataMap: Map<string, Uint8Array | Uint16Array | Int16Array> = new Map<
    string,
    Uint8Array | Uint16Array | Int16Array
  >();

  get SeriesInstanceUID(): string {
    return this.getElementValue('SeriesInstanceUID');
  }

  set SeriesInstanceUID(v: string) {
    this.setElementValue('SeriesInstanceUID', v);
  }

  get StudyInstanceUID(): string {
    return this.getElementValue('StudyInstanceUID');
  }

  set StudyInstanceUID(v: string) {
    this.setElementValue('StudyInstanceUID', v);
  }

  get SOPInstanceUID(): string {
    return this.getElementValue('SOPInstanceUID');
  }

  set SOPInstanceUID(v: string) {
    this.setElementValue('SOPInstanceUID', v);
  }

  getElementCount(tagName: string): any {
    try {
      const v = this.getElement(tagName);
      if (!v) {
        return 0;
      }
      if (v.Value) {
        return v.Value.length;
      }
    } catch (e) {} // eslint-disable-line
    return 0;
  }

  getElementValueArray(tagName: string): any {
    try {
      const v = this.getElement(tagName);
      if (v === undefined) {
        return undefined;
      }
      if (v.Value) {
        return v.Value;
      }
    } catch (e) {} // eslint-disable-line
    return null;
  }

  getElementValue(tagName: string, index = 0): any {
    try {
      const v = this.getElement(tagName);
      if (v === undefined) {
        return undefined;
      }
      const indexedValue = getValueFromIndex(v, index);
      if (indexedValue === undefined) {
        return null;
      }
      return indexedValue;
    } catch (e) {} // eslint-disable-line
    return null;
  }

  private getElement(tagName: string) {
    const jsonTagCode = getJsonTagCodeFromName(tagName);
    if (!jsonTagCode) {
      return undefined;
    }
    return this.json[jsonTagCode];
  }

  getPixelData(name: string): Uint8Array | Uint16Array | Int16Array | undefined {
    return this.pixelDataMap.get(name);
  }

  setPixelData(imageTags: ImageTags, pixel: Uint8Array): void {
    const BulkDataURI = 'pixel';
    this.setElement('PixelData', {
      BulkDataURI,
      vr: 'OB',
    });

    this.setElementValue('SamplesPerPixel', imageTags.SamplesPerPixel);
    this.setElementValue('PhotometricInterpretation', imageTags.PhotometricInterpretation);
    this.setElementValue('PlanarConfiguration', imageTags.PlanarConfiguration);
    this.setElementValue('Rows', imageTags.Rows);
    this.setElementValue('Columns', imageTags.Columns);
    this.setElementValue('BitsAllocated', imageTags.BitsAllocated);
    this.setElementValue('BitsStored', imageTags.BitsStored);
    this.setElementValue('HighBit', imageTags.HighBit);
    this.setElementValue('PixelRepresentation', imageTags.PixelRepresentation);

    this.pixelDataMap.set(BulkDataURI, pixel);
  }

  private getSQElementInternal(tagName: string, index?: number) {
    try {
      const v = this.getElement(tagName);
      if (v === undefined) {
        return undefined;
      }
      if (v.vr !== 'SQ') {
        throw new DataSetInternalError(`getElementSQ: vr must be SQ, but now it is ${v.vr}`);
      }
      if (index === undefined) {
        return v.Value.map((e: any) => new DataSet(e));
      }
      return new DataSet(v.Value[index]);
    } catch (e) {
      if (e instanceof DataSetInternalError) {
        throw e;
      }
      return null;
    }
  }

  getSQElement(tagName: string, index = 0): any {
    return this.getSQElementInternal(tagName, index);
  }

  getSQElementArray(tagName: string): any {
    return this.getSQElementInternal(tagName);
  }

  private setElement(tagName: string, value: any) {
    const metaKey = getJsonTagCodeFromName(tagName);
    this.json[metaKey!] = value;
  }

  setElementValue(tagName: string, value: string | number | Array<any> | ArrayBuffer): void {
    // const metaKey = getJsonTagCodeFromName(tagName);
    const tag = getTagFromName(tagName);
    if (!tag) {
      return;
    }
    if (isArray(value)) {
      this.setElement(tagName, {
        Value: value,
        vr: tag.vr,
      });
      return;
    }
    if (tag.vr === 'OB' || tag.vr === 'OW') {
      this.setElement(tagName, {
        InlineBinary: value instanceof ArrayBuffer ? arrayBufferToBase64(value) : btoa(`${value}`),
        vr: tag.vr,
      });
      return;
    }
    this.setElement(tagName, {
      Value: [value instanceof ArrayBuffer ? arrayBufferToBase64(value) : value],
      vr: tag.vr,
    });
  }

  addSQItem(tagName: string, ds?: DataSet): void {
    const tag = getTagFromName(tagName);
    if (!tag) {
      return;
    }
    let existed = this.getElement(tagName);
    if (!existed) {
      existed = {
        vr: tag.vr,
        Value: [],
      };
    }
    if (ds) {
      existed.Value.push(ds.json);
    }
    this.setElement(tagName, existed);
  }

  copyElement(
    sourceDS: DataSet,
    tagName: string,
    defaultValue?: string | Array<any> | ArrayBuffer,
  ): void {
    const target = sourceDS.getElement(tagName);
    if (target) {
      this.setElement(tagName, target);
    } else if (typeof defaultValue !== 'undefined') {
      this.setElementValue(tagName, defaultValue);
    }
  }

  elementStr(k: string, prefix: string): string {
    const v = this.json[k];
    const tag = getTagFromName(k);
    // tag, vr, value, count, name
    const name = tag ? tag.name : 'undefined';
    const tagStr = tag ? tag.tag : k;
    const vr = tag ? tag.vr : v.vr;
    const count = v.Value ? v.Value.length : 0;
    let value = '';
    if (tag && tag.vr !== 'SQ') {
      value = v.Value ? `[${v.Value.join('\\')}]`.slice(0, 80) : '(no value available)';
    }
    return `${prefix}${tagStr}  ${vr}  ${value}  ${count}  ${name}`;
  }

  // performance is not considered here
  dump(lineLogger: (line: string) => void, prefix = ''): void {
    const ks = keys(this.json);
    ks.sort();
    for (let i = 0; i < ks.length; i += 1) {
      const k = ks[i];
      const v = this.json[k];
      if (!v) {
        continue;
      }
      if (v.vr === 'SQ') {
        lineLogger(this.elementStr(k, prefix));
        if (!v.Value) continue;
        for (let j = 0; j < v.Value.length; j += 1) {
          lineLogger(`${prefix}{`);
          const ds = new DataSet(v.Value[j]);
          ds.dump(lineLogger, `${prefix}  `);
          lineLogger(`${prefix}}`);
        }
      } else {
        lineLogger(this.elementStr(k, prefix));
      }
    }
  }
}
