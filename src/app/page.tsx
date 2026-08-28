'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoryFilter, { SortOption } from '@/components/CategoryFilter';
import AppCard from '@/components/AppCard';
import { useToast } from '@/components/Toast';
import { AppItem, Category, Platform } from '@/types/app';
import { INITIAL_APPS } from '@/data/initialApps';
import { getLocalApps, saveLocalApps } from '@/lib/storage';
import { triggerArchiveDownload } from '@/lib/download';
import { IconBox, IconSearch } from '@/components/Icons';
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
        // Fallback gracefully to local apps
        console.warn('API sync fallback:', err);
      });
  }, []);

  // Keyboard shortcut for closing modals or clearing search
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

  // Featured app for the Spotlight Hero
  const featuredApp = useMemo(() => {
    return apps.find((a) => a.isFeatured) || apps[0];
  }, [apps]);

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
                downloads: item.stats.downloads + 1
              }
            }
          : item
      );
      saveLocalApps(updated);
      return updated;
    });

    showToast({
      type: 'success',
      title: `Downloading ${app.name}`,
      message: `Archive: ${app.archiveFileName || `${app.name}.zip`} (${app.fileSize})`
    });
  };

  // Handle App Share Action
  const handleShareApp = (app: AppItem) => {
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

  return (
    <div className={layoutStyles.appViewport}>
      {/* Particle Canvas Background */}
      <ParticleBackground />

      {/* Navigation Bar for Consumer */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalApps={apps.length}
        totalDownloads={totalDownloads}
      />

      {/* Main App Container */}
      <main className={layoutStyles.mainContent}>
        {/* Spotlight Hero Banner (only show when not actively searching) */}
        {!searchQuery && featuredApp && (
          <HeroSection
            featuredApp={featuredApp}
            onSelectApp={(app) => router.push(`/app/${app.id}`)}
            onDownload={handleDownloadApp}
          />
        )}

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
          /* Empty State for Consumer */
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-card)',
              backdropFilter: 'blur(16px)',
              maxWidth: '560px',
              margin: '40px auto'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: 'var(--accent-primary)'
              }}
            >
              <IconSearch size={26} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              No applications match your criteria
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Try adjusting your search query or selecting a different category or platform filter.
            </p>

            <button
              className={buttonStyles.btnSecondary}
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
                setSelectedPlatform('all');
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={styles["footer-container"]}>
        <div className={styles["footer-inner"]}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconBox size={16} color="var(--accent-cyan)" />
            <span>
              <strong>VAULT.DIST</strong> — Next-Gen Software Distribution Platform
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Zero-latency Web Showcase</span>
            <span>•</span>
            <a href="/publisher" style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>
              Developer / Publisher Portal ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
