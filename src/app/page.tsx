'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import CategoryFilter, { SortOption } from '@/components/CategoryFilter';
import AppCard from '@/components/AppCard';
import { useToast } from '@/components/Toast';
import { AppItem, Category, Platform } from '@/types/app';
import { INITIAL_APPS } from '@/data/initialApps';
import { getLocalApps, saveLocalApps } from '@/lib/storage';
import { triggerArchiveDownload } from '@/lib/download';
import { IconBox, IconSearch, IconSparkles, IconClose } from '@/components/Icons';
import styles from './page.module.css';
import layoutStyles from '@/components/SharedLayout.module.css';
import buttonStyles from '@/components/Button.module.css';

export default function HomePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPS);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Initialize apps from storage and sync with API
  useEffect(() => {
    const loadedApps = getLocalApps();
    if (loadedApps && loadedApps.length > 0) {
      setApps(loadedApps);
    }

    // Also fetch from API route with headers to bypass proxy/ngrok warnings
    fetch('/api/apps', {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('API fetch error');
        return res.json();
      })
      .then((data) => {
        if (data && data.success && Array.isArray(data.apps) && data.apps.length > 0) {
          setApps((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const merged = [...prev];
            data.apps.forEach((a: AppItem) => {
              if (!existingIds.has(a.id)) {
                merged.push(a);
              }
            });
            saveLocalApps(merged);
            return merged;
          });
        }
      })
      .catch((err) => {
        console.warn('API sync fallback:', err);
      });
  }, []);

  // Keyboard shortcut for clearing search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (searchQuery) {
          setSearchQuery('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  // Filtered & Sorted Apps
  const filteredApps = useMemo(() => {
    let result = [...apps];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (app) =>
          app.name.toLowerCase().includes(q) ||
          app.tagline.toLowerCase().includes(q) ||
          app.description.toLowerCase().includes(q) ||
          app.category.toLowerCase().includes(q) ||
          app.developer.name.toLowerCase().includes(q) ||
          app.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter((app) => app.category === activeCategory);
    }

    // Platform filter
    if (selectedPlatform !== 'all') {
      result = result.filter((app) => app.platforms.includes(selectedPlatform));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.stats.rating - a.stats.rating;
      }
      if (sortBy === 'downloads') {
        return b.stats.downloads - a.stats.downloads;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      // 'newest' (default)
      return b.createdAt - a.createdAt;
    });

    return result;
  }, [apps, searchQuery, activeCategory, selectedPlatform, sortBy]);

  // Total downloads metric
  const totalDownloads = useMemo(() => {
    return apps.reduce((sum, app) => sum + (app.stats.downloads || 0), 0);
  }, [apps]);

  // Handle App Download Action
  const handleDownloadApp = (app: AppItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Trigger archive download
    triggerArchiveDownload(app);

    // Update download count
    setApps((prev) => {
      const updated = prev.map((item) =>
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
      return updated;
    });

    showToast({ title: `Downloading ${app.name} (${app.fileSize})`, type: 'success' });
  };

  return (
    <div className={layoutStyles.appViewport}>
      {/* Particle Canvas Background */}
      <ParticleBackground />

      {/* Slim Modern Top Navbar */}
      <Navbar
        totalApps={apps.length}
        totalDownloads={totalDownloads}
      />

      {/* Main Container */}
      <main className={layoutStyles.mainContent} style={{ maxWidth: '1360px', paddingTop: '10px' }}>
        
        {/* Centered Hero Search & Discovery Section */}
        <section className={styles["hero-search-section"]}>
          <div className={styles["hero-search-badge-pill"]}>
            <IconSparkles size={14} />
            <span>Open & Verified App Ecosystem</span>
          </div>

          <h1 className={styles["hero-headline"]}>
            Find & Download Great Software
          </h1>
          <p className={styles["hero-subtitle"]}>
            Explore standalone desktop utilities, developer tools, and creative applications with direct zero-latency release archives.
          </p>

          {/* Centered Search Bar */}
          <div className={styles["hero-search-bar-wrapper"]}>
            <div className={styles["hero-search-icon"]}>
              <IconSearch size={20} />
            </div>

            <input
              type="text"
              placeholder="Search apps by name, description, tags, or developer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles["hero-search-input"]}
            />

            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className={styles["hero-search-clear-btn"]}
                title="Clear search query"
              >
                <IconClose size={16} />
              </button>
            ) : (
              <span className={styles["hero-search-shortcut-hint"]}>
                ESC
              </span>
            )}
          </div>

          {/* Popular Search Suggestion Tags */}
          <div className={styles["hero-tags-row"]}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Popular:</span>
            {['SoundWave', 'CogniFlow', 'DevPulse', 'Quantum', 'Aether'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className={styles["hero-tag-pill"]}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Categories & Filter Bar */}
        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          selectedPlatform={selectedPlatform}
          onSelectPlatform={setSelectedPlatform}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filteredCount={filteredApps.length}
        />

        {/* App Showcase Grid */}
        {filteredApps.length > 0 ? (
          <div className={styles["app-grid"]}>
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onSelect={(selected) => router.push(`/app/${selected.id}`)}
                onDownload={handleDownloadApp}
              />
            ))}
          </div>
        ) : (
          /* Enhanced Interactive Empty State */
          <div
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-card)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              maxWidth: '580px',
              margin: '40px auto'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(249, 115, 22, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: 'var(--accent-primary)'
              }}
            >
              <IconSearch size={28} />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              No applications match your filter
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
              We couldn&apos;t find anything matching &quot;{searchQuery || activeCategory}&quot;. Try exploring other popular categories below:
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
              {(['Developer Tools', 'AI & Machine Learning', 'Productivity', 'Games'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory(cat);
                    setSelectedPlatform('all');
                  }}
                  className={styles["quick-cat-btn"]}
                >
                  <IconSparkles size={12} />
                  <span>{cat}</span>
                </button>
              ))}
            </div>

            <button
              className={buttonStyles.btnSecondary}
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
                setSelectedPlatform('all');
              }}
              style={{ padding: '10px 24px' }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={styles["footer-container"]}>
        <div className={styles["footer-inner"]}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <IconBox size={16} />
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>VAULT.DIST</strong>
              <span style={{ marginLeft: '6px', color: 'var(--text-muted)' }}>— Next-Gen App Distribution</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)', fontSize: '12px', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block', boxShadow: '0 0 8px rgba(5,150,105,0.6)' }} />
              Operational
            </span>

            <span style={{ color: 'var(--border-subtle)' }}>|</span>

            <a href="/publisher" style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '12px' }}>
              Publisher Studio ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
