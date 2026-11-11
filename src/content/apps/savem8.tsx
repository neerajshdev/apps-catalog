// First real post. Every claim below comes from the public Play Store listing
// (or the app's own artwork) — nothing here is invented.

import Link from 'next/link';
import FeatureList from '@/components/post/FeatureList';
import Prose from '@/components/post/Prose';
import ScreenshotStrip from '@/components/post/ScreenshotStrip';
import type { AppPost, AppPostMeta } from '@/types/post';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=app.savem8';
/** Hosted on this site — see `src/app/privacy/savem8/page.tsx`. */
const PRIVACY_POLICY_PATH = '/privacy/savem8';

const meta: AppPostMeta = {
  slug: 'savem8',
  title: 'SaveM8 – Browser & Media Saver',
  tagline:
    'An Android browser with a media saver built in: spot a video while you browse, then keep it.',
  tags: ['Tools', 'Browser', 'Media saver'],
  cover: {
    src: '/apps/savem8/cover.png',
    alt: 'SaveM8 app icon beside the SaveM8 wordmark, the subtitle “Browser & Media Saver” and the line “Watch · Browse · Save”',
  },
  platforms: ['android'],
  applicationCategory: 'UtilitiesApplication',
  links: [
    { kind: 'playstore', label: 'Get it on Google Play', href: PLAY_STORE_URL },
    { kind: 'website', label: 'Privacy policy', href: PRIVACY_POLICY_PATH },
  ],
  facts: [
    { label: 'Category', value: 'Tools' },
    { label: 'Installs', value: '10+' },
    { label: 'Price', value: 'Free, ad supported' },
    { label: 'Content rating', value: 'Rated for 3+' },
    { label: 'Updated', value: 'Nov 2026' },
  ],
  // Play does not publish the original release date, so the post uses the
  // listing’s last update (8 Nov 2026). Keep both in sync if that changes.
  releasedOn: '2026-11-08',
};

const screenshots = [
  {
    src: '/apps/savem8/screenshot-1.webp',
    alt: 'SaveM8 browser playing a video, with a “Video Found” bar and a Save button over the player',
    caption: 'The browser spots a video and offers to save it.',
    width: 940,
    height: 1672,
  },
  {
    src: '/apps/savem8/screenshot-2.webp',
    alt: 'SaveM8 media library with Videos, Audios and Images tabs, every item carrying its own Download button',
    caption: 'What you keep is grouped into Videos, Audios and Images.',
    width: 941,
    height: 1672,
  },
];

const features = [
  'A browser you can actually browse in, with saving built into the same screen',
  'Detects the video on the page you are watching and offers a Save action',
  'Takes pasted links too — Instagram Reels, Facebook videos and more',
  'Files what you save under Videos, Audios and Images',
  'Full-screen playback, added in the latest update',
  'No account, no sign-up',
];

function SaveM8Content() {
  return (
    <>
      <Prose>
        <p>
          <strong>SaveM8</strong> is an Android browser that keeps what it finds. You browse as
          you normally would; when a page carries a video, the app puts a “Video Found” bar over
          the player and offers to save it to the device. Pasting a link works the same way, and
          the store listing calls out Instagram Reels and Facebook videos as the everyday cases.
        </p>

        <FeatureList items={features} />
      </Prose>

      <ScreenshotStrip images={screenshots} />

      <Prose>
        <h2>How a save works</h2>
        <ul>
          <li>Open a link in the browser, or paste one in.</li>
          <li>SaveM8 surfaces the media it found on that page, with a Save action beside it.</li>
          <li>The file lands in your library, where it plays full screen.</li>
        </ul>

        <h2>Fewer ads, not zero ads</h2>
        <p>
          The store artwork sells the app as “pure browsing, minimal ads”, and the promise is a
          fair one: reading a page does not stop every few taps for a full-screen ad. It is still
          ad supported — Play lists the app as containing ads, and that is what keeps it free.
        </p>

        <h2>What it asks for</h2>
        <p>
          Very little, judging by Play’s Data safety section: no data collected, nothing shared
          with third parties, traffic encrypted in transit. The listing is published under the
          developer name Softneez, and the{' '}
          <Link href={PRIVACY_POLICY_PATH}>privacy policy</Link> lives on this site if you want
          the full text before installing.
        </p>
      </Prose>
    </>
  );
}

export const saveM8Post: AppPost = {
  meta,
  Content: SaveM8Content,
};
