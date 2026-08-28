'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ParticleBackground from '@/components/ParticleBackground';
import styles from './publisher.module.css';
import { useToast } from '@/components/Toast';
import { AppItem, AppFormData, Platform } from '@/types/app';
import { INITIAL_APPS } from '@/data/initialApps';
import layoutStyles from '@/components/SharedLayout.module.css';
import buttonStyles from '@/components/Button.module.css';
import badgeStyles from '@/components/Badge.module.css';
import {
  getLocalApps,
  deleteLocalApp,
  toggleFeaturedApp
} from '@/lib/storage';
import { useRouter } from 'next/navigation';
import {
  IconBox,
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconStar,
  IconSparkles,
  IconLock,
  IconUnlock,
  IconArrowLeft,
  IconExternalLink,
  IconEye,
  IconBarChart,
  IconClose,
  IconVideo,
  IconImage,
  IconWindows,
  IconApple,
  IconLinux,
  IconAndroid,
  IconWeb
} from '@/components/Icons';

const DEFAULT_PASSCODE = 'admin'; // Easy default developer passcode

export default function PublisherDashboard() {
  const router = useRouter();
  const { showToast } = useToast();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Apps State
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Modals
  const [appToDelete, setAppToDelete] = useState<AppItem | null>(null);

  // Check saved session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('vault_publisher_authenticated');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
    const loadedApps = getLocalApps();
    setApps(loadedApps);
  }, []);

  // Handle Passcode Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === DEFAULT_PASSCODE || passcodeInput.trim() === 'developer') {
      setIsAuthenticated(true);
      setAuthError('');
      localStorage.setItem('vault_publisher_authenticated', 'true');
      showToast({
        type: 'success',
        title: 'Studio Unlocked',
        message: 'Welcome to the Publisher Management Hub.'
      });
    } else {
      setAuthError('Invalid passcode. Default is "admin"');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscodeInput('');
    localStorage.removeItem('vault_publisher_authenticated');
    showToast({
      type: 'info',
      title: 'Studio Locked',
      message: 'Publisher session ended.'
    });
  };

  // Filtered Apps for Dashboard Table
  const filteredApps = useMemo(() => {
    let result = [...apps];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.version.toLowerCase().includes(q) ||
          a.tagline.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'All') {
      result = result.filter((a) => a.category === categoryFilter);
    }
    return result;
  }, [apps, searchQuery, categoryFilter]);

  // Metrics
  const totalDownloads = useMemo(() => apps.reduce((s, a) => s + (a.stats.downloads || 0), 0), [apps]);
  const avgRating = useMemo(() => {
    if (apps.length === 0) return '0.0';
    const sum = apps.reduce((s, a) => s + a.stats.rating, 0);
    return (sum / apps.length).toFixed(1);
  }, [apps]);

  // Delete App
  const confirmDeleteApp = async () => {
    if (!appToDelete) return;
    const updatedList = deleteLocalApp(appToDelete.id);
    setApps(updatedList);

    // Sync with API
    try {
      await fetch(`/api/apps?id=${encodeURIComponent(appToDelete.id)}`, {
        method: 'DELETE',
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
    } catch (err) {
      console.warn('API delete failed:', err);
    }

    showToast({
      type: 'info',
      title: 'Application Removed',
      message: `"${appToDelete.name}" has been deleted from distribution.`
    });
    setAppToDelete(null);
  };

  // Toggle Featured
  const handleToggleFeatured = async (appId: string) => {
    const updatedList = toggleFeaturedApp(appId);
    setApps(updatedList);
    const target = updatedList.find((a) => a.id === appId);

    if (target) {
      try {
        await fetch('/api/apps', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify(target)
        });
      } catch (err) {
        console.warn('API sync failed:', err);
      }

      showToast({
        type: 'success',
        title: target.isFeatured ? 'Spotlight Enabled' : 'Spotlight Disabled',
        message: `"${target.name}" spotlight status updated.`
      });
    }
  };

  const renderPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'windows': return <IconWindows key="win" size={11} />;
      case 'macos': return <IconApple key="mac" size={11} />;
      case 'linux': return <IconLinux key="lin" size={11} />;
      case 'android': return <IconAndroid key="and" size={11} />;
      case 'web': return <IconWeb key="web" size={11} />;
      default: return null;
    }
  };

  // If Not Authenticated, render Gate Screen
  if (!isAuthenticated) {
    return (
      <div className={layoutStyles.appViewport}>
        <ParticleBackground />
        <div className={styles["gate-container"]}>
          <div className={styles["gate-card"]}>
            <div className={styles["gate-icon-badge"]}>
              <IconLock size={32} />
            </div>

            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Publisher Studio
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Enter developer passcode to manage and publish applications.
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="password"
                className={styles["gate-input"]}
                placeholder="Enter Passcode (default: admin)"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                autoFocus
              />

              {authError && (
                <div style={{ color: 'var(--accent-rose)', fontSize: '12px', fontWeight: 600 }}>
                  {authError}
                </div>
              )}

              <button type="submit" className={buttonStyles.btnPrimary} style={{ width: '100%', padding: '12px' }}>
                <IconUnlock size={16} />
                <span>Unlock Publisher Studio</span>
              </button>
            </form>

            <div style={{ borderTop: '1px solid var(--border-subtle)', width: '100%', paddingTop: '16px' }}>
              <Link href="/" style={{ fontSize: '13px', color: 'var(--accent-cyan)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <IconArrowLeft size={14} />
                <span>Return to Public Storefront</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={layoutStyles.appViewport}>
      {/* Moving Particles */}
      <ParticleBackground />

      {/* Main Studio View */}
      <div className={layoutStyles.mainContent} style={{ maxWidth: '1400px', paddingTop: '32px' }}>
        {/* Top Header */}
        <div className={styles["publisher-header"]}>
          <div className={styles["publisher-title-area"]}>
            <div className={styles["publisher-badge-icon"]}>
              <IconBox size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Publisher Studio
                </h1>
                <span className={badgeStyles.badgeCategory} style={{ background: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.35)', color: '#c084fc' }}>
                  Creator Hub
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Publish new application archives, edit metadata, upload screenshots, and manage distribution.
              </p>
            </div>
          </div>

          <div className={styles["publisher-actions-row"]}>
            <Link href="/" className={buttonStyles.btnSecondary} title="View Storefront as Consumer">
              <IconExternalLink size={16} />
              <span>View Storefront</span>
            </Link>

            <button onClick={() => router.push('/publisher/create')} className={buttonStyles.btnPrimary}>
              <IconPlus size={18} />
              <span>Publish New App Archive</span>
            </button>

            <button onClick={handleLogout} className={buttonStyles.btnIcon} title="Lock Studio Session">
              <IconLock size={18} />
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className={styles["stats-grid"]}>
          <div className={styles["stat-metric-card"]}>
            <div className={`\${styles["stat-metric-icon"]} indigo`}>
              <IconBox size={24} />
            </div>
            <div>
              <div className={styles["stat-metric-val"]}>{apps.length}</div>
              <div className={styles["stat-metric-lbl"]}>Total App Releases</div>
            </div>
          </div>

          <div className={styles["stat-metric-card"]}>
            <div className={`\${styles["stat-metric-icon"]} cyan`}>
              <IconBarChart size={24} />
            </div>
            <div>
              <div className={styles["stat-metric-val"]}>
                {totalDownloads > 999 ? `${(totalDownloads / 1000).toFixed(1)}k` : totalDownloads}
              </div>
              <div className={styles["stat-metric-lbl"]}>Cumulative Downloads</div>
            </div>
          </div>

          <div className={styles["stat-metric-card"]}>
            <div className={`\${styles["stat-metric-icon"]} amber`}>
              <IconStar size={24} fill="#fbbf24" color="#fbbf24" />
            </div>
            <div>
              <div className={styles["stat-metric-val"]}>{avgRating} ★</div>
              <div className={styles["stat-metric-lbl"]}>Average User Rating</div>
            </div>
          </div>

          <div className={styles["stat-metric-card"]}>
            <div className={`\${styles["stat-metric-icon"]} purple`}>
              <IconSparkles size={24} />
            </div>
            <div>
              <div className={styles["stat-metric-val"]}>
                {apps.filter((a) => a.isFeatured).length}
              </div>
              <div className={styles["stat-metric-lbl"]}>Featured Spotlight Apps</div>
            </div>
          </div>
        </div>

        {/* Apps Registry Management Table */}
        <div className={styles["dash-table-wrapper"]}>
          <div className={styles["dash-table-header"]}>
            <div className={styles["dash-table-title"]}>
              <span>Application Registry</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>
                ({filteredApps.length} applications)
              </span>
            </div>

            {/* Search within dashboard */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <IconSearch size={15} />
                </div>
                <input
                  type="text"
                  className={styles["form-input"]}
                  style={{ padding: '6px 12px 6px 32px', fontSize: '13px' }}
                  placeholder="Filter applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className={styles["form-select"]}
                style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Productivity">Productivity</option>
                <option value="Developer Tools">Developer Tools</option>
                <option value="Games">Games</option>
                <option value="Design & Creative">Design & Creative</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Audio & Video">Audio & Video</option>
                <option value="Utilities">Utilities</option>
              </select>
            </div>
          </div>

          {/* Data Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className={styles["dash-table"]}>
              <thead>
                <tr>
                  <th className={styles["dash-th"]}>Application</th>
                  <th className={styles["dash-th"]}>Category</th>
                  <th className={styles["dash-th"]}>Version & Size</th>
                  <th className={styles["dash-th"]}>Platforms</th>
                  <th className={styles["dash-th"]}>Media Assets</th>
                  <th className={styles["dash-th"]}>Downloads</th>
                  <th className={styles["dash-th"]} style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.id} className={styles["dash-tr"]}>
                    {/* App Info Cell */}
                    <td className={styles["dash-td"]}>
                      <div className={styles["dash-app-cell"]}>
                        <img
                          src={app.iconUrl}
                          alt={app.name}
                          className={styles["dash-app-icon"]}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&h=128&q=80';
                          }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{app.name}</strong>
                            {app.isFeatured && (
                              <span className={badgeStyles.badgeFeatured} style={{ fontSize: '9px', padding: '1px 6px' }}>
                                Spotlight
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {app.tagline}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className={styles["dash-td"]}>
                      <span className={badgeStyles.badgeCategory}>{app.category}</span>
                    </td>

                    {/* Version & Size */}
                    <td className={styles["dash-td"]}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span className={badgeStyles.badgeVersion} style={{ width: 'fit-content' }}>{app.version}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{app.fileSize}</span>
                      </div>
                    </td>

                    {/* Platforms */}
                    <td className={styles["dash-td"]}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {app.platforms.map((p) => (
                          <span key={p} className={`\$\{badgeStyles.badgePlatform\} \$\{badgeStyles[p]\}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                            {renderPlatformIcon(p)}
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Media Assets */}
                    <td className={styles["dash-td"]}>
                      <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
                        <span style={{ color: app.youtubeVideos.length > 0 ? '#f43f5e' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <IconVideo size={13} />
                          {app.youtubeVideos.length}
                        </span>
                        <span style={{ color: app.screenshots.length > 0 ? '#38bdf8' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <IconImage size={13} />
                          {app.screenshots.length}
                        </span>
                      </div>
                    </td>

                    {/* Downloads */}
                    <td className={styles["dash-td"]}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {app.stats.downloads.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '11px', color: '#fbbf24' }}>
                        {app.stats.rating.toFixed(1)} ★ ({app.stats.ratingCount})
                      </div>
                    </td>

                    {/* Actions */}
                    <td className={styles["dash-td"]} style={{ textAlign: 'right' }}>
                      <div className={styles["dash-action-btn-group"]} style={{ justifyContent: 'flex-end' }}>
                        {/* Toggle Spotlight */}
                        <button
                          className={`\$\{styles["dash-btn-action"]\} \$\{buttonStyles.btnFeatured\} \$\{app.isFeatured ? 'active' : ''\}`}
                          onClick={() => handleToggleFeatured(app.id)}
                          title={app.isFeatured ? 'Remove from Hero Spotlight' : 'Set as Hero Spotlight'}
                        >
                          <IconStar size={14} fill={app.isFeatured ? '#fbbf24' : 'none'} color={app.isFeatured ? '#fbbf24' : 'currentColor'} />
                        </button>

                        {/* Preview */}
                        <button
                          className={styles["dash-btn-action"]}
                          onClick={() => router.push(`/app/${app.id}`)}
                          title="Preview Consumer View"
                        >
                          <IconEye size={14} />
                        </button>

                        {/* Edit */}
                        <button
                          className={`\${styles["dash-btn-action"]} btn-edit`}
                          onClick={() => router.push(`/publisher/edit/\${app.id}`)}
                          title="Edit Application Release"
                        >
                          <IconEdit size={14} />
                        </button>

                        {/* Delete */}
                        <button
                          className={[styles["dash-btn-action"], "btn-delete"].join(" ")}
                          onClick={() => setAppToDelete(app)}
                          title="Delete Application"
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApps.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No applications found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {appToDelete && (
        <div className={styles["modal-overlay"]} onClick={() => setAppToDelete(null)}>
          <div
            className={styles["modal-window"]}
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["modal-header"]}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)' }}>
                <IconTrash size={20} />
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Confirm Removal</h3>
              </div>
              <button className={buttonStyles.btnIcon} onClick={() => setAppToDelete(null)}>
                <IconClose size={18} />
              </button>
            </div>

            <div className={styles["modal-body"]} style={{ gap: '12px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                Are you sure you want to permanently remove <strong>{appToDelete.name}</strong> from distribution?
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                This will delete the archive listing, metadata, and all associated media from the public store.
              </p>
            </div>

            <div className={styles["modal-footer"]}>
              <button className={buttonStyles.btnSecondary} onClick={() => setAppToDelete(null)}>
                Cancel
              </button>
              <button
                className={buttonStyles.btnPrimary}
                style={{ background: 'var(--accent-rose)', boxShadow: '0 4px 20px rgba(244, 63, 94, 0.4)' }}
                onClick={confirmDeleteApp}
              >
                Delete Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

