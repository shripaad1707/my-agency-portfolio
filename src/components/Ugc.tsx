import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { UGC, UGC_SAMPLES } from '../content';
import { EASE, asset } from '../lib/motion';
import { Arrow, Icon, MaskHeading, Pill, Reveal } from './ui';

type Sample = (typeof UGC_SAMPLES)[number];

/** One sample ad in a phone frame. Plays muted while on screen; tap for sound. */
function Phone({ sample, index }: { sample: Sample; index: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

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
      className="w-[min(72vw,280px)] shrink-0 snap-center lg:w-auto"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.3, ease: EASE, delay: index * 0.08 }}
    >
      <div className="relative aspect-[9/16] overflow-hidden rounded-[30px] border-[6px] border-night bg-night shadow-[0_30px_70px_-30px_rgba(14,17,33,0.55)]">
        <video
          ref={ref}
          data-ugc
          className="h-full w-full object-cover"
          src={asset(sample.src)}
          poster={asset(sample.poster)}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`Sample UGC ad for ${sample.product}`}
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 bottom-3 grid h-10 w-10 place-items-center rounded-full bg-night/70 text-white backdrop-blur-sm transition-colors duration-500 hover:bg-night"
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
    </motion.figure>
  );
}

export default function Ugc({ onContact }: { onContact: () => void }) {
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
            className="-mx-5 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:-mx-10 md:px-10 lg:mx-auto lg:grid lg:max-w-[1000px] lg:snap-none lg:overflow-visible lg:px-0 lg:pb-0"
            style={{ gridTemplateColumns: `repeat(${Math.min(UGC_SAMPLES.length, 3)}, minmax(0, 1fr))` }}
            data-lenis-prevent-wheel
          >
            {UGC_SAMPLES.map((s, i) => (
              <Phone key={s.id} sample={s} index={i} />
            ))}
          </div>
        )}
        {UGC_SAMPLES.length > 0 && (
          <p className="t-caption mt-6 text-center">Sample ads for concept brands, made with AI</p>
        )}

        <div className="mx-auto mt-16 grid max-w-[1080px] gap-5 lg:mt-20 lg:grid-cols-12">
          <Reveal className="card flex flex-col p-7 sm:p-9 lg:col-span-5">
            <p className="text-[14px] font-medium text-accent">Starter pack</p>
            <p className="mt-3 flex items-baseline gap-3">
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
            <button type="button" className="btn btn-solid mt-9 self-start" onClick={onContact}>
              Get your 5 ads <Arrow />
            </button>
          </Reveal>

          <div className="flex flex-col gap-5 lg:col-span-7">
            <ol className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
              {UGC.steps.map((step, i) => (
                <Reveal key={step.title} as="li" delay={0.05 * i} className="card flex gap-4 p-6">
                  <span className="tabular grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-[14px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-[16px] font-semibold tracking-[-0.015em]">{step.title}</span>
                    <span className="mt-1 block text-[14.5px] text-slate">{step.text}</span>
                  </span>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={0.15}>
              <p className="rounded-[18px] border border-line bg-white/80 px-5 py-4 text-[14px] text-slate">{UGC.note}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
