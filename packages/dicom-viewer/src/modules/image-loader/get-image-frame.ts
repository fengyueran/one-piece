const getImageFrame = (getTag: (tagName: string) => any) => {
  return {
    samplesPerPixel: getTag('SamplesPerPixel'),
    photometricInterpretation: getTag('PhotometricInterpretation'),
    rows: getTag('Rows'),
    columns: getTag('Columns'),
    bitsAllocated: getTag('BitsAllocated'),
    bitsStored: getTag('BitsStored'),
    highBit: getTag('HighBit'),
    pixelRepresentation: getTag('PixelRepresentation'),
    planarConfiguration: getTag('PlanarConfiguration'),
    pixelAspectRatio: getTag('PixelAspectRatio'),
    smallestPixelValue: getTag('SmallestImagePixelValue'),
    largestPixelValue: getTag('LargestImagePixelValue'),
    redPaletteColorLookupTableDescriptor: getTag('RedPaletteColorLookupTableDescriptor'),
    greenPaletteColorLookupTableDescriptor: getTag('GreenPaletteColorLookupTableDescriptor'),
    bluePaletteColorLookupTableDescriptor: getTag('BluePaletteColorLookupTableDescriptor'),
    redPaletteColorLookupTableData: getTag('RedPaletteColorLookupTableData'),
    greenPaletteColorLookupTableData: getTag('GreenPaletteColorLookupTableData'),
    bluePaletteColorLookupTableData: getTag('BluePaletteColorLookupTableData'),
  };
};

export type ImageFrame = ReturnType<typeof getImageFrame>;

export default getImageFrame;
