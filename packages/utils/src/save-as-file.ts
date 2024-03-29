export const saveAsFile = (
  fileName: string,
  content: BlobPart,
  mimeType: string = 'text/plain',
) => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    // Ensure that revokeObjectURL is called after a has been clicked.
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 0);
};
