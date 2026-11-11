import Image from 'next/image';
import Link from 'next/link';
import { getAllPosts } from '@/content/apps';
import { SITE } from '@/content/site';
import styles from './SiteChrome.module.css';

export function SiteHeader() {
  return (
    <header className={styles['site-header']}>
      <div className={styles['site-header-inner']}>
        <Link href="/" className={styles['brand']}>
          {/* Decorative: the adjacent text already names the site. */}
          <Image
            src="/brand/chiku-mark.svg"
            alt=""
            width={32}
            height={32}
            unoptimized
            priority
            className={styles['brand-mark']}
          />
          <span>
            <span className={styles['brand-name']}>{SITE.name}</span>
            <span className={styles['brand-subtitle']}>apps &amp; experiments</span>
          </span>
        </Link>

        <nav aria-label="Primary" className={styles['primary-nav']}>
          <Link href="/#apps">All apps</Link>
        </nav>
      </div>
    </header>
  );
}

/**
 * Footer that also lists every post. Beyond being useful, these are plain
 * internal links on every page, which keeps every app one hop from any entry
 * point for crawlers.
 */
export function SiteFooter() {
  const posts = getAllPosts();

  return (
    <footer className={styles['site-footer']}>
      <div className={styles['site-footer-inner']}>
        <div className={styles['site-footer-top']}>
          <div className={styles['footer-brand']}>
            <p className={styles['footer-title']}>{SITE.name}</p>
            <p className={styles['footer-note']}>{SITE.tagline}</p>
          </div>

          <nav aria-label="All apps" className={styles['footer-links']}>
            <p className={styles['footer-links-title']}>Apps</p>
            {posts.map((post) => (
              <Link key={post.meta.slug} href={`/apps/${post.meta.slug}`}>
                {post.meta.title}
              </Link>
            ))}
          </nav>
        </div>

        <p className={styles['footer-legal']}>
          © {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </footer>
  );
}
