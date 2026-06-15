import { useEffect, useRef } from 'react';

/**
 * Custom cursor: a dot pinned to the pointer plus a ring that trails
 * it on a lerp. The ring swells over interactive elements. Fine
 * pointers only; reduced-motion users keep the native cursor.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add('has-cursor');
    let x = -100, y = -100, rx = -100, ry = -100;
    let raf = 0;
    let hot = false;

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      if (x === -100) {
        rx = e.clientX;
        ry = e.clientY;
      }
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      const t =
        e.target instanceof Element &&
        e.target.closest('a, button, [role="button"], input, textarea, summary, video');
      if (!!t !== hot) {
        hot = !!t;
        ring.classList.toggle('is-hot', hot);
      }
    };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');

    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <span className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <span className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}
