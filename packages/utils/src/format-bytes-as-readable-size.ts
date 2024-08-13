export const formatBytesAsReadableSize = (byte: number = 0, decimals = 0) => {
  const numberByte = Number(byte);

  if (isNaN(numberByte)) {
    throw new Error('Invalid input: byte size must be a numeric value');
  }
  if (byte < 0) {
    throw new Error('Byte size cannot be negative');
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  let size = numberByte;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(decimals)} ${units[index]}`;
};
