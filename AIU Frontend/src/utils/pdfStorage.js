/**
 * Persistent PDF File Storage Engine using IndexedDB & Blob URL Generator
 * Bypasses Chrome/Edge Data URL download restrictions for instant 100% direct downloads.
 */

const DB_NAME = 'AIU_PDF_Storage';
const DB_VERSION = 1;
const STORE_NAME = 'cv_files';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function base64ToBlob(base64Data, contentType = 'application/pdf') {
  const parts = base64Data.split(';base64,');
  const type = parts[0].replace('data:', '') || contentType;
  const base64Str = parts[1] || parts[0];
  const binaryStr = atob(base64Str);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return new Blob([bytes], { type });
}

export const pdfStorage = {
  async savePdf(key, fileOrBase64, metadata = {}) {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ data: fileOrBase64, metadata, timestamp: Date.now() }, key);
      return new Promise((resolve) => {
        tx.oncomplete = () => resolve(true);
      });
    } catch (e) {
      console.warn('IndexedDB save failed:', e);
      return false;
    }
  },

  async getPdf(key) {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      return new Promise((resolve) => {
        req.onsuccess = () => resolve(req.result ? req.result.data : null);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      console.warn('IndexedDB read failed:', e);
      return null;
    }
  },

  triggerDownload(fileDataOrUrl, fileName = 'Induwara_Umayanga_Alukirthi_CV.pdf') {
    if (!fileDataOrUrl) return;

    // Handle Base64 Data URL cleanly via Blob URL (Bypasses Chrome data URL download restriction)
    if (fileDataOrUrl.startsWith('data:')) {
      try {
        const blob = base64ToBlob(fileDataOrUrl);
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
        return;
      } catch (e) {
        console.warn('Base64 blob conversion failed:', e);
      }
    }

    if (fileDataOrUrl.startsWith('blob:')) {
      const link = document.createElement('a');
      link.href = fileDataOrUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Direct HTTP / Remote URL download via fetch Blob
    fetch(fileDataOrUrl)
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 3000);
      })
      .catch(() => {
        const link = document.createElement('a');
        link.href = fileDataOrUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }
};
