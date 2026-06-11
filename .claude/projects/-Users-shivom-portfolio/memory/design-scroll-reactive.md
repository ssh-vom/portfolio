---
name: design-scroll-reactive
description: Every front-page section should feel full-viewport important and scrubbed by scroll, not just one-shot reveals
metadata:
  type: feedback
---

The user wants the site to feel "super reactive to scroll" and wants each front-page section to claim real screen real estate (full viewport) so it feels important.

**Why:** The hero and experience sections set the language — scroll-scrubbed progress (rAF + `--p`/`--np` custom properties, reversible both directions), not one-time entrance animations. New sections should continue that, plus motion-graphic flourishes tied to scroll (CSS `animation-timeline: view()` scrubs on section headers, guarded by `@supports` + reduced-motion).

**How to apply:** When adding/restyling a section: give it `min-height: 100svh`, drive its motion from a scrubbed scroll progress variable, and respect `prefers-reduced-motion` (default the CSS var to the settled state). See the writing section's notebook (`.notebook-page`, `--np` scrub in `WritingSection`) as the reference implementation. Related: [[animations-keep]], [[design-no-serif]].
