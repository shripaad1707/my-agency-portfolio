import Lenis from 'lenis';
import { useEffect, useState } from 'react';

/** Slow, decelerating "expo out". Used for every transition on the site. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Resolves a file in /public, so the site works at the domain root or in a sub-folder. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

// Lenis already respects the page's scroll-padding-top (set in index.css), so no extra offset.
const NAV_OFFSET = 0;
let lenis: Lenis | null = null;

/** Inertial smooth scrolling. Skipped entirely when the visitor prefers reduced motion. */
export function startSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => 1 - Math.pow(1 - t, 3.2),
    smoothWheel: true,
    anchors: { offset: NAV_OFFSET },
  });
  let frame = 0;
  const raf = (time: number) => {
    lenis?.raf(time);
    frame = requestAnimationFrame(raf);
  };
  frame = requestAnimationFrame(raf);
  return () => {
    cancelAnimationFrame(frame);
    lenis?.destroy();
    lenis = null;
  };
}

export const pauseScroll = () => lenis?.stop();
export const resumeScroll = () => lenis?.start();

export function scrollToId(id: string) {
  if (id === 'top') {
    if (lenis) lenis.scrollTo(0, { force: true });
    else window.scrollTo({ top: 0 });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: NAV_OFFSET, force: true });
  else el.scrollIntoView();
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}
