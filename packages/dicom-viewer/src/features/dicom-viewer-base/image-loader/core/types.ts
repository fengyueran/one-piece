import { Data } from './data';
import { Resource } from './resource';

export type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

export type TypedArrayConstructor =
  | Int8ArrayConstructor
  | Uint8ArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor;

export interface StringObject {
  [attr: string]: any;
}

export type Locator = StringObject;

export type AnyOption = StringObject;

export type FetchFn = (locator: Locator, option: AnyOption) => Promise<Data>;

export interface IFetcherMgr {
  fetch: (fetchType: string, locator: Locator, option: AnyOption) => Promise<Data>;
  register: (type: string, fetch: FetchFn) => void;
}

export const FetchType = {
  DicomInfo: 'dicom-info',
  StudyInfo: 'study-info',
  SeriesInfo: 'series-info',
  InstanceInfo: 'instance-info',
  DicomMeta: 'dicom-meta',
  DicomInstance: 'dicom-instance',
  Url: 'url',
  File: 'file',
  BrowserFile: 'browser-file',
} as const;

export enum Priority {
  Low,
  Medium,
  High,
}

export interface LoadParams {
  fetchType: string;
  locator: Locator;
  parse?: (param: { data: Data; mgr: IResourceMgr; option: AnyOption }) => Promise<Resource>;
  option?: AnyOption;
}

export interface IResourceRep {
  uid: string;
  isReady: () => boolean;
  load: (priority?: Priority) => Promise<Resource>;
  get<T extends Resource = Resource>(): T;
  cancel: () => void;
}

export interface IResourceMgr {
  addResource: (loadParams: LoadParams) => IResourceRep;
  load: (resourceRep: IResourceRep, priority: Priority) => Promise<Resource>;
  cancel: (resourceRep: IResourceRep) => void;
}

export interface ParseParam {
  data: Data;
  mgr: IResourceMgr;
  option: AnyOption;
}

export type ParseFn = (param: ParseParam) => Promise<Resource>;

export interface PageData {
  data: Data;
  more: number;
  offset?: number;
}
