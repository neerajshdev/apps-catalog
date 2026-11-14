// First real post. Every claim below comes from the public Play Store listing
// (or the app's own artwork) — nothing here is invented.

import Link from "next/link";
import FeatureList from "@/components/post/FeatureList";
import Prose from "@/components/post/Prose";
import ScreenshotStrip from "@/components/post/ScreenshotStrip";
import type { AppPost, AppPostMeta } from "@/types/post";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=app.savem8";
/** Hosted on this site — see `src/app/privacy/savem8/page.tsx`. */
const PRIVACY_POLICY_PATH = "/privacy/savem8";

const meta: AppPostMeta = {
  slug: "savem8",
  title: "SaveM8 – Browser & Media Saver",
  tagline:
    "An Android browser with a media saver built in: spot a video while you browse, then keep it.",
  tags: ["Tools", "Browser", "Media saver"],
  cover: {
    src: "/apps/savem8/cover.png",
    alt: "SaveM8 app icon beside the SaveM8 wordmark, the subtitle “Browser & Media Saver” and the line “Watch · Browse · Save”",
    width: 1600,
    height: 900,
  },
  platforms: ["android"],
  applicationCategory: "UtilitiesApplication",
  links: [
    { kind: "playstore", label: "Get it on Google Play", href: PLAY_STORE_URL },
    { kind: "website", label: "Privacy policy", href: PRIVACY_POLICY_PATH },
  ],
  facts: [
    { label: "Category", value: "Tools" },
    { label: "Installs", value: "10+" },
    { label: "Price", value: "Free, ad supported" },
    { label: "Content rating", value: "Rated for 3+" },
    { label: "Updated", value: "Nov 2026" },
  ],
  // Play does not publish the original release date, so the post uses the
  // listing’s last update (8 Nov 2026). Keep both in sync if that changes.
  releasedOn: "2026-11-08",
};

const screenshots = [
  {
    src: "/apps/savem8/screenshot-1.webp",
    alt: "SaveM8 browser playing a video, with a “Video Found” bar and a Save button over the player",
    caption: "The browser spots a video and offers to save it.",
    width: 940,
    height: 1672,
  },
  {
    src: "/apps/savem8/screenshot-2.webp",
    alt: "SaveM8 media library with Videos, Audios and Images tabs, every item carrying its own Download button",
    caption: "What you keep is grouped into Videos, Audios and Images.",
    width: 941,
    height: 1672,
  },
];

const features = [
  "A browser you can actually browse in, with saving built into the same screen",
  "Detects the video on the page you are watching and offers a Save action",
  "Takes pasted links too — Instagram Reels, Snapchat Spotlight, Pinterest video Pins, Facebook videos and more",
  "Files what you save under Videos, Audios and Images",
  "Full-screen playback, added in the latest update",
  "No account, no sign-up",
];

function SaveM8Content() {
  return (
    <>
      <Prose>
        <p>
          <strong>SaveM8</strong> is an Android browser that keeps what it
          finds. You browse as you normally would; when a page carries a video,
          the app puts a “Video Found” bar over the player and offers to save it
          to the device. Pasting a link works the same way, and the store
          listing calls out Instagram Reels and Facebook videos as the everyday
          cases.
        </p>

        <FeatureList items={features} />
      </Prose>

      <ScreenshotStrip images={screenshots} />

      <Prose>
        <h2>How a save works</h2>
        <ul>
          <li>Open a link in the browser, or paste one in.</li>
          <li>
            SaveM8 surfaces the media it found on that page, with a Save action
            beside it.
          </li>
          <li>The file lands in your library, where it plays full screen.</li>
        </ul>

        <h2>
          A video downloader for Instagram, Snapchat, Pinterest and Facebook
        </h2>
        <p>
          The same save flow works across the four platforms people ask about
          most: Instagram, Snapchat, Pinterest and Facebook. The difference is
          what each platform exposes publicly, so the sections below set
          expectations per app. SaveM8 is a browser with saving built in, not a
          set of private API integrations, and it does not ask for your social
          account password.
        </p>

        <h3>Saving Instagram Reels</h3>
        <p>
          Instagram Reels are the most-requested save target, and they are also
          the most restricted. Instagram’s own app only offers a “Download”
          option when the creator has explicitly enabled downloads for that
          Reel. For everything else, the app deliberately avoids providing a
          permanent file, storing media in a temporary cache instead. The
          platform’s API also excludes endpoints for pulling original video
          files, which is why most Instagram Reels downloaders rely on
          workarounds rather than direct access.
        </p>
        <p>
          SaveM8 approaches this through the same browser-detection flow it uses
          for any page. When you open a public Reel in the built-in browser, the
          app looks for the media stream the page is already loading and
          surfaces a Save action. This works reliably for public accounts, which
          is the same boundary every Reels downloader operates within — Reels
          from private or followers-only profiles cannot be retrieved by
          external tools. The result is a local file that plays full-screen in
          SaveM8’s library, without needing a separate Instagram-specific
          downloader.
        </p>

        <h3>Downloading Snapchat Spotlight videos</h3>
        <p>
          Snapchat is a different problem. The app is built around disappearing
          messages and login-gated content, and Snapchat itself does not
          officially support downloading Spotlight videos through its own
          interface. Third-party tools that handle Snapchat generally split into
          two groups: those that claim to save Stories and private Snaps, and
          those that only touch public Spotlight content. The first group is
          largely unreliable — Stories and Memories are login-gated and are not
          consistently accessible to link-based downloaders. Spotlight, by
          contrast, is public by design, and downloaders that focus on Spotlight
          can retrieve the source MP4 without a watermark because Snapchat’s CDN
          serves the file directly.
        </p>
        <p>
          SaveM8 falls into the public-content lane. When you browse a public
          Snapchat Spotlight page in SaveM8, the app can detect the video stream
          and offer a save, just as it does for any other video on the web. It
          does not attempt to bypass Snapchat’s login wall for private Snaps,
          Stories, or Memories. That limitation is worth stating plainly: the
          app is a browser with saving built in, not a Snapchat credential
          workaround. For public Spotlight clips you want to keep, the
          paste-a-link flow works the same way as the on-page detection.
        </p>

        <h3>Saving Pinterest video Pins</h3>
        <p>
          Pinterest is more forgiving than Instagram or Snapchat. Video Pins,
          Idea Pins, and Carousel Pins with video all expose media that a
          downloader can pick up without an account. Most Pinterest video
          downloaders follow the same simple flow: copy the Pin link, paste it
          into the app, and choose the quality. Pinterest also lets users save
          Pins to boards inside the platform, but that is a bookmarking action,
          not a device file. A downloader is what turns a saved Pin into
          something you can play offline or edit.
        </p>
        <p>
          SaveM8 handles Pinterest the same way it handles any page: open the
          Pin in the browser, and the app surfaces the video it finds. Because
          Pinterest Pins are frequently embedded across the web, the on-page
          detection is often the faster route — you may encounter a Pin video on
          a blog or inspiration board and save it without needing to jump back
          to the Pinterest app first. The library then files it under Videos
          alongside your other saves.
        </p>

        <h3>Downloading Facebook videos</h3>
        <p>
          Facebook video comes in two practical categories. Public Page videos,
          Reels, and Watch clips are the straightforward case: copy the link,
          paste it into a downloader, and pick a resolution. The second category
          is private or friends-only video. Many downloader listings advertise
          “private video downloader” features, but Facebook’s privacy model
          means a link-based tool can only reach content that is publicly served
          — the same boundary that applies to Instagram and Snapchat. For videos
          you can already see because you are logged in, a browser-based saver
          can work within that session; for videos locked behind someone else’s
          privacy settings, no downloader can reliably pull the file.
        </p>
        <p>
          SaveM8’s Facebook support is strongest on public video: Page posts,
          Reels, and Watch clips that appear in the browser. When you land on a
          Facebook video page, the “Video Found” bar appears over the player and
          the Save action puts the file into your library. If you are browsing
          Facebook in SaveM8 while logged in, the app can detect media that your
          session is authorized to view. It does not claim to unlock private
          videos from accounts you cannot access — and that honesty is part of
          what separates a browser-with-saving from a tool that overpromises.
        </p>

        <h2>How SaveM8 compares across platforms</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Platform</th>
              <th scope="col">What works in SaveM8</th>
              <th scope="col">What does not work</th>
              <th scope="col">Best flow</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Instagram</strong>
              </td>
              <td>
                Public Reels and feed videos detected in the browser or via
                pasted link
              </td>
              <td>
                Private or followers-only Reels; creator-disabled downloads
              </td>
              <td>Open the Reel in SaveM8, tap Save on the detection bar</td>
            </tr>
            <tr>
              <td>
                <strong>Snapchat</strong>
              </td>
              <td>Public Spotlight videos; links to public Spotlight pages</td>
              <td>
                Private Stories, Memories, chat Snaps, login-gated content
              </td>
              <td>Paste a public Spotlight link or browse to it</td>
            </tr>
            <tr>
              <td>
                <strong>Pinterest</strong>
              </td>
              <td>
                Video Pins, Idea Pins, Carousel videos exposed on the page
              </td>
              <td>
                Pins that are themselves private board items behind a login
              </td>
              <td>Open the Pin or paste its link</td>
            </tr>
            <tr>
              <td>
                <strong>Facebook</strong>
              </td>
              <td>
                Public Page videos, Reels, Watch clips; logged-in session video
              </td>
              <td>
                Friends-only or private-group video you cannot already view
              </td>
              <td>Browse to the video or paste the link, then Save</td>
            </tr>
          </tbody>
        </table>
        <p>
          The common thread is that SaveM8 is a browser first. It does not
          maintain separate API integrations for each social network, and it
          does not ask for your Instagram or Snapchat password. The saving
          happens by detecting media on pages the browser can already reach.
          That makes it a good fit for public, link-addressable video across
          these four platforms, and a poor fit for anything that requires
          bypassing a login wall. For the everyday case — a Reel you want to
          keep, a Spotlight clip you liked, a Pinterest tutorial you want
          offline, a Facebook Page video you need to reference — the same
          two-step flow applies everywhere: browse or paste, then save.
        </p>

        <h2>Fewer ads, not zero ads</h2>
        <p>
          The store artwork sells the app as “pure browsing, minimal ads”, and
          the promise is a fair one: reading a page does not stop every few taps
          for a full-screen ad. It is still ad supported — Play lists the app as
          containing ads, and that is what keeps it free.
        </p>

        <h2>What it asks for</h2>
        <p>
          Very little, judging by Play’s Data safety section: no data collected,
          nothing shared with third parties, traffic encrypted in transit. The
          listing is published under the developer name Softneez, and the{" "}
          <Link href={PRIVACY_POLICY_PATH}>privacy policy</Link> lives on this
          site if you want the full text before installing.
        </p>

        <h2>Frequently asked questions about social video downloads</h2>

        <h3>Can SaveM8 download Instagram Reels from private accounts?</h3>
        <p>
          No. Every Reels downloader is limited to public accounts, because
          Instagram does not serve private Reels to logged-out or third-party
          requests. SaveM8 follows the same rule.
        </p>

        <h3>Does SaveM8 remove Snapchat watermarks?</h3>
        <p>
          For public Spotlight videos, the source file from Snapchat’s CDN is
          served without a watermark, and SaveM8 saves that source file. It does
          not modify or re-encode the video.
        </p>

        <h3>Do I need a Pinterest account to save a video Pin?</h3>
        <p>
          Not in SaveM8. Public Pins can be opened or linked in the browser and
          saved without logging in to Pinterest.
        </p>

        <h3>Can I save a private Facebook video with SaveM8?</h3>
        <p>
          If you can already view the video in your logged-in browser session,
          the app can detect and save it. If the video is locked behind someone
          else’s privacy settings, a link-based save cannot reach it.
        </p>

        <h3>Is SaveM8 free?</h3>
        <p>
          Yes, and it is ad-supported. The store listing discloses ads, and the
          app does not require an account or sign-up.
        </p>
      </Prose>
    </>
  );
}

export const saveM8Post: AppPost = {
  meta,
  Content: SaveM8Content,
};
