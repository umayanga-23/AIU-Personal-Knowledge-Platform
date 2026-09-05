/**
 * Form Validation Utilities for Admin Forms
 */

// URL Validator
export function isValidUrl(urlString) {
  if (!urlString || !urlString.trim()) return true; // Optional URLs can be empty
  const str = urlString.trim();
  if (str.startsWith('data:') || str.startsWith('blob:')) return true;
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Auto-convert Google Drive & Unsplash share URLs to direct HTML <img> src stream URLs
export function formatImageUrl(url = '') {
  if (!url || !url.trim()) return '';
  const str = url.trim();

  // If Google Drive link: e.g. https://drive.google.com/file/d/1ABC123XYZ/view?usp=sharing
  if (str.includes('drive.google.com') || str.includes('docs.google.com')) {
    const match = str.match(/\/file\/d\/([^\/]+)/) || str.match(/id=([^&]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  return str;
}

// YouTube URL / ID Extractor
export function extractYoutubeId(urlOrId) {
  if (!urlOrId) return '';
  const str = urlOrId.trim();
  if (str.length === 11 && !str.includes('/') && !str.includes('.')) {
    return str;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = str.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

// Text Length Status
export function getLengthStatus(text = '', maxLength = 250) {
  const count = text.length;
  const remaining = maxLength - count;
  const isOver = count > maxLength;
  const isWarning = count >= maxLength * 0.8 && !isOver;

  return {
    count,
    maxLength,
    remaining,
    isOver,
    isWarning,
    percentage: Math.min(100, Math.round((count / maxLength) * 100))
  };
}
