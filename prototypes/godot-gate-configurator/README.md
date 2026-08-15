# DHP Gate Configurator — Godot Prototype

Purpose: validate a zero-dollar interactive 3D capability for Đại Hải Phát without changing the production Next.js/TypeScript runtime.

## Boundary

This prototype is visualization-only.

- Website remains the business brain and system of record.
- Canonical product data, dimensions, material rules, pricing, quotation logic, CRM state, and engineering validation remain Website-owned.
- Values displayed here are sample visualization inputs, not official quotation or engineering outputs.
- A production integration must consume a narrow Website-owned JSON contract and must not read Website private modules or storage directly.

## Current controls

- gate width sample: 2.4–6.0 m
- gate height sample: 1.6–3.0 m
- simulated vertical slat count: 6–24
- procedural 3D frame and slats
- Web export preset using Godot compatibility renderer
- browser handoff button emitting `dhp:gate-selection` to the parent Website

## Local run

```bash
godot --path prototypes/godot-gate-configurator --editor
```

Headless parse/import check:

```bash
godot --headless --path prototypes/godot-gate-configurator --editor --quit
```

Web export after compatible Godot export templates are installed locally:

```bash
godot --headless \
  --path prototypes/godot-gate-configurator \
  --export-release Web \
  prototypes/godot-gate-configurator/build/web/index.html
```

## Automated production export

`.github/workflows/godot-web-export.yml` validates the Godot 4.6.3 Web export on pull requests. After the source is merged to `main`, the same workflow publishes the generated files into:

```text
public/godot/gate-configurator/
```

Vercel then serves the export on the same Website origin at:

```text
/godot/gate-configurator/index.html
```

The Next.js route `/cong-cu/cau-hinh-cong-3d` uses that same-origin path by default. `NEXT_PUBLIC_GODOT_GATE_CONFIGURATOR_URL` remains an optional override for a separately hosted export.

## Intended production contract

The Website → configurator payload should remain bounded and versioned, for example:

```json
{
  "schemaVersion": "1.0",
  "productId": "opaque-product-id",
  "visualization": {
    "widthM": 4.0,
    "heightM": 2.2,
    "styleId": "opaque-style-id",
    "materialId": "opaque-material-id",
    "finishId": "opaque-finish-id"
  },
  "disclaimer": "Visualization only; final dimensions and pricing require engineering validation."
}
```

The configurator may return customer-selected visualization state. It must not calculate or persist authoritative price, structural suitability, or final dimensions.

## Next production slice

1. Product/material/style mapping from canonical Website data.
2. Validate the same-origin Web export on Vercel production.
3. Convert selected configuration into richer AI intake/lead context.
4. Add mobile performance budget and accessibility fallback for devices that cannot run the 3D experience reliably.
