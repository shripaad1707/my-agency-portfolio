import { motion, useReducedMotion } from 'motion/react';
import { STEPS } from '../content';
import { EASE } from '../lib/motion';
import { MaskHeading, Pill, Reveal } from './ui';

export default function Process() {
  const reduce = useReducedMotion();

  return (
    <section id="process" className="glow-bg py-20 lg:py-28">
      <div className="wrap">
        <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <Reveal>
            <Pill>How it works</Pill>
          </Reveal>
          <MaskHeading className="t-h2 mt-6" lines={['From first message', 'to launch.']} />
          <Reveal delay={0.15}>
            <p className="t-lead mt-5 max-w-[48ch]">
              Clear steps, one fixed price, and you always know what happens next.
            </p>
          </Reveal>
        </div>

        <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              className="row card relative flex flex-col p-6 sm:p-7"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.05 }}
            >
              <span className="row-line" aria-hidden="true" />
              <div className="flex items-center justify-between gap-4">
                <span className="tabular grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-[15px] font-semibold text-white">
                  {i + 1}
                </span>
                <span className="rounded-full bg-accent-soft px-3 py-1 text-[12.5px] font-medium text-accent">{step.time}</span>
              </div>
              <h3 className="row-title t-h3 mt-8">{step.title}</h3>
              <p className="mt-2 text-[15px] text-slate">{step.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
