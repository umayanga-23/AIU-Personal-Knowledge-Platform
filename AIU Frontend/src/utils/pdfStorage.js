/**
 * @deprecated
 * Legacy pdfStorage.js (IndexedDB) has been completely replaced by Supabase Storage
 * via mediaService.js. Binary files are now safely uploaded to Supabase Storage buckets.
 */

export const pdfStorage = {
  savePdf: async () => {},
  getPdf: async () => null,
  deletePdf: async () => {},
  clearAll: async () => {},
  triggerDownload: (url, filename) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'document.pdf';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
