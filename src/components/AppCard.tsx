'use client';

import React from 'react';
import Link from 'next/link';
import { AppItem, Platform } from '../types/app';
import styles from './AppCard.module.css';
import badgeStyles from '@/components/Badge.module.css';
import {
  IconDownload,
  IconStar,
  IconVideo,
  IconImage,
  IconWindows,
  IconApple,
  IconLinux,
  IconAndroid,
  IconWeb,
} from './Icons';

interface AppCardProps {
  app: AppItem;
  onSelect?: (app: AppItem) => void;
  onDownload: (app: AppItem, e: React.MouseEvent) => void;
}

export default function AppCard({ app, onSelect, onDownload }: AppCardProps) {
  const renderPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'windows': return <IconWindows key="win" size={12} />;
      case 'macos': return <IconApple key="mac" size={12} />;
      case 'linux': return <IconLinux key="lin" size={12} />;
      case 'android': return <IconAndroid key="and" size={12} />;
      case 'web': return <IconWeb key="web" size={12} />;
      default: return null;
    }
  };

  const isRecent = Date.now() - app.createdAt < 1000 * 60 * 60 * 24 * 5; // within 5 days

  return (
    <Link
      href={`/app/${app.id}`}
      className={styles["app-card"]}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      {/* Top Details */}
      <div className={styles["app-card-top"]}>
        <img
          src={app.iconUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&h=128&q=80'}
          alt={`${app.name} Icon`}
          className={styles["app-card-icon"]}
          loading="lazy"
          onError={(e) => {
            // fallback if broken image
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&h=128&q=80';
          }}
        />

        <div className={styles["app-card-header-info"]}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
            <span className={badgeStyles.badgeCategory} style={{ fontSize: '10px', padding: '2px 7px' }}>
              {app.category}
            </span>
            {isRecent && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#4ade80',
                  background: 'rgba(74, 222, 128, 0.12)',
                  border: '1px solid rgba(74, 222, 128, 0.3)',
                  borderRadius: 'var(--radius-full)',
                  padding: '1px 6px'
                }}
              >
                NEW
              </span>
            )}
          </div>

          <h3 className={styles["app-card-title"]} title={app.name}>{app.name}</h3>

          <div className={styles["app-card-developer"]}>
            <span>by {app.developer.name}</span>
          </div>

          <div className={styles["app-card-rating"]}>
            <IconStar size={13} fill="#fbbf24" color="#fbbf24" />
            <span>{app.stats.rating.toFixed(1)}</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '11px' }}>
              ({app.stats.downloads > 999 ? `${(app.stats.downloads / 1000).toFixed(1)}k` : app.stats.downloads} dl)
            </span>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <p className={styles["app-card-tagline"]}>{app.tagline}</p>

      {/* Media indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
        {app.youtubeVideos.length > 0 && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f43f5e' }}>
            <IconVideo size={13} />
            <span>{app.youtubeVideos.length} Video{app.youtubeVideos.length > 1 ? 's' : ''}</span>
          </span>
        )}
        {app.screenshots.length > 0 && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#38bdf8' }}>
            <IconImage size={13} />
            <span>{app.screenshots.length} Photo{app.screenshots.length > 1 ? 's' : ''}</span>
          </span>
        )}
      </div>

      {/* Platforms */}
      <div className={styles["app-card-platforms"]}>
        {app.platforms.map((plat) => (
          <span key={plat} className={`\$\{badgeStyles.badgePlatform\} \$\{badgeStyles[plat]\}`}>
            {renderPlatformIcon(plat)}
            {plat}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className={styles["app-card-footer"]}>
        <div className={styles["app-card-meta"]}>
          <span className={badgeStyles.badgeVersion}>{app.version}</span>
          <span className={styles["app-card-size"]}>{app.fileSize}</span>
        </div>

        <button
          className={styles["app-card-btn-download"]}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDownload(app, e);
          }}
          title={`Download ${app.archiveFileName || app.name}`}
        >
          <IconDownload size={14} />
          <span>Get Archive</span>
        </button>
      </div>
    </Link>
  );
}

