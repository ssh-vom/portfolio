import { useEffect, useRef } from 'react';

const SEQUENCE = [
  'arrowup', 'arrowup', 'arrowdown', 'arrowdown',
  'arrowleft', 'arrowright', 'arrowleft', 'arrowright',
  'b', 'a',
];

/** Fires `onUnlock` when the Konami code is typed. */
export default function useKonami(onUnlock) {
  const pos = useRef(0);

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.toLowerCase();
      if (key === SEQUENCE[pos.current]) {
        pos.current += 1;
        if (pos.current === SEQUENCE.length) {
          pos.current = 0;
          onUnlock();
        }
      } else {
        pos.current = key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onUnlock]);
}
