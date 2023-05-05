let files = [];

function add(file) {
  const fileIndex = files.push(file);

  return `dicomfile:${fileIndex - 1}`;
}

function get(index) {
  return files[index];
}

function remove(index) {
  files[index] = undefined;
}

function purge() {
  files = [];
}

const fileManager = {
  add,
  get,
  remove,
  purge,
};

export default fileManager;
