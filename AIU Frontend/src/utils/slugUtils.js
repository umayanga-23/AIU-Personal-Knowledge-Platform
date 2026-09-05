/**
 * Utility functions for clean, unique URL slug generation and conflict resolution
 */

export function generateSlug(text = '') {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric chars
    .replace(/[\s_]+/g, '-')     // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '');     // Trim leading/trailing hyphens
}

export function generateUniqueSlug(title = '', existingItems = [], currentId = null) {
  const baseSlug = generateSlug(title) || 'item';
  let slug = baseSlug;
  let counter = 1;

  while (
    existingItems.some(
      item => item && (item.slug === slug || item.id === slug) && item.id !== currentId
    )
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
