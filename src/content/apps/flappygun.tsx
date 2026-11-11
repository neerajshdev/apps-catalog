// Sample post: the copy, artwork and store URL are placeholders.
// Replace `meta` and the body below with the real thing.

import FeatureList from '@/components/post/FeatureList';
import Prose from '@/components/post/Prose';
import ScreenshotStrip from '@/components/post/ScreenshotStrip';
import VideoStrip from '@/components/post/VideoStrip';
import type { AppPost, AppPostMeta } from '@/types/post';

const meta: AppPostMeta = {
  slug: 'flappygun',
  title: 'FlappyGun',
  tagline:
    'A one-tap arcade shooter where every shot you fire is also the thing keeping you in the air.',
  tags: ['Arcade', 'One-tap', 'Mobile game'],
  cover: {
    src: '/apps/flappygun/cover.svg',
    alt: 'FlappyGun cover artwork',
  },
  platforms: ['android'],
  applicationCategory: 'GameApplication',
  links: [
    {
      kind: 'playstore',
      label: 'Get it on Google Play',
      // TODO: replace with the real Play Store listing.
      href: 'https://play.google.com/store/apps/details?id=com.example.flappygun',
    },
    { kind: 'website', label: 'Privacy policy', href: '/privacy/flappygun' },
  ],
  facts: [
    { label: 'Version', value: '1.0.0' },
    { label: 'Released', value: 'Oct 2026' },
    { label: 'Price', value: 'Free, ad supported' },
    { label: 'Size', value: '30 MB' },
  ],
  releasedOn: '2026-10-12',
};

const screenshots = [
  {
    src: '/apps/flappygun/screenshot-1.svg',
    alt: 'FlappyGun gameplay screen',
    caption: 'Gameplay — placeholder image',
    width: 1280,
    height: 720,
  },
  {
    src: '/apps/flappygun/screenshot-2.svg',
    alt: 'FlappyGun leaderboard screen',
    caption: 'Leaderboards — placeholder image',
    width: 1280,
    height: 720,
  },
  {
    src: '/apps/flappygun/screenshot-3.svg',
    alt: 'FlappyGun high score screen',
    caption: 'High score screen — placeholder image',
    width: 1280,
    height: 720,
  },
];

function FlappyGunContent() {
  return (
    <>
      <Prose>
        <p>
          <strong>FlappyGun</strong> started as a weekend experiment: what happens if the
          thing keeping you airborne is the same thing you use to shoot? Every tap fires a
          shot downward, and that recoil is your only source of lift. Fire too little and
          you fall. Fire too much and you climb into the ceiling.
        </p>

        <h2>How it plays</h2>
        <p>
          A run lasts as long as your timing does. Obstacles arrive in patterns that get
          tighter the longer you survive, and the score counter only goes up while you are
          still in the air. There are no upgrades and no lives — the whole loop is one
          mechanic, learned over dozens of short attempts.
        </p>

        <FeatureList
          items={[
            'One control: tap to fire, recoil to fly',
            'Hand-built obstacle patterns that ramp as your score climbs',
            'Local high score plus a global leaderboard via Google Play Games',
            'Short runs — most attempts last under a minute',
            'No accounts, no sign-up, no in-app purchases',
          ]}
        />

        <h2>Why I built it</h2>
        <p>
          I wanted a game I could finish. Something small enough that every part of it —
          the physics, the art, the ad integration, the store listing — would be mine to
          understand end to end. It is deliberately unambitious in scope and deliberately
          tight in feel.
        </p>
      </Prose>

      <ScreenshotStrip images={screenshots} />

      <VideoStrip
        videos={[
          {
            // TODO: replace with your own upload id.
            youtubeId: 'aqz-KE-bpKQ',
            title: 'Trailer — placeholder video',
            poster: '/apps/flappygun/trailer-poster.svg',
          },
        ]}
      />

      <Prose>
        <h2>Notes</h2>
        <p>
          Ads are served through Appodeal, which is why the app ships with a privacy
          policy. There is no analytics SDK beyond what the ad network requires, and no
          data leaves the device apart from the leaderboard score you choose to post.
        </p>
      </Prose>
    </>
  );
}

export const flappyGunPost: AppPost = {
  meta,
  Content: FlappyGunContent,
};
