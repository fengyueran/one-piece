export interface Tag {
  tag: string;
  vr: string;
  vm: number | string;
  name: string;
}

export type TagDict = { [attr: string]: Tag };

export interface ImageTags {
  SamplesPerPixel: number; // 00280002
  PhotometricInterpretation: string; // 00280004
  PlanarConfiguration: number; // 00280006
  Rows: number; // 00280010
  Columns: number; // 00280011
  BitsAllocated: number; // 00280100
  BitsStored: number; // 0280101
  HighBit: number; // 00280102
  PixelRepresentation: number; // 00280103
}
