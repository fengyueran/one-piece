let options = {
  // callback to open the object
  open(xhr: XMLHttpRequest, url: string) {
    xhr.open('get', url, true);
  },
  // callback allowing customization of the xhr (e.g. adding custom auth headers, cors, etc)
  beforeSend(/* xhr, imageId */) {},
  // callback allowing modification of the xhr response before creating image objects
  beforeProcessing(xhr: XMLHttpRequest) {
    return Promise.resolve(xhr.response);
  },
  // callback allowing modification of newly created image objects
  imageCreated(/* image */) {},
  strict: false,
  decodeConfig: {
    convertFloatPixelDataToInt: true,
    use16BitDataType: false,
  },
};

export function setOptions(newOptions: object) {
  options = Object.assign(options, newOptions);
}

export function getOptions() {
  return options;
}
