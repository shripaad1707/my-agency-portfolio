import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { HERO, HERO_CARDS } from '../content';
import { EASE, asset, scrollToId } from '../lib/motion';
import { Arrow, Icon, MaskHeading } from './ui';

// Where each sample notification sits around the headline (wide screens only).
const CARD_SPOTS = [
  { className: 'left-10 -top-[68px]', rotate: -3 },
  { className: 'right-10 -top-[60px]', rotate: 2.5 },
  { className: 'left-12 top-[67%]', rotate: 2.5 },
  { className: 'right-12 top-[69%]', rotate: -2.5 },
];

function FloatCard({ index }: { index: number }) {
  const reduce = useReducedMotion();
  const card = HERO_CARDS[index];
  const spot = CARD_SPOTS[index];
  return (
    <motion.div
      className={`absolute w-[232px] ${spot.className}`}
      style={{ rotate: spot.rotate }}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay: 1.5 + index * 0.1 }}
    >
      <motion.div
        className="float-card flex items-center gap-3 px-3.5 py-3"
        animate={reduce ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 6 + index * 0.7, ease: 'easeInOut', repeat: Infinity, delay: index * 0.4 }}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent">
          <Icon name={card.icon} size={18} />
        </span>
        <span className="min-w-0 text-left">
          <span className="block text-[14px] font-semibold leading-tight tracking-[-0.01em]">{card.title}</span>
          <span className="block text-[12.5px] leading-snug text-slate">{card.text}</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function Hero({ onContact }: { onContact: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const glowY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  // Full 0 to 1 ranges, so the copy stays faded out once the hero has scrolled away.
  const copyY = useTransform(scrollYProgress, [0, 0.8, 1], ['0%', '-18%', '-18%']);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.2, 0.75, 1], [1, 1, 0, 0]);

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE, delay },
        };

  const watch = () => {
    window.dispatchEvent(new Event('showreel:play'));
    scrollToId('showreel');
  };

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-[128px] pb-14 sm:pt-[168px] lg:pb-20">
      {/* Soft glow and grid: settles on load, then drifts slower than the page */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-[4%] -bottom-[10%]"
        style={reduce ? undefined : { y: glowY }}
      >
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.6, ease: EASE }}
        >
          <div className="hero-glow absolute inset-0" />
          <div className="hero-grid absolute inset-0" />
        </motion.div>
      </motion.div>

      <motion.div className="wrap relative" style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}>
        <div className="relative mx-auto flex max-w-[1080px] flex-col items-center text-center">
          <motion.p className="pill h-auto min-h-9 gap-2.5 py-1.5 pr-4 pl-1.5 text-[12.5px] sm:text-[13px]" {...fade(0.35)}>
            <img src={asset('img/shripaad.webp')} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
            {HERO.badge}
          </motion.p>

          <MaskHeading
            as="h1"
            immediate
            delay={0.45}
            className="t-hero mt-7"
            lines={['Helping your brand', [{ g: 'get seen and sell more.' }]]}
            mobileLines={['Helping your', ['brand ', { g: 'get seen' }], [{ g: 'and sell more.' }]]}
          />

          <motion.p className="t-lead mt-7 max-w-[50ch]" {...fade(0.95)}>
            {HERO.lead}
          </motion.p>

          <motion.div className="mt-9 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center" {...fade(1.1)}>
            <button type="button" className="btn btn-solid" onClick={() => scrollToId('ugc')}>
              See sample ads <Arrow />
            </button>
            <button type="button" className="btn btn-outline" onClick={watch}>
              <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true" className="text-accent">
                <path d="M0 0l10 6-10 6z" fill="currentColor" />
              </svg>
              Watch my intro
            </button>
          </motion.div>
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
          {HERO_CARDS.map((card, i) => (
            <FloatCard key={card.title} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
