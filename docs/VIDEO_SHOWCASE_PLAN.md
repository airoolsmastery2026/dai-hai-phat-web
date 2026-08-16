# Video Showcase Integration Plan

Status: **Planned only — do not implement until explicit approval.**

## 1. Goal

Add a calm, lightweight video area that can display:

- uploaded project videos;
- external YouTube links;
- future approved providers through the same adapter boundary.

Public wording must remain human-first and must not expose machine-first terminology.

## 2. Recommended placement

Homepage order after approval:

1. Hero
2. Service navigation
3. Project proof
4. **Video showcase**
5. Contact

Keep the homepage preview small: 3–4 featured videos maximum, with a dedicated page later if the library grows.

## 3. UX pattern

### Mobile

- one large featured card or horizontal snap list;
- 16:9 media ratio;
- tap-to-play only;
- visible title and short project/context label;
- no sound or autoplay on page load;
- minimum 44–48 px touch targets.

### Desktop

- featured video + compact supporting grid, or a 3-column grid;
- keyboard-accessible play controls;
- clear focus state;
- lightweight hover motion only;
- no layout shift when the player loads.

## 4. Data contract

Use one source-neutral record shape:

```ts
type VideoSource = "upload" | "youtube";

type VideoRecord = {
  id: string;
  source: VideoSource;
  title: string;
  description?: string;
  sourceUrl: string;
  posterUrl?: string;
  projectSlug?: string;
  featured: boolean;
  order: number;
  status: "draft" | "published" | "archived";
};
```

Do not couple public components directly to YouTube or one storage vendor.

## 5. Component boundary

Planned components:

- `VideoShowcaseSection` — homepage composition only;
- `VideoCard` — reusable preview/navigation card;
- `VideoPlayer` — source-neutral player boundary;
- `YouTubeEmbed` — validated YouTube adapter;
- `UploadedVideoPlayer` — uploaded-file adapter;
- `VideoPoster` — optimized poster/loading state.

No component should exceed the project component-size rule.

## 6. YouTube handling

- accept only validated `youtube.com` and `youtu.be` URLs;
- normalize URLs to a video ID before rendering;
- prefer privacy-enhanced embedding where practical;
- lazy-load the iframe only after user intent or when near the viewport;
- do not require a YouTube API key for basic embeds;
- never render arbitrary iframe URLs from user input.

## 7. Uploaded video handling

Do **not** commit large uploaded videos into the Git repository.

Use a storage adapter. Preferred order at implementation time:

1. existing project object storage if already configured and within quota;
2. Supabase Storage if it fits the current project deployment and quota;
3. another approved object-storage adapter only when required.

The web application should store only normalized metadata and public asset URLs.

Recommended upload limits and formats must be confirmed at implementation time after checking current hosting/storage limits.

## 8. Performance requirements

- poster image first, video/player second;
- `preload="metadata"` or `preload="none"` depending placement;
- no autoplay with sound;
- lazy-load offscreen players;
- reserve aspect ratio to prevent CLS;
- use responsive poster images;
- avoid loading YouTube iframe JavaScript until needed;
- keep homepage video count deliberately small.

## 9. Accessibility requirements

- descriptive title for each video;
- keyboard-operable play/navigation controls;
- visible focus state;
- captions/subtitles when available;
- respect `prefers-reduced-motion`;
- no essential information conveyed only through motion/audio.

## 10. Publishing and security

- draft/published state is explicit;
- external URLs are validated server-side before publication;
- uploaded file MIME/type and size are validated server-side;
- no arbitrary HTML or iframe injection;
- admin/upload controls remain separate from the public rendering surface;
- preserve rollback and removal paths.

## 11. UMS mapping

Implementation should route through the existing Universal Master Skills packs:

- Frontend Architecture — component/source boundaries;
- Responsive Implementation — mobile-first layout;
- Web Accessibility — keyboard/focus/captions;
- Web Performance — lazy loading and Core Web Vitals;
- Information Architecture — video placement and hierarchy;
- Interaction Design — play/load/error states;
- Design System — token-only styling and reusable variants;
- Usability Review — cognitive load and task clarity;
- Testing/QA and Security/Privacy — provider validation and regression checks.

## 12. Implementation sequence after approval

1. confirm exact homepage placement and content count;
2. define `VideoRecord` and provider adapter;
3. implement validated YouTube embed first;
4. add uploaded-video storage adapter;
5. build responsive public components;
6. add loading/error/empty/caption states;
7. add admin/publishing path only if requested;
8. run typecheck, lint, unit tests, build and mobile visual QA;
9. publish only after production verification.

No implementation is authorized by this plan alone.
