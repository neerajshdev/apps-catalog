import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/content/apps';
import { SITE } from '@/content/site';

/**
 * Every route is hardcoded (see `src/content/apps`), so the sitemap is
 * generated from the same source the pages are. Adding a post or a privacy
 * page means adding it to `CONTENT_PAGES` below.
 */

/** Static pages with no content source of their own. `lastModified` is the date the page copy last changed. */
const CONTENT_PAGES: { path: string; lastModified: string; priority: number }[] = [
  { path: '/privacy/flap-the-bird', lastModified: '2026-10-01', priority: 0.3 },
  { path: '/privacy/flappygun', lastModified: '2026-10-01', priority: 0.3 },
  { path: '/privacy/savem8', lastModified: '2026-10-01', priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  // The index re-renders on every release, so it is as fresh as the newest post.
  const newestPost = posts[0]?.meta.releasedOn;

  return [
    {
      url: SITE.url,
      lastModified: newestPost,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...posts.map(({ meta }) => ({
      url: `${SITE.url}/apps/${meta.slug}`,
      lastModified: meta.releasedOn,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      images: [new URL(meta.cover.src, SITE.url).toString()],
    })),
    ...CONTENT_PAGES.map((page) => ({
      url: `${SITE.url}${page.path}`,
      lastModified: page.lastModified,
      changeFrequency: 'yearly' as const,
      priority: page.priority,
    })),
  ];
}
