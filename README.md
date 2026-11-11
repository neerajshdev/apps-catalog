# ChikuApps

Personal catalog of the apps I build — Android games, desktop tools and browser
experiments. Live at **https://chikuapps.com**.

Built with Next.js (App Router) and CSS Modules. Every page is statically
rendered; there is no database, API or admin UI.

## Project structure

```
src/
├─ app/
│  ├─ page.tsx                 # index: intro + post cards
│  ├─ apps/[slug]/page.tsx     # one app post (SSG via generateStaticParams)
│  ├─ privacy/<app>/page.tsx   # privacy policies (required by Play Store)
│  ├─ privacy/privacy.module.css
│  ├─ layout.tsx               # metadataBase, title template, global CSS
│  └─ globals.css              # design tokens + base styles
├─ content/
│  ├─ site.ts                  # brand name, domain, site copy
│  └─ apps/
│     ├─ index.ts              # the post registry — add new posts here
│     ├─ flappygun.tsx         # a post: `meta` + `Content`
│     └─ flap-the-bird.tsx
├─ components/
│  ├─ post/                    # reusable post building blocks
│  └─ Icons.tsx
├─ lib/format.ts
└─ types/post.ts

public/apps/<slug>/            # cover + screenshot artwork
```

## Adding an app

1. Create `src/content/apps/<slug>.tsx`:

   ```tsx
   export const myPost: AppPost = {
     meta: { slug, title, tagline, tags, cover, platforms, links, facts, releasedOn },
     Content: MyPostContent,
   };
   ```

2. Register it in `src/content/apps/index.ts` (`POSTS` array).
3. Put artwork in `public/apps/<slug>/` and reference it as `/apps/<slug>/cover.png`.
   Covers render at 16:9; for screenshots pass the real `width`/`height` so the
   rail reserves space (portrait phone shots are supported and are capped by
   height rather than squeezed into a 16:9 box).
   `next/image` handles responsive widths plus AVIF/WebP negotiation, so keep
   one large source per image — ~1600×900 for a cover, ~940 px wide for phone
   screenshots — and do not commit size variants. If you ever host this where
   the optimizer is unavailable, set `images: { unoptimized: true }` in
   `next.config.ts` and pre-size the files instead.

`generateStaticParams` and `generateMetadata` pick the new post up automatically —
nothing else to wire.

## Reusable blocks (`@/components/post`)

| Component | Use |
| --- | --- |
| `PostCard` | Index card (rendered by the home page) |
| `PostHeader` | Detail header: title, tags, cover, facts, CTAs |
| `Prose` | Wrapper for hand-written copy (`<p>`, `<h2>`, `<ul>`…) |
| `FeatureList` | Checkmark list |
| `ScreenshotStrip` | Horizontally scrollable image rail (no JS) |
| `VideoStrip` | Horizontally scrollable video rail (click-to-load YouTube) |
| `AppFacts` | Label/value row, driven by `meta.facts` |
| `AppLinkButtons` | CTAs: `playstore` · `appstore` · `download` · `github` · `website` |
| `TagList` / `PlatformChips` | Tags and platform badges |
| `SiteHeader` / `SiteFooter` | Shared page chrome |

A post can compose whichever blocks it needs — `flappygun` has a video rail,
`flap-the-bird` does not. Content outside the shared blocks is just JSX.

## Commands

```bash
bun dev            # development server
bun run build      # production build
npx tsc --noEmit   # type check
npx eslint src     # lint
```

## Notes

- `savem8` is the first real post. Its icon and screenshots came from the Play
  listing (screenshots re-encoded to WebP at 940 px wide); `cover.png` is a
  1600×900 palette PNG generated from the store icon, and doubles as the
  OpenGraph image.
- Privacy policies are hosted here, one folder per app: `/privacy/<slug>`. Use
  `https://chikuapps.com/privacy/<slug>` as the policy URL in the Play Console.
- **Web Analytics** (`@vercel/analytics`) is mounted once in `src/app/layout.tsx`,
  so every page reports page views, including client-side transitions. It only
  collects data when the project is deployed on Vercel **and** Web Analytics is
  enabled in the project dashboard; locally you will see a 404 for
  `/_vercel/insights/script.js`, which is expected.
- The two sample posts (`flappygun`, `flap-the-bird`) still use placeholder
  copy, SVG artwork and `com.example.*` store URLs, all marked `TODO`.
- Brand name, domain and site copy live only in `src/content/site.ts`.
- Design tokens live in `src/app/globals.css`; only tokens in use are defined.
