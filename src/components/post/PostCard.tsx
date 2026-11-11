import Image from 'next/image';
import Link from 'next/link';
import type { AppPostMeta } from '@/types/post';
import { formatMonthYear } from '@/lib/format';
import { PlatformChips, TagList } from './Tags';
import styles from './PostCard.module.css';

/** Index card: cover image, title, tagline, tags and platforms. */
export default function PostCard({ post }: { post: AppPostMeta }) {
  return (
    <article className={styles['post-card']}>
      <Link href={`/apps/${post.slug}`} className={styles['post-card-link']}>
        <div className={styles['post-card-cover']}>
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            sizes="(max-width: 760px) 92vw, 480px"
            className={styles['post-card-image']}
          />
        </div>

        <div className={styles['post-card-body']}>
          <div className={styles['post-card-heading']}>
            <h2 className={styles['post-card-title']}>{post.title}</h2>
            <time className={styles['post-card-date']} dateTime={post.releasedOn}>
              {formatMonthYear(post.releasedOn)}
            </time>
          </div>

          <p className={styles['post-card-tagline']}>{post.tagline}</p>

          <TagList tags={post.tags} />
          <PlatformChips platforms={post.platforms} />
        </div>
      </Link>
    </article>
  );
}
