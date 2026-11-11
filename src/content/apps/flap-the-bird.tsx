// Sample post: the copy, artwork and store URL are placeholders.
// This post intentionally uses a different body layout than `flappygun` —
// no video rail, and a limitations section instead — to show that the detail
// page follows whatever the post content provides.

import FeatureList from '@/components/post/FeatureList';
import Prose from '@/components/post/Prose';
import ScreenshotStrip from '@/components/post/ScreenshotStrip';
import type { AppPost, AppPostMeta } from '@/types/post';

const meta: AppPostMeta = {
  slug: 'flap-the-bird',
  title: 'Flap the Bird',
  tagline:
    'The classic flap-and-dodge loop, rebuilt from scratch with a softer difficulty curve.',
  tags: ['Arcade', 'Casual', 'Retro'],
  cover: {
    src: '/apps/flap-the-bird/cover.svg',
    alt: 'Flap the Bird cover artwork',
  },
  platforms: ['android'],
  applicationCategory: 'GameApplication',
  links: [
    {
      kind: 'playstore',
      label: 'Get it on Google Play',
      // TODO: replace with the real Play Store listing.
      href: 'https://play.google.com/store/apps/details?id=com.example.flapthebird',
    },
    { kind: 'website', label: 'Privacy policy', href: '/privacy/flap-the-bird' },
    // `github` and `download` are supported too — drop in real URLs to show them:
    // { kind: 'github', label: 'Source on GitHub', href: 'https://github.com/you/flap-the-bird' },
    // { kind: 'download', label: 'Download APK', href: '/downloads/flap-the-bird.apk' },
  ],
  facts: [
    { label: 'Version', value: '1.2.0' },
    { label: 'Released', value: 'Sep 2026' },
    { label: 'Price', value: 'Free' },
  ],
  releasedOn: '2026-09-04',
};

function FlapTheBirdContent() {
  return (
    <>
      <Prose>
        <p>
          <strong>Flap the Bird</strong> is a small, deliberately familiar game: tap to
          flap, avoid the pipes, try to beat your own score. It exists because I wanted a
          project where the interesting problem was polish rather than novelty — input
          latency, difficulty pacing, and the moment-to-moment feel of a single button.
        </p>

        <h2>What is in it</h2>
        <FeatureList
          items={[
            'Tap-to-flap physics tuned for short sessions',
            'A gentler difficulty ramp than the games it borrows from',
            'Day and night backgrounds that swap as you score',
            'Works fully offline',
            'No sign-up and no in-app purchases',
          ]}
        />

        <h2>What it does not have</h2>
        <p>
          I would rather list what is missing than oversell it. There are no skins, no
          power-ups, no cloud save and no social features. The leaderboard is local only,
          which means uninstalling the app clears your score.
        </p>
      </Prose>

      <ScreenshotStrip
        title="Screenshots"
        images={[
          {
            src: '/apps/flap-the-bird/screenshot-1.svg',
            alt: 'Flap the Bird gameplay screen',
            caption: 'Gameplay — placeholder image',
          },
          {
            src: '/apps/flap-the-bird/screenshot-2.svg',
            alt: 'Flap the Bird menu screen',
            caption: 'Menu — placeholder image',
          },
        ]}
      />

      <Prose>
        <h2>Built with</h2>
        <p>
          Written as a single-activity Android app, with the render loop and collision
          handling kept small enough to reason about in one sitting. Ads are limited to an
          interstitial between runs.
        </p>
      </Prose>
    </>
  );
}

export const flapTheBirdPost: AppPost = {
  meta,
  Content: FlapTheBirdContent,
};
