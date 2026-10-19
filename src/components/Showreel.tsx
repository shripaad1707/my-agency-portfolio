import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CHIPS, CONTACT, INTRO_CHAPTERS } from '../content';
import { EASE, asset, scrollToEl } from '../lib/motion';
import { Arrow, Icon } from './ui';

const stamp = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

export default function Showreel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [withSound, setWithSound] = useState(false);
  const [chapter, setChapter] = useState(-1);

  // The thumbnail stays up until the visitor presses play.
  const playFrom = useCallback((t = 0) => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.currentTime = t;
    video.controls = true;
    video.play().catch(() => {});
    setWithSound(true);
  }, []);

  // On phones the chapters sit below the video, so bring the video back into view.
  const jumpTo = (t: number) => {
    playFrom(t);
    const frame = frameRef.current;
    if (!frame) return;
    const r = frame.getBoundingClientRect();
    const navH = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, navH);
    if (visible < r.height * 0.8) scrollToEl(frame);
  };

  // "Watch my intro" in the hero starts it with sound.
  useEffect(() => {
    const onPlay = () => playFrom(0);
    window.addEventListener('showreel:play', onPlay);
    return () => window.removeEventListener('showreel:play', onPlay);
  }, [playFrom]);

  // Highlight the chapter that is playing.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => {
      let i = -1;
      INTRO_CHAPTERS.forEach((c, k) => {
        if (video.currentTime >= c.t - 0.05) i = k;
      });
      setChapter((prev) => (prev === i ? prev : i));
    };
    video.addEventListener('timeupdate', onTime);
    return () => video.removeEventListener('timeupdate', onTime);
  }, []);

  return (
    <section id="showreel" className="pb-24 lg:pb-32">
      <div className="wrap">
        <motion.div
          className="mx-auto max-w-[1120px] rounded-[30px] bg-gradient-to-b from-accent/35 via-line to-accent-2/25 p-px shadow-[0_50px_120px_-50px_rgba(79,70,229,0.55)]"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
        >
          <div className="grid items-center gap-8 overflow-hidden rounded-[29px] bg-night p-4 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14 lg:p-14">
            {/* The vertical intro */}
            <div
              ref={frameRef}
              className="relative mx-auto aspect-[9/16] w-full max-w-[420px] overflow-hidden rounded-[22px] bg-black ring-1 ring-white/10 lg:order-2 lg:w-[360px] xl:w-[380px]"
            >
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                poster={asset('img/intro-poster.webp')}
                playsInline
                preload="metadata"
                aria-label="90-second intro by Shripaad Koduri: 3D renders in Blender, premium websites, video and motion design, and automations"
              >
                <source src={asset('media/intro.mp4')} type="video/mp4" />
                <source src={asset('media/intro.webm')} type="video/webm" />
              </video>

              {/* Light dim on the thumbnail so the play button stands out */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,17,33,0.5),rgba(14,17,33,0.12)_45%,transparent_72%)]"
                animate={{ opacity: withSound ? 0 : 1 }}
                transition={{ duration: 1, ease: EASE }}
              />

              {!withSound && (
                <button
                  type="button"
                  onClick={() => playFrom(0)}
                  className="group absolute inset-0 flex flex-col items-center justify-center gap-4 text-white"
                  aria-label="Play the intro with sound"
                >
                  <span className="relative grid h-16 w-16 place-items-center rounded-full bg-white text-accent shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)] transition-colors duration-500 ease-arch group-hover:bg-accent-soft sm:h-20 sm:w-20">
                    <span className="play-ring" aria-hidden="true" />
                    <svg width="18" height="20" viewBox="0 0 10 12" aria-hidden="true" className="ml-1">
                      <path d="M0 0l10 6-10 6z" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="rounded-full bg-night/70 px-3.5 py-1.5 text-[14px] font-medium tracking-[-0.01em] backdrop-blur-sm">Play with sound</span>
                </button>
              )}
            </div>

            {/* What is in it, with jump-to chapters */}
            <div className="px-2 pb-2 sm:px-0 sm:pb-0 lg:order-1">
              <p className="text-[13px] font-medium text-white/55">My 90-second intro</p>
              <h2 className="mt-3 max-w-[18ch] text-[clamp(1.75rem,2.7vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-white">
                See what I can build for your business.
              </h2>
              <p className="mt-4 max-w-[46ch] text-[15.5px] leading-relaxed text-white/65">
                3D renders made in Blender, premium websites, video and motion design, and automations that reply to
                your leads. Press play with sound, or jump to a part.
              </p>

              <ol className="mt-8 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-2 lg:max-w-[460px]">
                {INTRO_CHAPTERS.map((c, i) => {
                  const active = i === chapter;
                  return (
                    <li key={c.label}>
                      <button
                        type="button"
                        onClick={() => jumpTo(c.t)}
                        className={`group flex w-full flex-col items-start gap-0.5 rounded-lg py-2 text-left text-[14.5px] transition-colors duration-300 sm:flex-row sm:items-baseline sm:gap-3 ${
                          active ? 'text-white' : 'text-white/70 hover:text-white'
                        }`}
                        aria-label={`Play from ${c.label}, ${stamp(c.t)}`}
                      >
                        <span className={`tabular w-9 shrink-0 text-[12.5px] ${active ? 'text-accent-2' : 'text-white/40'}`}>{stamp(c.t)}</span>
                        <span className="relative">
                          {c.label}
                          <span
                            aria-hidden="true"
                            className={`absolute -bottom-0.5 left-0 h-px bg-accent-2 transition-[width] duration-500 ease-arch ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}
                          />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </motion.div>

        <div className="mx-auto mt-5 flex max-w-[1120px] flex-wrap items-center justify-end gap-x-6 gap-y-2 px-1">
          <a href={CONTACT.demoSite} target="_blank" rel="noreferrer" className="link-btn text-[14px] text-slate hover:text-ink">
            Explore the demo website <Arrow />
          </a>
        </div>

        <ul className="mx-auto mt-14 flex max-w-[1120px] flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:mt-16">
          {CHIPS.map((chip, i) => (
            <motion.li
              key={chip.label}
              className="flex items-center gap-2.5 text-[15px] text-ink/80"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.05 }}
            >
              <Icon name={chip.icon} size={18} className="text-accent" />
              {chip.label}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
