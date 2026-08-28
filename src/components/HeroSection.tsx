'use client';

import React from 'react';
import Link from 'next/link';
import { AppItem, Platform } from '../types/app';
import styles from './HeroSection.module.css';
import buttonStyles from '@/components/Button.module.css';
import badgeStyles from '@/components/Badge.module.css';
import {
  IconDownload,
  IconPlay,
  IconSparkles,
  IconStar,
  IconWindows,
  IconApple,
  IconLinux,
  IconAndroid,
  IconWeb
} from './Icons';

interface HeroSectionProps {
  featuredApp: AppItem;
  onSelectApp?: (app: AppItem, openVideo?: boolean) => void;
  onDownload: (app: AppItem) => void;
}

export default function HeroSection({
  featuredApp,
  onSelectApp,
  onDownload
}: HeroSectionProps) {
  if (!featuredApp) return null;

  const renderPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'windows': return <IconWindows key="win" size={13} />;
      case 'macos': return <IconApple key="mac" size={13} />;
      case 'linux': return <IconLinux key="lin" size={13} />;
      case 'android': return <IconAndroid key="and" size={13} />;
      case 'web': return <IconWeb key="web" size={13} />;
      default: return null;
    }
  };

  const previewImage = featuredApp.screenshots[0] || featuredApp.iconUrl;

  return (
    <section className={styles["hero-spotlight"]}>
      <div className={styles["hero-glow-orb"]} />

      {/* Left Info Column */}
      <div className={styles["hero-content"]}>
        <div className={styles["hero-badges-row"]}>
          <span className={badgeStyles.badgeFeatured}>
            <IconSparkles size={12} color="#fde68a" />
            Spotlight Release
          </span>
          <span className={badgeStyles.badgeCategory}>{featuredApp.category}</span>
          <span className={badgeStyles.badgeVersion}>{featuredApp.version}</span>
        </div>

        <h1 className={styles["hero-title"]}>{featuredApp.name}</h1>
        <p className={styles["hero-tagline"]}>{featuredApp.tagline}</p>
        <p className={styles["hero-description"]}>{featuredApp.description}</p>

        {/* Platforms and Rating */}
        <div className={styles["hero-meta-row"]}>
          <div className={styles["hero-platforms-list"]}>
            {featuredApp.platforms.map((plat) => (
              <span key={plat} className={`\$\{badgeStyles.badgePlatform\} \$\{badgeStyles[plat]\}`}>
                {renderPlatformIcon(plat)}
                {plat}
              </span>
            ))}
          </div>

          <div className={styles["hero-rating-badge"]}>
            <IconStar size={14} fill="#fbbf24" color="#fbbf24" />
            <span>{featuredApp.stats.rating.toFixed(1)}</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '12px' }}>
              ({featuredApp.stats.ratingCount} reviews)
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className={styles["hero-actions"]}>
          <button
            onClick={() => onDownload(featuredApp)}
            className={`\$\{buttonStyles.btnDownloadBig\} \$\{styles["hero-btn-main"]\}`}
          >
            <IconDownload size={18} />
            <span>Download ({featuredApp.fileSize})</span>
          </button>

          <Link
            href={`/app/${featuredApp.id}?video=true`}
            className={`\$\{buttonStyles.btnSecondary\} \$\{styles["hero-btn-sub"]\}`}
            style={{ textDecoration: 'none' }}
          >
            <IconPlay size={15} color="var(--accent-cyan)" />
            <span>Watch Trailer</span>
          </Link>
        </div>
      </div>

      {/* Right Media Preview Box */}
      <Link
        href={`/app/${featuredApp.id}?video=true`}
        className={styles["hero-preview-container"]}
        title="Click to view showcase video and screenshots"
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <img
          src={previewImage}
          alt={`${featuredApp.name} preview showcase`}
          className={styles["hero-preview-image"]}
          loading="eager"
        />
        <div className={styles["hero-play-overlay"]}>
          <div className={styles["play-circle-btn"]}>
            <IconPlay size={22} color="#ffffff" />
          </div>
          <span className={styles["hero-play-label"]}>
            Play Video Trailer
          </span>
        </div>
      </Link>
    </section>
  );
}
