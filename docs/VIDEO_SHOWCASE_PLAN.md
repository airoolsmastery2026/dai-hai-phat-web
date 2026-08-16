# Video Showcase Integration Plan

Status: **Baseline implementation approved and implemented. Persistent object-storage upload remains intentionally unconfigured until a real storage provider is connected.**

## Goal

Provide one source-neutral video system for:

- validated YouTube links;
- direct video URLs from approved object storage;
- local admin preview before a future storage upload;
- future approved providers behind the same data contract.

Public wording remains human-first.

## Implemented baseline

- Homepage placement: Hero → Services → Projects → Video → Contact.
- `VideoRecord` contract supports `youtube` and `upload` sources, draft/published/archived state, poster, captions, featured ordering and optional project link.
- YouTube URLs are normalized to IDs and embedded only through `youtube-nocookie.com`.
- YouTube iframe loads only after explicit Play intent, preventing player JavaScript from loading on initial page render.
- Hosted file URLs accept same-origin or HTTPS MP4/WebM/MOV sources only.
- Native video uses controls, `playsInline`, reserved 16:9 layout and metadata preload.
- Homepage shows at most four published records. When none are published, it shows a calm project-video empty state instead of fake media.
- `/admin/media/videos` is protected by the existing `/admin` Basic Auth boundary and can preview YouTube links, hosted video URLs and local MP4/WebM/MOV files.
- Local files are explicitly preview-only while storage is unconfigured. The interface never reports a successful server upload.
- Large video binaries are not committed to Git.

## Storage status

The repository and current Vercel project expose no configured object-storage credential or existing upload backend. The existing `/admin/media` image manager is also staging-only.

Therefore this implementation does not invent a storage provider, secret, paid dependency or fake persistence layer. The next storage step is to connect a real bucket/provider, then replace the current `VIDEO_STORAGE_STATUS` boundary with a direct-to-storage upload adapter and store only normalized public URLs in the video records.

## Publishing workflow

1. Add or inspect a source in `/admin/media/videos`.
2. Confirm title, source URL and optional poster.
3. Keep the record `draft` until media and rights are verified.
4. Add approved metadata to `src/data/video-showcase.ts` with `status: "published"`.
5. Homepage renders published records automatically, ordered by featured flag and order.

## Guardrails

- Never render arbitrary iframe URLs.
- Never commit large video files to the Git repository.
- No autoplay on initial page load.
- Keep media 16:9 to avoid layout shift.
- Provide captions when available.
- Preserve visible keyboard focus and touch targets.
- Use project design tokens and no additional runtime package.
- Do not expose storage secrets to the browser.

## Next storage milestone

Only after a real object-storage provider is selected/configured:

1. create signed/direct upload flow;
2. validate MIME and provider limits server-side;
3. upload directly from browser to storage rather than proxying large files through the app server;
4. persist normalized metadata;
5. add deletion/rollback and quota monitoring;
6. run security, mobile and performance QA before enabling production upload.
