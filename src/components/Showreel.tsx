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

  // "Watch my showreel" in the hero starts it with sound.
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
          <div className="relative aspect-video overflow-hidden rounded-[29px] bg-night">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              poster={asset('img/showreel-poster.webp')}
              playsInline
              preload="metadata"
              aria-label="One-minute showreel of a website, 3D walkthrough and AI assistant made for a real estate brand"
            >
              <source src={asset('media/showreel.mp4')} type="video/mp4" />
              <source src={asset('media/showreel.webm')} type="video/webm" />
            </video>

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
                aria-label="Play the showreel with sound"
              >
                <span className="relative grid h-16 w-16 place-items-center rounded-full bg-white text-accent shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)] transition-colors duration-500 ease-arch group-hover:bg-accent-soft sm:h-20 sm:w-20">
                  <span className="play-ring" aria-hidden="true" />
                  <svg width="18" height="20" viewBox="0 0 10 12" aria-hidden="true" className="ml-1">
                    <path d="M0 0l10 6-10 6z" fill="currentColor" />
                  </svg>
                </span>
                <span className="text-[14px] font-medium tracking-[-0.01em] drop-shadow">Play with sound</span>
              </button>
            )}
          </div>
        </motion.div>

        <div className="mx-auto mt-5 flex max-w-[1120px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-1">
          <p className="t-caption">My 1-minute showreel</p>
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
