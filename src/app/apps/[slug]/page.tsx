import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostHeader from '@/components/post/PostHeader';
import { SiteFooter, SiteHeader } from '@/components/post/SiteChrome';
import { PLATFORM_LABELS } from '@/components/post/Tags';
import { getAllPosts, getPostBySlug } from '@/content/apps';
import { SITE } from '@/content/site';
import styles from './page.module.css';

// Every post is hardcoded, so anything outside `generateStaticParams` is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.tagline,
    alternates: { canonical: `/apps/${post.meta.slug}` },
    openGraph: {
      title: post.meta.title,
      description: post.meta.tagline,
      type: 'article',
      siteName: SITE.name,
      images: [{ url: post.meta.cover.src, alt: post.meta.cover.alt }],
    },
  };
}

export default async function AppPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { meta, Content } = post;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: meta.title,
    description: meta.tagline,
    image: new URL(meta.cover.src, SITE.url).toString(),
    url: `${SITE.url}/apps/${meta.slug}`,
    operatingSystem: meta.platforms
      .map((platform) => PLATFORM_LABELS[platform])
      .join(', '),
    author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    datePublished: meta.releasedOn,
    ...(meta.applicationCategory
      ? { applicationCategory: meta.applicationCategory }
      : {}),
  };

  return (
    <div className={styles['page']}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <SiteHeader />

      <main className={styles['main']}>
        <article>
          <PostHeader post={meta} />
          <Content />
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
