import { useEffect } from 'react';

const tones = {
  light: ['#f2f1ee', '#f3f0e9', '#edf0e9', '#ece9e5', '#efedf1', '#f3eeea'],
  dark: ['#131211', '#1a150c', '#0f1710', '#171419', '#14121d', '#1d100f'],
};
const rgb = (hex) => hex.match(/[a-f\d]{2}/gi).map((channel) => parseInt(channel, 16));

// Blend across a viewport-wide handoff rather than switching at an observer threshold.
export default function useSectionTone(theme) {
  useEffect(() => {
    const sections = [...document.querySelectorAll('main > section')];
    const palette = tones[theme === 'dark' ? 'dark' : 'light'].map(rgb);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;

    const update = () => {
      raf = 0;
      let color = palette[0];
      let zone = 'hero';
      const height = window.innerHeight;
      sections.slice(1).forEach((section, index) => {
        const top = section.getBoundingClientRect().top;
        const progress = Math.max(0, Math.min(1, (height * 0.85 - top) / (height * 0.7)));
        const next = palette[index + 1] || palette[palette.length - 1];
        const mix = reduced.matches ? Number(progress >= 0.5) : progress * progress * (3 - 2 * progress);
        color = color.map((channel, i) => channel + (next[i] - channel) * mix);
        if (progress >= 0.5) zone = section.id;
      });
      document.body.style.setProperty('--section-bg', `rgb(${color.map(Math.round).join(', ')})`);
      if (document.body.dataset.zone !== zone) document.body.dataset.zone = zone;
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    sections.forEach((section) => resize.observe(section));
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', schedule);
      document.body.style.removeProperty('--section-bg');
      delete document.body.dataset.zone;
    };
  }, [theme]);
}
