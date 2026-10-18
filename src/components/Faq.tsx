import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CONTACT, FAQS } from '../content';
import { EASE } from '../lib/motion';
import { Arrow, MaskHeading, Pill, Reveal } from './ui';

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="glow-bg glow-flip py-20 lg:py-28">
      <div className="wrap">
        <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <Reveal>
            <Pill>FAQ</Pill>
          </Reveal>
          <MaskHeading className="t-h2 mt-6" lines={['Questions people', 'ask first.']} mobileLines={['Questions', 'people ask first.']} />
        </div>

        <div className="mx-auto mt-12 max-w-[860px] space-y-3 lg:mt-14">
          {FAQS.map((item, i) => {
            const on = open === i;
            return (
              <div
                key={item.q}
                className={`rounded-[20px] border bg-white transition-[border-color,box-shadow] duration-500 ease-arch ${
                  on
                    ? 'border-accent/20 shadow-[0_28px_60px_-30px_rgba(79,70,229,0.35)]'
                    : 'border-line shadow-[0_10px_30px_-24px_rgba(79,70,229,0.3)]'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={on}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(on ? -1 : i)}
                    className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left sm:px-6"
                  >
                    <span className="text-[17px] font-semibold tracking-[-0.02em]">{item.q}</span>
                    <span className={`plus ${on ? 'is-open' : ''}`} aria-hidden="true" />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      key="answer"
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      className="overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                    >
                      <p className="max-w-[62ch] px-5 pb-6 text-[15px] text-slate sm:px-6">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[15px] text-slate">
          <span>Have a different question?</span>
          <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="link-btn text-ink">
            Ask me on WhatsApp <Arrow />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
