# Motion — Emil design engineering adapter

Read this phase last and only when a real state transition benefits from
motion. The conceptual source is
[`emilkowalski/skills`](https://github.com/emilkowalski/skills).

## Motion gate

A motion candidate must have one named purpose: feedback, spatial continuity,
state indication, preventing a jarring change, or explanation. Reject motion
whose only purpose is decoration.

When motion is justified:

- reuse DHP duration and easing tokens;
- keep controls around 160ms and panels around 240ms;
- animate opacity and transform only unless measurement proves another need;
- preserve immediate keyboard response and avoid repeated high-frequency
  animation;
- honor `prefers-reduced-motion` and keep content usable with motion removed;
- prefer CSS and the current stack; do not add a motion package for polish.

Audit existing motion before adding new motion. It is valid to finish with no
motion changes when restraint better serves clarity and performance.
