import React, { useState } from 'react';
import { Play, Calendar, Youtube } from 'lucide-react';
import { Modal } from '../common/Modal';

export function VideoCard({ video }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

  return (
    <>
      <div className="group relative flex flex-col glass-card-hover rounded-2xl overflow-hidden">
        {/* Video Thumbnail */}
        <div className="relative h-48 w-full overflow-hidden bg-obsidian-base">
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-obsidian-base/50 group-hover:bg-obsidian-base/30 transition-colors flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(true)}
              className="w-14 h-14 rounded-full bg-cyan/90 text-obsidian-base flex items-center justify-center shadow-glow-cyan group-hover:scale-110 transition-transform"
              title="Watch Walkthrough Video"
            >
              <Play className="w-6 h-6 fill-obsidian-base ml-0.5" />
            </button>
          </div>
        </div>

        {/* Info Body */}
        <div className="flex-1 flex flex-col p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs text-typo-secondary font-mono">
            <Calendar className="w-3.5 h-3.5 text-cyan" />
            <span>{video.publishDate}</span>
          </div>

          <h3 className="text-base font-bold text-typo-primary group-hover:text-cyan transition-colors line-clamp-2">
            {video.title}
          </h3>

          <p className="text-xs text-typo-muted line-clamp-2 leading-relaxed font-sans">
            {video.description}
          </p>

          <div className="mt-auto pt-4 border-t border-obsidian-border flex items-center justify-between font-mono">
            <button
              onClick={() => setIsPlaying(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan hover:text-cyan-dark transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-cyan" /> Watch Inline
            </button>

            <a
              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-typo-muted hover:text-typo-primary transition-colors"
            >
              <Youtube className="w-4 h-4 text-cyan" /> Open YouTube
            </a>
          </div>
        </div>
      </div>

      {/* Embed Video Modal */}
      <Modal isOpen={isPlaying} onClose={() => setIsPlaying(false)} title={video.title} maxWidth="max-w-4xl">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-none"
          />
        </div>
      </Modal>
    </>
  );
}
