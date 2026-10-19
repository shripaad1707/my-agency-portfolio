import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CHIPS, CONTACT } from '../content';
import { EASE, asset } from '../lib/motion';
import { Arrow, Icon } from './ui';

export default function Showreel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [withSound, setWithSound] = useState(false);

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
      <div className="wrap">
        <motion.div
          className="mx-auto max-w-[1120px] rounded-[30px] bg-gradient-to-b from-accent/35 via-line to-accent-2/25 p-px shadow-[0_50px_120px_-50px_rgba(79,70,229,0.55)]"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
        >
          {/* Full-width frame; the vertical video sits in the middle at full height, the sides show a soft blur of it */}
          <div className="relative aspect-[9/16] overflow-hidden rounded-[29px] bg-night sm:aspect-[4/5] lg:aspect-[16/10]">
            <div
              aria-hidden="true"
              className="absolute inset-0 hidden scale-125 bg-cover bg-center opacity-55 blur-3xl sm:block"
              style={{ backgroundImage: `url(${asset('img/intro-poster.webp')})` }}
            />
            <div aria-hidden="true" className="absolute inset-0 hidden bg-night/45 sm:block" />

            <div className="relative mx-auto h-full aspect-[9/16] max-w-full sm:shadow-[0_30px_90px_-20px_rgba(0,0,0,0.7)]">
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
                <span className="relative grid h-16 w-16 place-items-center rounded-full bg-white text-accent shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)] transition-colors duration-500 ease-arch group-hover:bg-accent-soft sm:h-20 sm:w-20">
                  <span className="play-ring" aria-hidden="true" />
                  <svg width="18" height="20" viewBox="0 0 10 12" aria-hidden="true" className="ml-1">
                    <path d="M0 0l10 6-10 6z" fill="currentColor" />
                  </svg>
                </span>
                <span className="rounded-full bg-night/70 px-3.5 py-1.5 text-[14px] font-medium tracking-[-0.01em] backdrop-blur-sm">
                  Play with sound
                </span>
              </button>
            )}
          </div>
        </motion.div>

        <div className="mx-auto mt-5 flex max-w-[1120px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-1">
          <p className="t-caption">My 90-second intro</p>
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
