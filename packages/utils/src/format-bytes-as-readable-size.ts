export const formatBytesAsReadableSize = (byte: number = 0) => {
  if (byte < 1024) return `${byte} B`;

  const kb = byte / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;

  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(0)} MB`;

  const gb = mb / 1024;

  return `${gb.toFixed(0)} GB`;
};
