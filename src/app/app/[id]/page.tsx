'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  IconVideo,
  IconImage,
  IconClose,
  IconWindows,
  IconApple,
  IconLinux,
  IconAndroid,
  IconWeb,
  IconArrowLeft,
  IconCheck,
  IconBox,
  IconSparkles,
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

  const [activeTab, setActiveTab] = useState<'video' | 'screenshots'>('video');
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState<number>(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const apps = getLocalApps();
      let found = apps.find((a) => a.id === id);
      if (!found) {
        found = INITIAL_APPS.find((a) => a.id === id);
      }
      if (found) {
        setApp(found);
        
        const openVideo = searchParams.get('video') === 'true';
        if (openVideo && found.youtubeVideos && found.youtubeVideos.length > 0) {
          setActiveTab('video');
          setSelectedVideoIndex(0);
        } else if (found.youtubeVideos && found.youtubeVideos.length > 0) {
          setActiveTab('video');
          setSelectedVideoIndex(0);
        } else if (found.screenshots && found.screenshots.length > 0) {
          setActiveTab('screenshots');
          setSelectedScreenshotIndex(0);
        }
      }
    }
  }, [id, searchParams]);

  // Handle ESC key for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxImage) {
          setLightboxImage(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage]);

  const handleDownloadApp = () => {
    if (!app) return;
    
    triggerArchiveDownload(app);

    const apps = getLocalApps();
    const updated = apps.map((item) =>
      item.id === app.id
        ? {
            ...item,
            stats: {
              ...item.stats,
              downloads: (item.stats?.downloads || 0) + 1
            }
          }
        : item
    );
    saveLocalApps(updated);
    
    setApp((prev) => prev ? {
      ...prev,
      stats: {
        ...prev.stats,
        downloads: (prev.stats?.downloads || 0) + 1
      }
    } : null);

    showToast({
      type: 'success',
      title: `Downloading ${app.name}`,
      message: `Archive: ${app.archiveFileName || `${app.name}.zip`} (${app.fileSize})`
    });
  };

  const handleShare = () => {
    if (!app) return;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast({
        type: 'info',
        title: 'Link Copied',
        message: `Share link for ${app.name} copied to clipboard!`
      });
    }
  };

  const renderPlatformIcon = (platform: Platform | string) => {
    switch (platform) {
      case 'windows': return <IconWindows key="win" size={13} />;
      case 'macos': return <IconApple key="mac" size={13} />;
      case 'linux': return <IconLinux key="lin" size={13} />;
      case 'android': return <IconAndroid key="and" size={13} />;
      case 'ios': return <IconApple key="ios" size={13} />;
      case 'web': return <IconWeb key="web" size={13} />;
      default: return null;
    }
  };

  if (!app) {
    return (
      <div className={layoutStyles.appViewport} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <ParticleBackground />
        <div style={{ textAlign: 'center', zIndex: 1, padding: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>Application Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>The application release you are looking for does not exist or has been removed.</p>
          <Link href="/" className={buttonStyles.btnPrimary} style={{ textDecoration: 'none' }}>
            <IconArrowLeft size={16} /> Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const activeVideoUrl = app.youtubeVideos?.[selectedVideoIndex];
  const activeScreenshotUrl = app.screenshots?.[selectedScreenshotIndex] || app.iconUrl;
  const embedUrl = activeVideoUrl ? (getYouTubeEmbedUrl(activeVideoUrl) || `https://www.youtube-nocookie.com/embed/${extractYouTubeId(activeVideoUrl)}?autoplay=0&rel=0`) : null;

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
            <Link href="/" className={buttonStyles.btnSecondary} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', fontSize: '13px' }}>
              <IconArrowLeft size={16} />
              <span>Back to Store</span>
            </Link>
            <Link href="/publisher" className={`\$\{buttonStyles.btnSecondary\} \$\{navbarStyles["nav-publisher-btn"]\}`} title="Publisher Portal">
              <IconLock size={13} color="var(--accent-purple)" />
              <span>Publisher Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={layoutStyles.mainContent} style={{ paddingTop: '24px', maxWidth: '1300px' }}>
        
        {/* Navigation Breadcrumb Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className={styles["hover-underline"]}>Store</Link>
            <span>/</span>
            <span style={{ color: 'var(--accent-cyan)' }}>{app.category}</span>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{app.name}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleShare} className={buttonStyles.btnSecondary} style={{ padding: '7px 14px', fontSize: '12px' }}>
              Share Link
            </button>
            <Link href="/" className={buttonStyles.btnSecondary} style={{ padding: '7px 14px', fontSize: '12px', textDecoration: 'none' }}>
              <IconArrowLeft size={14} /> Back to Catalog
            </Link>
          </div>
        </div>

        {/* Primary Showcase Card */}
        <div className={layoutStyles.glassPanel} style={{ padding: '28px', marginBottom: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '28px', alignItems: 'start' }}>
            
            {/* Left: Media Showcase */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0 }}>
              
              {/* Media Mode Tabs */}
              {(app.youtubeVideos?.length > 0 || app.screenshots?.length > 0) && (
                <div className={styles["media-tabs-rail"]}>
                  {app.youtubeVideos?.length > 0 && (
                    <button
                      className={`${styles["media-tab-btn"]} ${activeTab === 'video' ? 'active' : ''}`}
                      onClick={() => setActiveTab('video')}
                    >
                      <IconVideo size={14} color={activeTab === 'video' ? '#f43f5e' : 'currentColor'} />
                      <span>Trailers & Videos ({app.youtubeVideos.length})</span>
                    </button>
                  )}
                  {app.screenshots?.length > 0 && (
                    <button
                      className={`${styles["media-tab-btn"]} ${activeTab === 'screenshots' ? 'active' : ''}`}
                      onClick={() => setActiveTab('screenshots')}
                    >
                      <IconImage size={14} color={activeTab === 'screenshots' ? '#38bdf8' : 'currentColor'} />
                      <span>Screenshots & Photos ({app.screenshots.length})</span>
                    </button>
                  )}
                </div>
              )}

              {/* Main Media Display Viewport */}
              {activeTab === 'video' && embedUrl ? (
                <div className={styles["video-container"]}>
                  <iframe
                    className={styles["video-iframe"]}
                    src={embedUrl}
                    title={`${app.name} Showcase Video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div 
                  className={styles["screenshot-main"]} 
                  onClick={() => setLightboxImage(activeScreenshotUrl)}
                  title="Click to view full-resolution screenshot"
                >
                  <img
                    src={activeScreenshotUrl}
                    alt={`${app.name} Screenshot Preview`}
                    loading="eager"
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    padding: '4px 10px',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <IconImage size={12} /> Click to Enlarge
                  </div>
                </div>
              )}

              {/* Media Thumbnails Reel */}
              {activeTab === 'video' && app.youtubeVideos?.length > 1 && (
                <div className={styles["screenshot-thumbnails"]}>
                  {app.youtubeVideos.map((url, i) => {
                    const videoId = extractYouTubeId(url);
                    const thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';
                    return (
                      <button
                        key={i}
                        className={`${styles["screenshot-thumb"]} ${selectedVideoIndex === i ? 'active' : ''}`}
                        onClick={() => setSelectedVideoIndex(i)}
                        style={{ position: 'relative' }}
                      >
                        {thumbUrl ? (
                          <img src={thumbUrl} alt={`Trailer ${i + 1}`} />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#111' }}>
                            <IconVideo size={16} color="#f43f5e" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {activeTab === 'screenshots' && app.screenshots?.length > 1 && (
                <div className={styles["screenshot-thumbnails"]}>
                  {app.screenshots.map((url, i) => (
                    <button
                      key={i}
                      className={`${styles["screenshot-thumb"]} ${selectedScreenshotIndex === i ? 'active' : ''}`}
                      onClick={() => setSelectedScreenshotIndex(i)}
                    >
                      <img src={url} alt={`Screenshot ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Metadata & Download Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* App Identity Header */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <img
                  src={app.iconUrl}
                  alt={`${app.name} Icon`}
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '20px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&h=256&q=80';
                  }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className={badgeStyles.badgeCategory}>{app.category}</span>
                    {app.isFeatured && (
                      <span className={badgeStyles.badgeFeatured}>
                        <IconSparkles size={11} color="#fde68a" /> Spotlight
                      </span>
                    )}
                    <span className={badgeStyles.badgeVersion}>{app.version}</span>
                  </div>

                  <h1 style={{ fontSize: '26px', fontWeight: 800, lineHeight: 1.15, marginTop: '4px' }}>{app.name}</h1>
                  <p style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '13px' }}>{app.tagline}</p>
                  
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Published by <strong style={{ color: 'var(--text-primary)' }}>{app.developer?.name || 'Independent Creator'}</strong>
                    {app.developer?.badge && <span style={{ marginLeft: '6px', color: 'var(--accent-primary)' }}>• {app.developer.badge}</span>}
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                padding: '16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Rating</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '2px', fontWeight: 700, color: '#fbbf24', fontSize: '15px' }}>
                    <IconStar size={14} fill="#fbbf24" color="#fbbf24" /> {app.stats?.rating?.toFixed(1) || '5.0'}
                  </div>
                </div>
                <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Downloads</div>
                  <div style={{ marginTop: '2px', fontWeight: 700, color: 'var(--text-primary)', fontSize: '15px' }}>
                    {app.stats?.downloads?.toLocaleString() || '0'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Archive Size</div>
                  <div style={{ marginTop: '2px', fontWeight: 700, color: 'var(--accent-emerald)', fontSize: '15px' }}>
                    {app.fileSize || '25 MB'}
                  </div>
                </div>
              </div>

              {/* Supported OS Platforms */}
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '8px' }}>Supported Operating Systems</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {app.platforms?.map((p) => (
                    <span key={p} className={`\$\{badgeStyles.badgePlatform\} \$\{badgeStyles[p]\}`}>
                      {renderPlatformIcon(p)}
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Big Download Button */}
              <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                <button
                  className={buttonStyles.btnDownloadBig}
                  style={{ width: '100%', padding: '14px 20px', fontSize: '15px', justifyContent: 'center' }}
                  onClick={handleDownloadApp}
                >
                  <IconDownload size={20} />
                  <span>Download Archive ({app.archiveFileName || `${app.name}.zip`})</span>
                </button>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
                  Direct release package • Scanned and verified safe archive
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Detailed Breakdown Grid: About, Features, Requirements */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px', marginBottom: '40px' }}>
          
          {/* About Section */}
          <div className={layoutStyles.glassPanel} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>About {app.name}</span>
            </h3>
            <div className={styles["rich-description"]} style={{ whiteSpace: 'pre-wrap' }}>
              {app.description}
            </div>
          </div>

          {/* Key Features & System Requirements */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Features */}
            {app.features && app.features.length > 0 && (
              <div className={layoutStyles.glassPanel} style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'var(--accent-cyan)' }}>
                  Key Features
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {app.features.map((feature, i) => (
                    <div key={i} className={styles["feature-card"]}>
                      <div className={styles["feature-check-icon"]}>
                        <IconCheck size={16} />
                      </div>
                      <div>{feature}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Requirements */}
            <div className={layoutStyles.glassPanel} style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                System Requirements
              </h3>
              <div className={styles["requirements-box"]}>
                {Object.entries(app.systemRequirements || {}).map(([key, val]) => (
                  <div key={key}>
                    <div className={styles["req-item-label"]}>{key}</div>
                    <div className={styles["req-item-value"]}>{String(val)}</div>
                  </div>
                ))}
              </div>
            </div>

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
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
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

