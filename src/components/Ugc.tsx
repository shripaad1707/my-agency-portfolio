import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { UGC, UGC_SAMPLES } from '../content';
import { EASE, asset, useMediaQuery, usePauseOffscreen, useSmartVideo } from '../lib/motion';
import { Arrow, Icon, MaskHeading, Pill, Reveal } from './ui';

// On wide screens the phones sit in a gentle, fixed wave (no scroll-linked motion over the videos).
const WAVE = [36, 0, 52, 12];

type Sample = (typeof UGC_SAMPLES)[number];

/** One sample ad in a phone frame. Plays muted while on screen; tap for sound. */
function Phone({ sample, index, wave }: { sample: Sample; index: number; wave: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [sound, setSound] = useState(false);
  useSmartVideo(ref, 0.4, 120 + index * 220);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    const next = !sound;
    v.muted = !next;
    if (next) {
      document.querySelectorAll<HTMLVideoElement>('[data-ugc]').forEach((o) => {
        if (o !== v) o.muted = true;
      });
      v.play().catch(() => {});
    }
    setSound(next);
  };

  return (
    <motion.figure
      className="w-[min(62vw,260px)] shrink-0 snap-center lg:w-auto"
      initial={reduce ? false : { opacity: 0, transform: 'translateY(24px)' }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.3, ease: EASE, delay: index * 0.08 }}
    >
      <div style={wave ? { marginTop: WAVE[index % WAVE.length] } : undefined} className="group">
      <div className="relative aspect-[9/16] overflow-hidden rounded-[30px] border-[6px] border-night bg-night shadow-[0_30px_70px_-30px_rgba(14,17,33,0.55)] transition-[transform,box-shadow] duration-700 ease-arch group-hover:-translate-y-1.5 group-hover:shadow-[0_44px_80px_-30px_rgba(79,70,229,0.55)]">
        <span aria-hidden="true" className="pointer-events-none absolute top-3 left-3 z-10 flex items-center gap-1.5 glass-ink rounded-full px-2 py-1 text-[10.5px] font-semibold tracking-[0.02em] text-white">
          <span className="live-dot h-1.5 w-1.5" style={{ ['--dot' as string]: '#ff5a5f' }} />
          Ad {index + 1}
        </span>
        <video
          ref={ref}
          data-ugc
          className="h-full w-full object-cover"
          src={asset(sample.src)}
          poster={asset(sample.poster)}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          aria-label={`Sample UGC ad for ${sample.product}`}
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 bottom-3 grid h-10 w-10 place-items-center glass-ink rounded-full text-white transition-colors duration-500 hover:bg-night"
          aria-label={sound ? 'Mute' : 'Play with sound'}
          aria-pressed={sound}
        >
          {sound ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z" strokeLinejoin="round" />
              <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z" strokeLinejoin="round" />
              <path d="m16 10 4 4m0-4-4 4" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>
      <figcaption className="mt-4 px-1">
        <span className="block text-[15px] font-semibold tracking-[-0.01em]">{sample.product}</span>
        <span className="block text-[13.5px] text-slate">{sample.angle}</span>
      </figcaption>
      </div>
    </motion.figure>
  );
}

/** The three steps, joined by a line that fills in as you scroll past. */
function Steps() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.55'] });
  const [reached, setReached] = useState(reduce ? UGC.steps.length : 0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!reduce) setReached(Math.min(UGC.steps.length, Math.floor(v * UGC.steps.length + 0.35)));
  });

  return (
    <Reveal className="card spot p-6 sm:p-8">
      <ol ref={ref} className="relative space-y-7">
        <span aria-hidden="true" className="absolute top-5 bottom-5 left-[19px] w-px bg-line" />
        <motion.span
          aria-hidden="true"
          className="absolute top-5 bottom-5 left-[19px] w-px origin-top bg-gradient-to-b from-accent via-accent-2 to-sky"
          style={{ scaleY: reduce ? 1 : scrollYProgress }}
        />
        {UGC.steps.map((step, i) => {
          const on = i < reached;
          return (
            <li key={step.title} className="relative flex gap-5">
              <span
                className={`tabular relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border text-[14px] font-semibold transition-[background-color,border-color,color,box-shadow] duration-700 ease-arch ${
                  on
                    ? 'border-transparent bg-accent text-white shadow-[0_8px_22px_-8px_rgba(79,70,229,0.8)]'
                    : 'border-line bg-white text-slate'
                }`}
              >
                {i + 1}
              </span>
              <span className="pt-1.5">
                <span className="block text-[16px] font-semibold tracking-[-0.015em]">{step.title}</span>
                <span className="mt-1 block text-[14.5px] text-slate">{step.text}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </Reveal>
  );
}

export default function Ugc({ onContact }: { onContact: () => void }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const offerRef = useRef<HTMLDivElement>(null);
  const wide = useMediaQuery('(min-width: 1024px)');
  usePauseOffscreen(offerRef);

  return (
    <section id="ugc" className="glow-bg py-20 lg:py-28">
      <div className="wrap">
        <div className="mx-auto flex max-w-[780px] flex-col items-center text-center">
          <Reveal>
            <Pill>UGC video ads</Pill>
          </Reveal>
          <MaskHeading
            className="t-h2 mt-6"
            lines={['Fresh ads to test,', 'every week.']}
          />
          <Reveal delay={0.15}>
            <p className="t-lead mt-5 max-w-[54ch]">
              Short, vertical ads where a presenter shows your product and talks to camera. Test new hooks quickly,
              without hiring creators or shipping samples. Tap a video for sound.
            </p>
          </Reveal>
        </div>

        {UGC_SAMPLES.length > 0 && (
          <div
            ref={gridRef}
            className="-mx-5 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:-mx-10 md:px-10 lg:mx-auto lg:grid lg:max-w-[1080px] lg:snap-none lg:items-start lg:overflow-visible lg:px-0 lg:pb-0"
            style={{ gridTemplateColumns: `repeat(${Math.min(UGC_SAMPLES.length, 4)}, minmax(0, 1fr))` }}
            data-lenis-prevent-wheel
          >
            {UGC_SAMPLES.map((s, i) => (
              <Phone key={s.id} sample={s} index={i} wave={wide} />
            ))}
          </div>
        )}
        {UGC_SAMPLES.length > 0 && (
          <p className="t-caption mt-6 text-center">Sample ads I made with AI for real products, to show the style. These brands are not clients.</p>
        )}

        <div className="mx-auto mt-16 grid max-w-[1080px] gap-5 lg:mt-20 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div ref={offerRef} className="beam-border h-full">
            <div className="beam-inner flex h-full flex-col p-7 sm:p-9">
            <p className="flex items-center justify-between gap-3">
              <span className="text-[14px] font-medium text-accent">Starter pack</span>
              <span className="rounded-full bg-accent-soft px-3 py-1 text-[12px] font-medium text-accent">Delivered in 3 days</span>
            </p>
            <p className="mt-4 flex items-baseline gap-3">
              <span className="tabular text-[56px] leading-none font-semibold tracking-[-0.04em]">{UGC.price}</span>
              <span className="text-[17px] text-slate">for {UGC.pack}</span>
            </p>
            <ul className="mt-7 space-y-3">
              {UGC.includes.map((item) => (
                <li key={item} className="flex gap-3 text-[15px]">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                    <Icon name="check" size={13} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <button type="button" className="btn btn-solid btn-glow mt-9 self-start" onClick={onContact}>
              Get your 5 ads <Arrow />
            </button>
            </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-5 lg:col-span-7">
            <Steps />
            <Reveal delay={0.15}>
              <p className="rounded-[18px] border border-line bg-white/80 px-5 py-4 text-[14px] text-slate">{UGC.note}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
