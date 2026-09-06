import { flushSync } from 'react-dom';

// Capture the existing preview, then let the browser carry it into the viewer.
export default function transitionMedia(update) {
  if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    update();
    return;
  }
  const transition = document.startViewTransition(() => flushSync(update));
  // An interrupted transition must not interfere with opening/closing media.
  transition.ready.catch(() => {});
}
