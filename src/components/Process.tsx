import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { STEPS } from '../content';
import { EASE } from '../lib/motion';
import { MaskHeading, Pill, Reveal } from './ui';

export default function Process() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);

  // A line runs through the four steps and fills in as the section scrolls past; each step lights up when it is reached.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.85', 'end 0.6'] });
  const [reached, setReached] = useState(reduce ? STEPS.length : 0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!reduce) setReached(Math.min(STEPS.length, Math.floor(v * STEPS.length + 0.25)));
  });

  return (
    <section id="process" className="glow-bg py-20 lg:py-28">
      <div className="wrap">
        <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <Pill>How it works</Pill>
            </Reveal>
            <MaskHeading className="t-h2 mt-6" lines={['From first message', 'to launch.']} />
          </div>
          <Reveal delay={0.15} className="lg:col-span-5">
            <p className="t-lead max-w-[44ch]">Clear steps, one fixed price, and you always know what happens next.</p>
          </Reveal>
        </div>

        <ol ref={listRef} className="relative mt-14 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5">
          {/* The track and its fill, wide screens only */}
          <span aria-hidden="true" className="absolute top-5 right-0 left-7 hidden h-px bg-line lg:block" />
          <motion.span
            aria-hidden="true"
            className="absolute top-5 right-0 left-7 hidden h-px origin-left bg-gradient-to-r from-accent via-accent-2 to-sky lg:block"
            style={{ scaleX: reduce ? 1 : scrollYProgress }}
          />

          {STEPS.map((step, i) => {
            const on = i < reached;
            return (
              <motion.li
                key={step.title}
                className="relative flex flex-col"
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.9, ease: EASE, delay: i * 0.06 }}
              >
                <div className="flex items-center justify-between gap-4 lg:pl-2">
                  <span
                    className={`tabular relative z-10 grid h-10 w-10 place-items-center rounded-full border text-[15px] font-semibold transition-[background-color,border-color,color,box-shadow] duration-700 ease-arch ${
                      on
                        ? 'border-transparent bg-gradient-to-br from-accent to-accent-2 text-white shadow-[0_10px_26px_-8px_rgba(79,70,229,0.75)]'
                        : 'border-line bg-white text-slate'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="relative z-10 rounded-full border border-line bg-white px-3 py-1 text-[12.5px] font-medium text-accent">
                    {step.time}
                  </span>
                </div>
                <div className="row card spot relative mt-5 flex flex-1 flex-col p-6 sm:p-7">
                  <span className="row-line" aria-hidden="true" />
                  <h3 className="row-title t-h3">{step.title}</h3>
                  <p className="mt-2 text-[15px] text-slate">{step.text}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
