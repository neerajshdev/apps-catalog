import Image from 'next/image';
import Link from 'next/link';
import type { AppPostMeta } from '@/types/post';
import { IconArrowLeft } from '@/components/Icons';
import AppFacts from './AppFacts';
import AppLinkButtons from './AppLinkButtons';
import { TagList } from './Tags';
import styles from './PostHeader.module.css';

/** Title block for a single app post: heading, tags, cover and calls to action. */
export default function PostHeader({ post }: { post: AppPostMeta }) {
  return (
    <header className={styles['post-header']}>
      <Link href="/#apps" className={styles['back-link']}>
        <IconArrowLeft size={15} />
        <span>All apps</span>
      </Link>

      <h1 className={styles['post-title']}>{post.title}</h1>
      <p className={styles['post-tagline']}>{post.tagline}</p>

      <div className={styles['post-tags']}>
        <TagList tags={post.tags} />
      </div>

      <div className={styles['post-cover']}>
        <Image
          src={post.cover.src}
          alt={post.cover.alt}
          fill
          priority
          sizes="(max-width: 1080px) 92vw, 1032px"
          className={styles['post-cover-image']}
        />
      </div>

      <div className={styles['post-actions']}>
        <AppFacts facts={post.facts} platforms={post.platforms} />
        <AppLinkButtons links={post.links} />
      </div>
    </header>
  );
}
