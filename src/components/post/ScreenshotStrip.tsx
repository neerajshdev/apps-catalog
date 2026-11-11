import Image from 'next/image';
import type { PostImage } from '@/types/post';
import styles from './ScreenshotStrip.module.css';

interface ScreenshotStripProps {
  images: PostImage[];
  title?: string;
}

/** Fallback intrinsic size for images that do not declare one. */
const DEFAULT_IMAGE_WIDTH = 1280;
const DEFAULT_IMAGE_HEIGHT = 720;

/**
 * Horizontally scrollable screenshot rail. Scrolling is native CSS
 * (scroll-snap), so this stays a server component and ships no JavaScript.
 */
export default function ScreenshotStrip({
  images,
  title = 'Screenshots',
}: ScreenshotStripProps) {
  if (images.length === 0) return null;

  return (
    <section className={styles['strip']} aria-label={title}>
      <div className={styles['strip-header']}>
        <h2 className={styles['strip-title']}>{title}</h2>
        <span className={styles['strip-hint']}>Scroll sideways</span>
      </div>

      <ul className={styles['strip-track']} tabIndex={0}>
        {images.map((image) => (
          <li key={image.src} className={styles['strip-item']}>
            <figure className={styles['strip-figure']}>
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width ?? DEFAULT_IMAGE_WIDTH}
                height={image.height ?? DEFAULT_IMAGE_HEIGHT}
                sizes="(max-width: 760px) 80vw, 460px"
                className={styles['strip-image']}
              />
              {image.caption ? (
                <figcaption className={styles['strip-caption']}>
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
