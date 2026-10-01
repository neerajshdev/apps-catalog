'use client';

import React from 'react';
import Link from 'next/link';
import { IconBox, IconLock, IconSparkles } from './Icons';
import styles from './Navbar.module.css';
import buttonStyles from '@/components/Button.module.css';

interface NavbarProps {
  totalApps?: number;
  totalDownloads?: number;
}

export default function Navbar({
  totalApps = 0,
  totalDownloads = 0
}: NavbarProps) {
  return (
    <header className={styles["navbar-container"]}>
      <div className={styles["navbar-inner"]}>
        {/* Left: Brand Logo & Metrics Badge */}
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

          {totalApps > 0 && (
            <div className={styles["stats-badge-desktop"]}>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{totalApps}</span> Apps
              <span style={{ color: 'var(--border-subtle)' }}>•</span>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
                {(totalDownloads / 1000).toFixed(1)}k
              </span> Downloads
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className={styles["navbar-action-section"]}>
          <Link
            href="/publisher"
            className={`${buttonStyles.btnSecondary} ${styles["nav-publisher-btn"]}`}
            title="Publisher Management Studio"
          >
            <IconLock size={13} color="var(--accent-primary)" />
            <span>Publisher Portal</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
