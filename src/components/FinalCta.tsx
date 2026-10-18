import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { CONTACT } from '../content';
import { EASE } from '../lib/motion';
import { MaskHeading } from './ui';

export default function FinalCta({ onContact }: { onContact: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1, 1]);

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.25 },
          transition: { duration: 0.9, ease: EASE, delay },
        };

  return (
    <section id="contact" className="pb-20 lg:pb-28">
      <div className="wrap">
        <div
          ref={ref}
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#312e81] via-accent to-accent-2 px-6 py-20 text-center text-white sm:px-12 lg:py-28"
        >
          {/* Soft light that drifts as the card passes through the screen */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-[12%]"
            style={reduce ? undefined : { y, scale }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(40%_50%_at_20%_15%,rgba(125,211,252,0.35),transparent_70%),radial-gradient(45%_55%_at_85%_90%,rgba(255,255,255,0.22),transparent_70%)]" />
          </motion.div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_20%,transparent_80%)]"
          />

          <div className="relative mx-auto flex max-w-[760px] flex-col items-center">
            <motion.p
              className="inline-flex h-8 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 text-[13px] font-medium backdrop-blur"
              {...fade(0)}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
              Let's talk
            </motion.p>
            <MaskHeading
              className="t-h2 mt-6"
              lines={["Let's find your", 'quickest win.']}
            />
            <motion.p className="mt-6 max-w-[50ch] text-[clamp(1rem,0.35vw+0.94rem,1.15rem)] leading-[1.7] text-white/80" {...fade(0.25)}>
              Tell me about your business and where you want more clients. I'll reply within one working day with
              ideas and a fixed price for the work.
            </motion.p>
            <motion.div className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row" {...fade(0.35)}>
              <button type="button" className="btn btn-light" onClick={onContact}>
                Contact me
              </button>
              <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn btn-ghost-light">
                Message me on WhatsApp
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
