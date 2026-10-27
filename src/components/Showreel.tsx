import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { CHIPS, CONTACT } from '../content';
import { EASE, asset, useMediaQuery, usePauseOffscreen } from '../lib/motion';
import { Aurora } from './ambient';
import { Arrow, Icon } from './ui';

/** The services, running past slowly. Pauses on hover; a plain wrapped list under reduced motion. */
function ServiceMarquee() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  usePauseOffscreen(ref);

  if (reduce) {
    return (
      <ul className="mx-auto mt-14 flex max-w-[1120px] flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:mt-16">
        {CHIPS.map((chip) => (
          <li key={chip.label} className="flex items-center gap-2.5 text-[15px] text-ink/80">
            <Icon name={chip.icon} size={18} className="text-accent" />
            {chip.label}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div ref={ref} className="marquee mx-auto mt-14 max-w-[1120px] lg:mt-16">
      <ul className="marquee-track" aria-label="Services">
        {[...CHIPS, ...CHIPS].map((chip, i) => (
          <li
            key={`${chip.label}-${i}`}
            aria-hidden={i >= CHIPS.length ? true : undefined}
            className="flex shrink-0 items-center gap-2.5 pr-12 text-[15px] whitespace-nowrap text-ink/75"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-line bg-white text-accent shadow-[0_6px_16px_-10px_rgba(79,70,229,0.5)]">
              <Icon name={chip.icon} size={16} />
            </span>
            {chip.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Showreel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const wide = useMediaQuery('(min-width: 640px)');
  const [withSound, setWithSound] = useState(false);
  usePauseOffscreen(stageRef);

  // The frame starts tipped back and settles flat as it rises into view.
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'start 0.3'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [wide ? 18 : 8, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  // The thumbnail stays up until the visitor presses play.
  const playWithSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.currentTime = 0;
    video.controls = true;
    video.play().catch(() => {});
    setWithSound(true);
  }, []);

  // "Watch my intro" in the hero starts it with sound.
  useEffect(() => {
    window.addEventListener('showreel:play', playWithSound);
    return () => window.removeEventListener('showreel:play', playWithSound);
  }, [playWithSound]);

  return (
    <section id="showreel" className="pb-24 lg:pb-32">
      <div className="wrap" style={{ perspective: '1800px' }}>
        <div className="relative mx-auto max-w-[1120px]">
        {/* Soft glow under the stage. It stays still while the stage tilts, so it never has to be redrawn. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[6%] -bottom-10 top-[35%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(79,70,229,0.35),transparent)]"
        />
        <motion.div
          ref={stageRef}
          className="relative rounded-[30px] bg-gradient-to-b from-accent/40 via-line to-accent-2/30 p-px will-change-transform"
          style={reduce ? undefined : { rotateX, scale, y, transformOrigin: '50% 0%' }}
        >
          {/* Full-width stage; the vertical video sits in the middle at full height, lit by soft studio lights */}
          <div className="relative aspect-[9/16] overflow-hidden rounded-[29px] bg-[#0b0d1a] sm:aspect-[4/5] lg:aspect-[16/10]">
            <div aria-hidden="true" className="absolute inset-0 hidden sm:block">
              {/* A tiny pre-blurred copy of the poster, stretched: soft colour with no live blur filter */}
              <div
                className="absolute inset-0 scale-110 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url(${asset('img/intro-poster-blur.webp')})` }}
              />
              <Aurora preset="stage" />
              <div className="grain absolute inset-0" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_30%,transparent_80%)]" />
            </div>

            <div className="relative mx-auto h-full aspect-[9/16] max-w-full sm:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]">
              <video
                ref={videoRef}
                className="h-full w-full bg-black object-cover"
                poster={asset('img/intro-poster.webp')}
                playsInline
                preload="metadata"
                aria-label="90-second intro by Shripaad Koduri: 3D renders in Blender, premium websites, video and motion design, and automations"
              >
                <source src={asset('media/intro.mp4')} type="video/mp4" />
                <source src={asset('media/intro.webm')} type="video/webm" />
              </video>
            </div>

            {/* Small labels on the stage, wide screens only */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-6 hidden items-center justify-between lg:flex">
              <span className="flex items-center gap-2 rounded-full glass-dark px-3 py-1.5 text-[12.5px] font-medium text-white/85">
                <span className="live-dot" style={{ ['--dot' as string]: '#ff5a5f' }} />
                My 90-second intro
              </span>
              <span className="rounded-full glass-dark px-3 py-1.5 text-[12.5px] font-medium text-white/85">
                3D, web, video and automation
              </span>
            </div>

            {/* Light dim on the thumbnail so the play button stands out */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,17,33,0.45),rgba(14,17,33,0.1)_45%,transparent_70%)]"
              animate={{ opacity: withSound ? 0 : 1 }}
              transition={{ duration: 1, ease: EASE }}
            />

            {!withSound && (
              <button
                type="button"
                onClick={playWithSound}
                className="group absolute inset-0 flex flex-col items-center justify-center gap-4 text-white"
                aria-label="Play the intro with sound"
              >
                <span className="relative grid h-16 w-16 place-items-center rounded-full bg-white text-accent shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)] transition-[background-color,transform] duration-500 ease-arch group-hover:scale-105 group-hover:bg-accent-soft sm:h-20 sm:w-20">
                  <span className="play-ring" aria-hidden="true" />
                  <svg width="18" height="20" viewBox="0 0 10 12" aria-hidden="true" className="ml-1">
                    <path d="M0 0l10 6-10 6z" fill="currentColor" />
                  </svg>
                </span>
                <span className="glass-ink rounded-full px-3.5 py-1.5 text-[14px] font-medium tracking-[-0.01em]">
                  Play with sound
                </span>
              </button>
            )}
          </div>
        </motion.div>
        </div>

        <div className="mx-auto mt-5 flex max-w-[1120px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-1">
          <p className="t-caption lg:invisible">My 90-second intro</p>
          <a href={CONTACT.demoSite} target="_blank" rel="noreferrer" className="link-btn text-[14px] text-slate hover:text-ink">
            Explore the demo website <Arrow />
          </a>
        </div>

        <ServiceMarquee />
      </div>
    </section>
  );
}
