import type { ComponentType } from 'react';

export type Platform = 'android' | 'ios' | 'windows' | 'macos' | 'linux' | 'web';

export type AppLinkKind = 'playstore' | 'appstore' | 'download' | 'github' | 'website';

/** A call-to-action rendered by `AppLinkButtons` (store listing, download, repo, site). */
export interface AppLink {
  kind: AppLinkKind;
  label: string;
  href: string;
}

export interface PostImage {
  src: string;
  alt: string;
  caption?: string;
  /**
   * Intrinsic pixel size, used to reserve space while the image loads.
   * Portrait phone screenshots are common — always pass the real values.
   */
  width?: number;
  height?: number;
}

export interface PostVideo {
  /** YouTube video id, e.g. `aqz-KE-bpKQ`. */
  youtubeId: string;
  title: string;
  /** Local poster shown before the video is played. */
  poster: string;
}

/** A label/value pair shown in the facts row. Keep it to things that are true. */
export interface AppFact {
  label: string;
  value: string;
}

export interface AppPostMeta {
  slug: string;
  title: string;
  tagline: string;
  tags: string[];
  cover: PostImage;
  platforms: Platform[];
  links: AppLink[];
  facts: AppFact[];
  /** schema.org `applicationCategory`, e.g. `GameApplication`, `DeveloperApplication`. */
  applicationCategory?: string;
  /** ISO 8601 date (`YYYY-MM-DD`). Used for display and ordering. */
  releasedOn: string;
}

/**
 * A single hardcoded app post.
 *
 * `meta` feeds the index card, the post header and the page metadata;
 * `Content` is the free-form body, composed from the blocks in
 * `@/components/post`, so every post can use a different layout.
 *
 * Add a post by creating `src/content/apps/<slug>.tsx` and registering it in
 * `src/content/apps/index.ts`.
 */
export interface AppPost {
  meta: AppPostMeta;
  Content: ComponentType;
}
