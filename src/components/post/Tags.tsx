import type { Platform } from '@/types/post';
import {
  IconAndroid,
  IconApple,
  IconLinux,
  IconWeb,
  IconWindows,
} from '@/components/Icons';
import styles from './Tags.module.css';

export const PLATFORM_LABELS: Record<Platform, string> = {
  android: 'Android',
  ios: 'iOS',
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  web: 'Web',
};

function PlatformIcon({ platform }: { platform: Platform }) {
  switch (platform) {
    case 'android':
      return <IconAndroid size={11} />;
    case 'ios':
      return <IconApple size={11} />;
    case 'macos':
      return <IconApple size={11} />;
    case 'windows':
      return <IconWindows size={11} />;
    case 'linux':
      return <IconLinux size={11} />;
    case 'web':
      return <IconWeb size={11} />;
  }
}

/** Small pill list of free-form tags, e.g. `Arcade`, `One-tap`. */
export function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;

  return (
    <ul className={styles['tag-list']}>
      {tags.map((tag) => (
        <li key={tag} className={styles['tag']}>
          {tag}
        </li>
      ))}
    </ul>
  );
}

/** Platform chips with their matching icons. */
export function PlatformChips({ platforms }: { platforms: Platform[] }) {
  if (platforms.length === 0) return null;

  return (
    <ul className={styles['platform-chips']}>
      {platforms.map((platform) => (
        <li key={platform} className={styles['platform-chip']}>
          <PlatformIcon platform={platform} />
          <span>{PLATFORM_LABELS[platform]}</span>
        </li>
      ))}
    </ul>
  );
}
