import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { CONTACT, REASONS } from '../content';
import { EASE, asset } from '../lib/motion';
import { IconTile, Pill, Reveal, ScrubWords } from './ui';

/** The full profile photo, unveiled by a curtain as it scrolls in, with the name under it. */
function Portrait() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const seen = useInView(ref, { once: true, amount: 0.2 });

  return (
    <figure className="mx-auto w-full max-w-[420px]">
      <div ref={ref} className="relative aspect-square overflow-hidden rounded-[28px] bg-night shadow-[0_40px_90px_-40px_rgba(79,70,229,0.55)]">
        <motion.img
          src={asset('img/shripaad.webp')}
          alt={`Photo of ${CONTACT.name}`}
          loading="lazy"
          className="h-full w-full object-cover"
          initial={reduce ? false : { scale: 1.14 }}
          animate={seen ? { scale: 1 } : undefined}
          transition={{ duration: 1.9, ease: EASE }}
        />
        {!reduce && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 origin-top bg-white"
            initial={{ scaleY: 1 }}
            animate={seen ? { scaleY: 0 } : undefined}
            transition={{ duration: 1.25, ease: EASE }}
          />
        )}
      </div>
      <figcaption className="mt-5 text-center text-[18px] font-semibold tracking-[-0.02em]">{CONTACT.name}</figcaption>
    </figure>
  );
}

export default function WhyMe() {
  return (
    <section id="why" className="glow-bg glow-flip py-20 lg:py-28">
      <div className="wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <Portrait />
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <Pill>Why work with me</Pill>
          </Reveal>
          <ScrubWords
            className="mt-6 text-[clamp(1.55rem,2.5vw,2.25rem)] leading-[1.25] font-medium tracking-[-0.03em]"
            text="One person handles your website, your automations and your videos, so nothing gets lost between teams and you always know who to call."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {REASONS.map((reason, i) => (
              <Reveal key={reason.title} delay={0.05 * i} className="card rounded-[20px] p-5">
                <IconTile name={reason.icon} />
                <h3 className="mt-4 text-[16px] font-semibold tracking-[-0.015em]">{reason.title}</h3>
                <p className="mt-1.5 text-[14.5px] text-slate">{reason.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-6 grid gap-3 text-[14.5px] sm:grid-cols-2" delay={0.1}>
            <p className="rounded-[16px] bg-accent-soft px-4 py-3 text-ink/85">
              <span className="font-semibold text-ink">A good fit:</span> real estate teams, brokers, developers and
              small to medium agencies.
            </p>
            <p className="rounded-[16px] border border-line bg-white/80 px-4 py-3 text-slate">
              <span className="font-semibold text-ink">Not a good fit:</span> large enterprise systems or mobile apps.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
