export enum ReadAsType {
  'Text',
  'BinaryString',
  'DataURL',
  'ArrayBuffer',
}

export const readFile = (file: File, readAs = ReadAsType.Text): Promise<string | ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target?.result);
    };

    reader.onerror = (event) => {
      reject(event.target?.error);
    };

    switch (readAs) {
      case ReadAsType.Text:
        reader.readAsText(file);
        break;
      case ReadAsType.BinaryString:
        reader.readAsBinaryString(file);
        break;
      case ReadAsType.DataURL:
        reader.readAsDataURL(file);
        break;
      case ReadAsType.ArrayBuffer:
        reader.readAsArrayBuffer(file);
        break;
      default:
        reject(new Error('Unsupported read type'));
    }
  });
