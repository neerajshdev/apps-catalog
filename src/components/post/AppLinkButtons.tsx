import Link from 'next/link';
import type { AppLink, AppLinkKind } from '@/types/post';
import {
  IconApple,
  IconDownload,
  IconExternalLink,
  IconPlay,
} from '@/components/Icons';
import styles from './AppLinkButtons.module.css';

const PRIMARY_KINDS: AppLinkKind[] = ['playstore', 'appstore', 'download'];

function LinkIcon({ kind }: { kind: AppLinkKind }) {
  switch (kind) {
    case 'playstore':
      return <IconPlay size={15} />;
    case 'appstore':
      return <IconApple size={15} />;
    case 'download':
      return <IconDownload size={15} />;
    case 'github':
    case 'website':
      return <IconExternalLink size={15} />;
  }
}

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/**
 * Renders the post's call-to-action links: store listing, direct download,
 * repository, website. Store/download links get the primary treatment; internal
 * links (e.g. a privacy page) are rendered with `next/link`.
 */
export default function AppLinkButtons({ links }: { links: AppLink[] }) {
  if (links.length === 0) return null;

  return (
    <div className={styles['link-buttons']}>
      {links.map((link) => {
        const className = [
          styles['link-button'],
          PRIMARY_KINDS.includes(link.kind)
            ? styles['link-button-primary']
            : styles['link-button-secondary'],
        ].join(' ');
        const key = `${link.kind}-${link.href}`;
        const content = (
          <>
            <LinkIcon kind={link.kind} />
            <span>{link.label}</span>
          </>
        );

        if (isExternal(link.href)) {
          return (
            <a
              key={key}
              href={link.href}
              className={className}
              target="_blank"
              rel="noreferrer noopener"
            >
              {content}
            </a>
          );
        }

        return (
          <Link key={key} href={link.href} className={className}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}
