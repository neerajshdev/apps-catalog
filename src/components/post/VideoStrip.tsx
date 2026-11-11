'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { PostVideo } from '@/types/post';
import { IconPlay } from '@/components/Icons';
import styles from './VideoStrip.module.css';

interface VideoStripProps {
  videos: PostVideo[];
  title?: string;
}

/**
 * Horizontally scrollable video rail. Each card shows a local poster and only
 * mounts the YouTube iframe after a click, so the page ships no third-party
 * requests or heavy embeds on load.
 */
export default function VideoStrip({ videos, title = 'Videos' }: VideoStripProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  if (videos.length === 0) return null;

  return (
    <section className={styles['strip']} aria-label={title}>
      <div className={styles['strip-header']}>
        <h2 className={styles['strip-title']}>{title}</h2>
        <span className={styles['strip-hint']}>Click a card to play</span>
      </div>

      <ul className={styles['strip-track']}>
        {videos.map((video) => (
          <li key={video.youtubeId} className={styles['strip-item']}>
            <div className={styles['video-frame']}>
              {activeVideoId === video.youtubeId ? (
                <iframe
                  className={styles['video-embed']}
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  className={styles['video-facade']}
                  onClick={() => setActiveVideoId(video.youtubeId)}
                  aria-label={`Play ${video.title}`}
                >
                  <Image
                    src={video.poster}
                    alt=""
                    fill
                    sizes="(max-width: 760px) 80vw, 420px"
                    className={styles['video-poster']}
                  />
                  <span className={styles['video-play']} aria-hidden="true">
                    <IconPlay size={20} />
                  </span>
                  <span className={styles['video-title']}>{video.title}</span>
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
