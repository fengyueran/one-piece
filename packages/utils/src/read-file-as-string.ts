export const readFileAsString = (file: File): Promise<string> =>
  new Promise((reslove, reject) => {
    {
      const reader = new FileReader();

      reader.onload = function (event) {
        const fileContentString = event.target?.result;
        reslove(fileContentString as string);
      };

      reader.onerror = function (event) {
        reject(event.target?.error);
      };

      reader.readAsText(file);
    }
  });
