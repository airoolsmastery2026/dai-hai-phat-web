# PhotoGIMP / GIMP Optional Editor Integration

## Status

Accepted as an **optional local post-processing integration** for DHP-AIOS. It is not part of CORE and must never become a hard dependency.

Upstream reference: https://github.com/Diolinux/PhotoGIMP

## Role

PhotoGIMP is treated as a UX/configuration preset for GIMP, not as a standalone rendering engine and not as an AI model provider.

```text
SketchUp / DHP image source
        ↓
DHP render / AI generation
        ↓
DHP media post-process routing
        ├─ GIMP + PhotoGIMP preset (preferred desktop option when detected)
        ├─ GIMP (desktop fallback)
        └─ DHP Web Editor (always-available fallback)
```

The canonical adapter registry lives in:

`src/lib/media/image-editor-adapters.ts`

## Architectural rules

1. DHP generation and render pipelines remain provider-independent.
2. PhotoGIMP must not be imported, bundled or required by the Next.js runtime.
3. GIMP/PhotoGIMP availability is reported by an optional local desktop bridge/service when such a bridge is present.
4. Browser/mobile users must continue through the DHP Web Editor without degradation.
5. If PhotoGIMP is missing, use standard GIMP.
6. If GIMP is missing or desktop editing is disabled, use the DHP Web Editor.
7. No paid API is introduced by this integration.
8. Do not copy or vendor upstream PhotoGIMP assets/configuration into this repository unless licensing and update ownership are reviewed separately.

## Capability contract

Desktop GIMP-based editing can advertise:

- layers
- masks
- selection
- color adjustments
- retouch
- compositing
- export

The web fallback may expose a smaller capability set while preserving the same media workflow.

## SketchUp integration

This integration extends the existing DHP SketchUp render/compare workflow as a post-render step only:

```text
Render preview
→ Compare before/after
→ Optional post-process
→ Export / quote / customer presentation
```

It does not modify SketchUp geometry, render queue ownership, comparison-session data, or pricing logic.

## Future local bridge contract

A future local bridge may report only runtime availability and launch intent, for example:

```json
{
  "photogimpAvailable": true,
  "gimpAvailable": true,
  "preferDesktop": true
}
```

The web application resolves that state through `resolveImageEditorAdapter()` and must always retain the web fallback.

## Acceptance criteria

- PhotoGIMP is optional.
- No new npm dependency.
- No paid service dependency.
- No CORE architecture change.
- No effect on mobile/web when desktop tools are absent.
- Deterministic fallback order: PhotoGIMP → GIMP → DHP Web Editor.
