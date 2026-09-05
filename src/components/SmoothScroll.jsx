import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis;

    const configure = () => {
      lenis?.destroy();
      lenis = undefined;
      if (preference.matches) return;
      lenis = new Lenis({
        autoRaf: true,
        smoothWheel: true,
        // Short settling time: soften wheel notches without a floaty tail
        // on trackpads. Keep device deltas and native touch momentum intact.
        lerp: 0.18,
        wheelMultiplier: 1,
        syncTouch: false,
        anchors: true,
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
        virtualScroll: ({ event }) => !event.ctrlKey && !event.metaKey && !event.shiftKey,
      });
      syncLock();
    };
    const syncLock = () => {
      if (!lenis) return;
      // The existing theatre locks body overflow, not the root wrapper.
      if (document.body.style.overflow === 'hidden') lenis.stop();
      else if (lenis.isStopped) lenis.start();
    };
    const onKeyDown = (event) => {
      if (!lenis || lenis.isStopped || event.defaultPrevented) return;
      if (!['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, button, [contenteditable]')) return;
      // Cancel wheel inertia before the browser handles keyboard scrolling.
      lenis.scrollTo(window.scrollY, { immediate: true });
    };
    const observer = new MutationObserver(syncLock);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    preference.addEventListener('change', configure);
    window.addEventListener('keydown', onKeyDown);
    configure();
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', configure);
      window.removeEventListener('keydown', onKeyDown);
      lenis?.destroy();
    };
  }, []);

  return children;
}
