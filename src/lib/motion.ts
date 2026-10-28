import { useEffect, useState, type RefObject } from 'react';

/** Slow, decelerating "expo out". Used for every transition on the site. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Resolves a file in /public, so the site works at the domain root or in a sub-folder. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

/*
 * Scrolling is the browser's own. A JavaScript smooth-scroll layer moves the
 * page on the main thread, so any busy moment (a video starting, an image
 * decoding, an entrance animation) froze the scroll for a frame. Native
 * scrolling runs on its own thread and stays fluid; browsers already smooth
 * mouse-wheel scrolling themselves.
 */
export function startSmoothScroll() {
  return () => {};
}

let locks = 0;
/** Stops the page scrolling behind a menu or drawer. */
export const pauseScroll = () => {
  locks += 1;
  document.documentElement.style.overflow = 'hidden';
};
export const resumeScroll = () => {
  locks = Math.max(0, locks - 1);
  if (!locks) document.documentElement.style.overflow = '';
};

const smooth = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

export function scrollToId(id: string) {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: smooth() });
    return;
  }
  const el = document.getElementById(id);
  if (el) scrollToEl(el);
}

/** Scrolls an element into view under the fixed nav (scroll-padding-top in index.css). */
export function scrollToEl(el: HTMLElement) {
  el.scrollIntoView({ behavior: smooth(), block: 'start' });
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

/**
 * Pointer spotlight for every `.spot` card: one listener for the whole page,
 * throttled to one update per frame. Mouse and trackpad only.
 */
export function startSpotlight() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  let frame = 0;
  let last: PointerEvent | null = null;
  const apply = () => {
    frame = 0;
    const e = last;
    if (!e || !(e.target instanceof Element)) return;
    const card = e.target.closest<HTMLElement>('.spot');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  const onMove = (e: PointerEvent) => {
    last = e;
    if (!frame) frame = requestAnimationFrame(apply);
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  return () => {
    window.removeEventListener('pointermove', onMove);
    cancelAnimationFrame(frame);
  };
}

/** Marks a block with data-paused while it is off screen, so its looping CSS animations stop. */
export function usePauseOffscreen(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      el.dataset.paused = entry.isIntersecting ? 'false' : 'true';
    }, { rootMargin: '120px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

/**
 * Muted looping clips that cost nothing until they matter: the file starts
 * loading about a screen before the video arrives, plays only while it is
 * mostly on screen, and pauses as soon as it leaves.
 */
export function useSmartVideo(ref: RefObject<HTMLVideoElement | null>, playAt = 0.35, delay = 0) {
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    let timer = 0;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let warmed = false;
    const warm = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !warmed) {
          warmed = true;
          v.preload = 'auto';
          v.load();
          warm.disconnect();
        }
      },
      { rootMargin: '1000px 0px' },
    );
    const play = new IntersectionObserver(
      ([e]) => {
        if (still) return;
        window.clearTimeout(timer);
        // Clips that appear together start a moment apart, so their decoders don't all spin up in the same frame.
        if (e.isIntersecting && e.intersectionRatio >= playAt) timer = window.setTimeout(() => v.play().catch(() => {}), delay);
        else v.pause();
      },
      { threshold: [0, playAt] },
    );
    warm.observe(v);
    play.observe(v);
    return () => {
      window.clearTimeout(timer);
      warm.disconnect();
      play.disconnect();
    };
  }, [ref, playAt, delay]);
}
