export const formatBytesAsReadableSize = (byte: number = 0, decimals = 0) => {
  if (byte < 1024) return `${byte.toFixed(decimals)} B`;

  const kb = byte / 1024;
  if (kb < 1024) return `${kb.toFixed(decimals)} KB`;

  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(decimals)} MB`;

  const gb = mb / 1024;

  return `${gb.toFixed(decimals)} GB`;
};
