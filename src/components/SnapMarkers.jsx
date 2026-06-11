/**
 * Invisible scroll-snap targets for a pinned stage: one per focus
 * point. With `scroll-snap-type: y proximity` on the root, the page
 * settles on the nearest slide when the user stops nearby, but fast
 * scrolls pass straight through — no scroll hijacking.
 */
export default function SnapMarkers({ count }) {
  return Array.from({ length: count }, (_, k) => (
    <span
      key={k}
      className="stage-snap"
      aria-hidden="true"
      style={{ top: `calc(${k} * (100% - 100svh) / ${count - 1})` }}
    />
  ));
}
