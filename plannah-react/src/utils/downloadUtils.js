/**
 * Download data as a file
 * @param {string} data - Data to download
 * @param {string} filename - Name of the downloaded file
 * @param {string} type - MIME type of the file
 */
export const downloadFile = (data, filename, type) => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};