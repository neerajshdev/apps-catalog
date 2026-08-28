'use client';

import React from 'react';
import { Category, Platform } from '../types/app';
import styles from './CategoryFilter.module.css';
import {
  IconWindows,
  IconApple,
  IconLinux,
  IconAndroid,
  IconWeb
} from './Icons';

export const CATEGORIES: Category[] = [
  'All',
  'Design & Creative',
  'Developer Tools',
  'Games',
  'AI & Machine Learning',
  'Productivity',
  'Audio & Video',
  'Utilities'
];

export const PLATFORMS: { id: Platform; label: string; icon: React.ReactNode }[] = [
  { id: 'windows', label: 'Windows', icon: <IconWindows size={13} /> },
  { id: 'macos', label: 'macOS', icon: <IconApple size={13} /> },
  { id: 'linux', label: 'Linux', icon: <IconLinux size={13} /> },
  { id: 'android', label: 'Android', icon: <IconAndroid size={13} /> },
  { id: 'web', label: 'Web', icon: <IconWeb size={13} /> }
];

export type SortOption = 'rating' | 'downloads' | 'newest' | 'name';

interface CategoryFilterProps {
  activeCategory: Category;
  onSelectCategory: (cat: Category) => void;
  selectedPlatform: Platform | 'all';
  onSelectPlatform: (platform: Platform | 'all') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filteredCount: number;
}

export default function CategoryFilter({
  activeCategory,
  onSelectCategory,
  selectedPlatform,
  onSelectPlatform,
  sortBy,
  onSortChange,
  filteredCount
}: CategoryFilterProps) {
  return (
    <div className={styles["filter-bar"]}>
      {/* Category Pills (Touch scrollable horizontal rail) */}
      <div className={styles["filter-categories-rail"]}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles["filter-pill"]} ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Subbar: Platforms + Sorting + App Count */}
      <div className={styles["filter-subbar"]}>
        {/* Platform Selector */}
        <div className={styles["platform-selector-rail"]}>
          <button
            className={`${styles["platform-chip"]} ${selectedPlatform === 'all' ? 'active' : ''}`}
            onClick={() => onSelectPlatform('all')}
          >
            All Platforms
          </button>
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              className={`${styles["platform-chip"]} ${selectedPlatform === p.id ? 'active' : ''}`}
              onClick={() => onSelectPlatform(selectedPlatform === p.id ? 'all' : p.id)}
            >
              {p.icon}
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Sort & Count Controls */}
        <div className={styles["filter-meta-controls"]}>
          <span className={styles["filter-count-label"]}>
            <strong style={{ color: 'var(--text-primary)' }}>{filteredCount}</strong> apps
          </span>

          <div className={styles["sort-select-wrapper"]}>
            <label htmlFor="sort-apps" className={styles["sort-label"]}>Sort:</label>
            <select
              id="sort-apps"
              className={styles["sort-select"]}
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
            >
              <option value="newest">Newest</option>
              <option value="rating">Top Rated</option>
              <option value="downloads">Most Popular</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
