import { useEffect, useRef } from 'react';

/**
 * Ambient flow field: a blurred ribbon and two drifting blobs in the
 * accent palette, fixed behind all content. Each shape self-animates
 * slowly (water-like sway) while --fp — overall page scroll progress —
 * parallaxes them, so the whole field flows as you move through the site.
 */
export default function Flow() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      el.style.setProperty('--fp', p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="flow" ref={ref} aria-hidden="true">
      <span className="flow-ribbon" />
      <span className="flow-blob flow-blob-a" />
      <span className="flow-blob flow-blob-b" />
    </div>
  );
}
