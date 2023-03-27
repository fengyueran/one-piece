// import parseImageId from './parseImageId.js';
// import fileManager from './fileManager.js';

const loadLocalFile = (file: File): Promise<ArrayBuffer> => {
  //   const parsedImageId = parseImageId(uri);
  //   const fileIndex = parseInt(parsedImageId.url, 10);
  //   const file = fileManager.get(fileIndex);

  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      resolve(arrayBuffer);
    };

    fileReader.onerror = reject;

    fileReader.readAsArrayBuffer(file);
  });
};

export default loadLocalFile;
