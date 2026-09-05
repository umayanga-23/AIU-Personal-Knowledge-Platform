import { useEffect } from 'react';

export function SeoHead({
  title,
  description = 'Personal digital knowledge platform, research archive, technical articles, software projects, and engineering journey of Induwara Umayanga Alukirthi.',
  image = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  url = window.location.href,
  type = 'website'
}) {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title
      ? `${title} | Induwara Umayanga Alukirthi`
      : 'AIU Platform — Engineering & Research Portfolio';
    document.title = formattedTitle;

    // Helper to safely set or create meta tags
    const updateOrCreateMeta = (attrName, attrValue, contentValue) => {
      if (!contentValue) return;
      let metaTag = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute(attrName, attrValue);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', contentValue);
    };

    // 2. Standard Meta Tags
    updateOrCreateMeta('name', 'description', description);

    // 3. OpenGraph Social Media Meta Tags (WhatsApp, LinkedIn, Facebook, Slack)
    updateOrCreateMeta('property', 'og:title', formattedTitle);
    updateOrCreateMeta('property', 'og:description', description);
    updateOrCreateMeta('property', 'og:image', image);
    updateOrCreateMeta('property', 'og:url', url || window.location.href);
    updateOrCreateMeta('property', 'og:type', type);
    updateOrCreateMeta('property', 'og:site_name', 'Induwara Umayanga Portfolio');

    // 4. Twitter / X Meta Cards
    updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMeta('name', 'twitter:title', formattedTitle);
    updateOrCreateMeta('name', 'twitter:description', description);
    updateOrCreateMeta('name', 'twitter:image', image);

  }, [title, description, image, url, type]);

  return null;
}
