'use client';

import Link from 'next/link';
import { IconBox, IconSearch, IconLock } from './Icons';
import styles from './Navbar.module.css';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalApps: number;
  totalDownloads: number;
}

export default function Navbar({
  searchQuery,
  onSearchChange,
  totalApps,
  totalDownloads
}: NavbarProps) {
  return (
    <header className={styles["navbar-container"]}>
      <div className={styles["navbar-inner"]}>
        {/* Top / Left: Brand & Desktop Stats */}
        <div className={styles["navbar-brand-section"]}>
          <Link href="/" className={styles["brand-logo"]}>
            <div className={styles["brand-icon-box"]}>
              <IconBox size={20} color="#ffffff" />
            </div>
            <div className={styles["brand-text"]}>
              <span className={styles["brand-title"]}>VAULT.DIST</span>
              <span className={styles["brand-subtitle"]}>App Distribution</span>
            </div>
          </Link>

          {/* Quick Stats Pill (Desktop) */}
          <div className={styles["stats-badge-desktop"]}>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{totalApps}</span> Apps
            <span style={{ color: 'var(--border-subtle)' }}>•</span>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
              {(totalDownloads / 1000).toFixed(1)}k
            </span> Downloads
          </div>
        </div>

        {/* Search Bar (Responsive full width on mobile) */}
        <div className={styles["search-wrapper"]}>
          <div className={styles["search-icon-inside"]}>
            <IconSearch size={16} />
          </div>
          <input
            type="text"
            className={styles["search-input"]}
            placeholder="Search apps, games, tools..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <span className={styles["search-shortcut"]}>ESC</span>
        </div>

        {/* Right Action: Publisher Portal Link */}
        <div className={styles["navbar-action-section"]}>
          <Link
            href="/publisher"
            className={`\$\{buttonStyles.btnSecondary\} \$\{styles["nav-publisher-btn"]\}`}
            title="Publisher Management Studio"
          >
            <IconLock size={13} color="var(--accent-purple)" />
            <span>Publisher Portal</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
