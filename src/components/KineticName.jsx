import { useEffect, useRef } from 'react';

/**
 * Kinetic display name. Each letter exposes --t (0..1, proximity of
 * the pointer); CSS maps it onto Archivo's weight/width axes, so the
 * type physically swells around the cursor. A registered-property
 * transition on --t gives the motion its lag. Touch devices get an
 * idle weight wave instead (pure CSS); reduced motion gets static type.
 */
export default function KineticName({ lines }) {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const root = ref.current;
    if (!root) return;
    const letters = Array.from(root.querySelectorAll('.kn-l'));
    let raf = 0;
    let mx = 0, my = 0;
    let inside = false;

    const apply = () => {
      raf = 0;
      for (const el of letters) {
        let t = 0;
        if (inside) {
          const r = el.getBoundingClientRect();
          const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
          t = Math.max(0, 1 - d / 300);
        }
        el.style.setProperty('--t', t.toFixed(3));
      }
    };
    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      inside = true;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      inside = false;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  let idx = 0;
  return (
    <h1 className="kn" ref={ref} aria-label={lines.join(' ')}>
      {lines.map((line, li) => (
        <span
          key={li}
          aria-hidden="true"
          className={`kn-line${li === lines.length - 1 ? ' kn-line-outline' : ''}`}
        >
          {Array.from(line).map((ch, ci) => (
            <span className="kn-l" key={ci} style={{ '--i': idx++ }}>
              {ch}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
