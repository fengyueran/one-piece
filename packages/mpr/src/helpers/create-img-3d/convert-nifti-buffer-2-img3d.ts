import { image, nifti } from '@cc/loader';

export const convertNiftiBuffer2Img3D = async (
  niftiBuffer: ArrayBuffer,
): Promise<image.Image3D<Int16Array>> => {
  const { buffer, info, header } = await nifti.parseNiftiWithWorker(niftiBuffer);

  const img3 = new image.Image3D<Int16Array>(
    info,
    new nifti.NiftiCache(buffer as Int16Array, info),
    Int16Array,
  );
  (img3 as any).niftiHeader = header;

  return img3;
};
