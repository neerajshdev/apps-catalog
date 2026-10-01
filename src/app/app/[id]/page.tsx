'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { AppItem, Platform } from '@/types/app';
import { INITIAL_APPS } from '@/data/initialApps';
import { getLocalApps, saveLocalApps } from '@/lib/storage';
import { useToast } from '@/components/Toast';
import { triggerArchiveDownload } from '@/lib/download';
import { getYouTubeEmbedUrl, extractYouTubeId } from '@/lib/youtube';
import ParticleBackground from '@/components/ParticleBackground';
import navbarStyles from '@/components/Navbar.module.css';
import styles from './page.module.css';
import layoutStyles from '@/components/SharedLayout.module.css';
import buttonStyles from '@/components/Button.module.css';
import badgeStyles from '@/components/Badge.module.css';
import {
  IconDownload,
  IconStar,
  IconClose,
  IconWindows,
  IconApple,
  IconLinux,
  IconAndroid,
  IconWeb,
  IconArrowLeft,
  IconCheck,
  IconBox,
  IconShare,
  IconShieldCheck,
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink,
  IconLock
} from '@/components/Icons';

function AppDetailContent() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [app, setApp] = useState<AppItem | null>(() => {
    if (!id) return null;
    return INITIAL_APPS.find((a) => a.id === id) || null;
  });

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const apps = getLocalApps();
      let found = apps.find((a) => a.id === id);
      if (!found) {
        found = INITIAL_APPS.find((a) => a.id === id);
      }
      if (found) {
        setApp(found);
      }
    }
  }, [id]);

  const handleDownloadApp = () => {
    if (!app) return;
    setIsDownloading(true);

    const apps = getLocalApps();
    const updated = apps.map((item) => {
      if (item.id === app.id) {
        return {
          ...item,
          stats: {
            ...item.stats,
            downloads: (item.stats?.downloads || 0) + 1
          }
        };
      }
      return item;
    });

    saveLocalApps(updated);
    setApp((prev) => prev ? {
      ...prev,
      stats: {
        ...prev.stats,
        downloads: (prev.stats?.downloads || 0) + 1
      }
    } : null);

    showToast(`Preparing download for ${app.name}...`, 'info');
    triggerArchiveDownload(app);

    setTimeout(() => {
      setIsDownloading(false);
      showToast(`Download started: ${app.archiveFileName || `${app.name}.zip`}`, 'success');
    }, 1200);
  };

  const handleShareApp = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  const handleToggleWishlist = () => {
    setIsSaved((prev) => {
      const next = !prev;
      showToast(next ? `Saved ${app?.name} to wishlist!` : `Removed ${app?.name} from wishlist`, 'info');
      return next;
    });
  };

  const handleScrollGallery = (direction: 'left' | 'right') => {
    if (!scrollerRef.current) return;
    const scrollAmount = 450;
    scrollerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const renderPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'windows': return <IconWindows size={13} />;
      case 'macos': return <IconApple size={13} />;
      case 'linux': return <IconLinux size={13} />;
      case 'android': return <IconAndroid size={13} />;
      case 'web': return <IconWeb size={13} />;
      default: return null;
    }
  };

  if (!app) {
    return (
      <div className={layoutStyles.appViewport}>
        <ParticleBackground />
        <header className={navbarStyles["navbar-container"]}>
          <div className={navbarStyles["navbar-inner"]}>
            <Link href="/" className={navbarStyles["brand-logo"]}>
              <div className={navbarStyles["brand-icon-box"]}>
                <IconBox size={20} color="#ffffff" />
              </div>
              <div className={navbarStyles["brand-text"]}>
                <span className={navbarStyles["brand-title"]}>VAULT.DIST</span>
              </div>
            </Link>
            <Link href="/" className={styles["back-icon-btn"]} title="Back to Store">
              <IconArrowLeft size={18} />
            </Link>
          </div>
        </header>

        <main className={layoutStyles.mainContent} style={{ textAlign: 'center', padding: '120px 20px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>Application Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>The application release you are looking for does not exist or has been removed.</p>
          <Link href="/" className={buttonStyles.btnPrimary} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <IconArrowLeft size={18} />
            <span>Return to Store Showcase</span>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className={layoutStyles.appViewport}>
      <ParticleBackground />

      {/* Top Navbar */}
      <header className={navbarStyles["navbar-container"]}>
        <div className={navbarStyles["navbar-inner"]}>
          <div className={navbarStyles["navbar-brand-section"]}>
            <Link href="/" className={navbarStyles["brand-logo"]}>
              <div className={navbarStyles["brand-icon-box"]}>
                <IconBox size={20} color="#ffffff" />
              </div>
              <div className={navbarStyles["brand-text"]}>
                <span className={navbarStyles["brand-title"]}>VAULT.DIST</span>
                <span className={navbarStyles["brand-subtitle"]}>App Distribution</span>
              </div>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" className={styles["back-icon-btn"]} title="Back to Store">
              <IconArrowLeft size={18} />
            </Link>
            <Link href="/publisher" className={`${buttonStyles.btnSecondary} ${navbarStyles["nav-publisher-btn"]}`} title="Publisher Portal">
              <IconLock size={13} color="var(--accent-purple)" />
              <span>Publisher Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={layoutStyles.mainContent} style={{ paddingTop: '20px', maxWidth: '1280px', display: 'flex', flexDirection: 'column', gap: '36px' }}>

        {/* 1. Breadcrumb & Actions Bar (On top before app details) */}
        <div className={styles["top-nav-bar"]}>
          <div className={styles["nav-left-group"]}>
            <Link href="/" className={styles["back-icon-btn"]} title="Back to Store">
              <IconArrowLeft size={18} />
            </Link>

            <nav className={styles["breadcrumb-trail"]} aria-label="Breadcrumb">
              <Link href="/" className={styles["breadcrumb-link"]}>Store</Link>
              <span>/</span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{app.category}</span>
              <span>/</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{app.name}</span>
            </nav>
          </div>

          <div className={styles["nav-actions-group"]}>
            <button
              className={buttonStyles.btnIcon}
              onClick={handleShareApp}
              title="Share App Link"
            >
              <IconShare size={18} />
            </button>
            <button
              className={buttonStyles.btnIcon}
              onClick={handleToggleWishlist}
              title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
              style={{
                color: isSaved ? '#f59e0b' : 'inherit',
                borderColor: isSaved ? '#f59e0b' : 'var(--border-subtle)'
              }}
            >
              <IconStar size={18} fill={isSaved ? '#f59e0b' : 'none'} color={isSaved ? '#f59e0b' : 'currentColor'} />
            </button>
          </div>
        </div>

        {/* 2. App Hero Showcase Header (Play Store Style) */}
        <div className={styles["app-hero-header"]}>
          
          {/* App Icon */}
          <div className={styles["app-icon-wrapper"]}>
            <img
              src={app.iconUrl}
              alt={`${app.name} icon`}
              className={styles["app-icon-img"]}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&h=256&q=80';
              }}
            />
          </div>

          {/* App Info & Action Column */}
          <div className={styles["app-info-col"]}>
            <div className={styles["app-title-row"]}>
              <h1 className={styles["app-main-title"]}>{app.name}</h1>
              <span className={badgeStyles.badgeCategory}>{app.category}</span>
            </div>

            <div className={styles["app-developer-byline"]}>
              <span>Published by {app.developer?.name || 'Independent Creator'}</span>
              {app.developer?.badge && (
                <span className={badgeStyles.badgeFeatured} style={{ padding: '2px 8px', fontSize: '10px' }}>
                  {app.developer.badge}
                </span>
              )}
            </div>

            <p className={styles["app-tagline"]}>
              {app.tagline}
            </p>

            {/* Micro-Stats Pills */}
            <div className={styles["stats-pills-row"]}>
              <div className={styles["stat-pill"]}>
                <IconStar size={15} fill="#fbbf24" color="#fbbf24" />
                <span>{app.stats?.rating?.toFixed(1) || '5.0'}</span>
                <span className={styles["stat-pill-label"]}>Rating</span>
              </div>

              <div className={styles["stat-pill"]}>
                <span>{app.stats?.downloads?.toLocaleString() || '0'}</span>
                <span className={styles["stat-pill-label"]}>Downloads</span>
              </div>

              <div className={styles["stat-pill"]}>
                <span>{app.fileSize || '25 MB'}</span>
                <span className={styles["stat-pill-label"]}>Archive</span>
              </div>

              <div className={styles["stat-pill"]} style={{ color: 'var(--accent-emerald)' }}>
                <IconShieldCheck size={16} />
                <span>Verified Safe</span>
              </div>
            </div>

            {/* Primary Action Row */}
            <div className={styles["action-buttons-row"]}>
              <button
                className={buttonStyles.btnDownloadBig}
                style={{ padding: '14px 32px', fontSize: '15px' }}
                onClick={handleDownloadApp}
                disabled={isDownloading}
              >
                <IconDownload size={20} />
                <span>{isDownloading ? 'Starting Download...' : 'Get App Archive'}</span>
              </button>

              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {app.archiveFileName || `${app.name}.zip`}
              </span>
            </div>

            {/* Supported OS Chips */}
            <div className={styles["platforms-chips-row"]}>
              <span className={styles["platform-chips-label"]}>Supported OS:</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {app.platforms?.map((p) => (
                  <span key={p} className={`${badgeStyles.badgePlatform} ${badgeStyles[p]}`} style={{ padding: '3px 9px', fontSize: '11px' }}>
                    {renderPlatformIcon(p)}
                    {p}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 3. Media Gallery (Horizontal Strip with Arrow Controls) */}
        <section className={styles["gallery-section"]}>
          <div className={styles["gallery-header-row"]}>
            <h2 className={styles["gallery-title"]}>Preview Gallery</h2>
            <div className={styles["gallery-nav-controls"]}>
              <button
                className={styles["gallery-nav-btn"]}
                onClick={() => handleScrollGallery('left')}
                title="Scroll Left"
              >
                <IconChevronLeft size={18} />
              </button>
              <button
                className={styles["gallery-nav-btn"]}
                onClick={() => handleScrollGallery('right')}
                title="Scroll Right"
              >
                <IconChevronRight size={18} />
              </button>
            </div>
          </div>

          <div ref={scrollerRef} className={styles["media-scroller"]}>
            {/* Videos */}
            {app.youtubeVideos?.map((vid, i) => (
              <div key={`vid-${i}`} className={styles["media-item-card"]}>
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(vid)}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={styles["video-iframe"]}
                ></iframe>
              </div>
            ))}

            {/* Screenshots */}
            {app.screenshots?.map((img, i) => (
              <div
                key={`img-${i}`}
                className={`${styles["media-item-card"]} ${styles["screenshot-card"]}`}
                onClick={() => setLightboxImage(img)}
              >
                <img
                  src={img}
                  alt={`${app.name} preview ${i + 1}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className={styles["screenshot-zoom-overlay"]}>
                  <span>Click to expand</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Structured Details Grid (Steam & Play Store Hybrid) */}
        <div className={styles["details-layout-grid"]}>

          {/* Left Column: Description & Key Features */}
          <div className={styles["details-main-col"]}>
            
            {/* About App */}
            <div>
              <h2 className={styles["section-heading"]}>About this application</h2>
              <div className={styles["rich-description"]}>
                {app.description}
              </div>
            </div>

            {/* Key Features */}
            {app.features && app.features.length > 0 && (
              <div>
                <h2 className={styles["section-heading"]}>Key Features</h2>
                <div className={styles["features-list"]}>
                  {app.features.map((feature, i) => (
                    <div key={i} className={styles["feature-card"]}>
                      <div className={styles["feature-check-icon"]}>
                        <IconCheck size={14} />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Metadata & System Requirements */}
          <div className={styles["details-side-col"]}>

            {/* App Specifications */}
            <div className={styles["spec-card"]}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
                Application Info
              </h3>

              <div className={styles["spec-row"]}>
                <span className={styles["spec-label"]}>Version</span>
                <span className={styles["spec-value"]}>{app.version || '1.0.0'}</span>
              </div>

              <div className={styles["spec-row"]}>
                <span className={styles["spec-label"]}>Release Date</span>
                <span className={styles["spec-value"]}>{app.releaseDate || 'Recent'}</span>
              </div>

              <div className={styles["spec-row"]}>
                <span className={styles["spec-label"]}>Developer</span>
                <span className={styles["spec-value"]}>{app.developer?.name || 'Independent'}</span>
              </div>

              {app.developer?.website && (
                <div className={styles["spec-row"]}>
                  <span className={styles["spec-label"]}>Website</span>
                  <a
                    href={app.developer.website}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600 }}
                  >
                    <span>Visit Site</span>
                    <IconExternalLink size={13} />
                  </a>
                </div>
              )}

              <div className={styles["spec-row"]}>
                <span className={styles["spec-label"]}>Category</span>
                <span className={styles["spec-value"]}>{app.category}</span>
              </div>

              <div className={styles["spec-row"]}>
                <span className={styles["spec-label"]}>Package Type</span>
                <span className={styles["spec-value"]}>ZIP Compressed Archive</span>
              </div>
            </div>

            {/* System Requirements */}
            {app.systemRequirements && Object.keys(app.systemRequirements).length > 0 && (
              <div className={styles["spec-card"]}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
                  System Requirements
                </h3>

                {Object.entries(app.systemRequirements).map(([key, val]) => (
                  <div key={key} className={styles["spec-row"]}>
                    <span className={styles["spec-label"]} style={{ textTransform: 'capitalize' }}>{key}</span>
                    <span className={styles["spec-value"]}>{String(val)}</span>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Lightbox Fullscreen Modal */}
      {lightboxImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(12px)',
            padding: '20px'
          }}
          onClick={() => setLightboxImage(null)}
        >
          <button
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer'
            }}
            onClick={() => setLightboxImage(null)}
          >
            <IconClose size={24} />
          </button>
          <img
            src={lightboxImage}
            alt="Full resolution preview"
            style={{
              maxWidth: '92vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)'
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function AppDetailPage() {
  return (
    <Suspense fallback={
      <div className={layoutStyles.appViewport} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <ParticleBackground />
        <div style={{ textAlign: 'center', zIndex: 1, color: 'var(--text-muted)' }}>
          <p>Loading application...</p>
        </div>
      </div>
    }>
      <AppDetailContent />
    </Suspense>
  );
}
