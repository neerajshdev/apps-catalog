import PostCard from '@/components/post/PostCard';
import { SiteFooter, SiteHeader } from '@/components/post/SiteChrome';
import { getAllPosts } from '@/content/apps';
import { SITE } from '@/content/site';
import styles from './page.module.css';

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className={styles['page']}>
      <SiteHeader />

      <main className={styles['main']}>
        <section className={styles['intro']}>
          <h1 className={styles['headline']}>{SITE.tagline}</h1>
          <p className={styles['lede']}>{SITE.description}</p>
        </section>

        <section id="apps" aria-labelledby="apps-heading">
          <div className={styles['apps-header']}>
            <h2 id="apps-heading" className={styles['apps-heading']}>
              All apps
            </h2>
            <span className={styles['apps-count']}>
              {posts.length} {posts.length === 1 ? 'app' : 'apps'}
            </span>
          </div>

          <div className={styles['apps-grid']}>
            {posts.map((post) => (
              <PostCard key={post.meta.slug} post={post.meta} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
