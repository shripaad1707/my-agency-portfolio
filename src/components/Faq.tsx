import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CONTACT, FAQS } from '../content';
import { EASE } from '../lib/motion';
import { Arrow, MaskHeading, Pill, Reveal } from './ui';

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="glow-bg glow-flip py-20 lg:py-28">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[128px]">
            <Reveal>
              <Pill>FAQ</Pill>
            </Reveal>
            <MaskHeading className="t-h2 mt-6" lines={['Questions people', 'ask first.']} mobileLines={['Questions', 'people ask first.']} />
            <Reveal delay={0.15}>
              <p className="t-lead mt-5 max-w-[40ch]">
                Something else on your mind? Send me a message and I'll reply within one working day.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn btn-outline mt-8">
                Ask me on WhatsApp <Arrow />
              </a>
            </Reveal>
          </div>
        </div>

        <Reveal className="lg:col-span-7">
          <div className="card divide-y divide-line overflow-hidden">
            {FAQS.map((item, i) => {
              const on = open === i;
              return (
                <div key={item.q} className={`transition-colors duration-500 ease-arch ${on ? 'bg-accent-soft/40' : 'bg-white'}`}>
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${i}`}
                      aria-expanded={on}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(on ? -1 : i)}
                      className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left sm:px-7 sm:py-6"
                    >
                      <span className="text-[16.5px] font-semibold tracking-[-0.02em] sm:text-[17px]">{item.q}</span>
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color] duration-500 ease-arch ${
                          on ? 'border-accent bg-accent text-white' : 'border-line bg-white text-ink'
                        }`}
                      >
                        <span className={`plus ${on ? 'is-open' : ''}`} aria-hidden="true" />
                      </span>
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
                        <p className="max-w-[60ch] px-5 pb-6 text-[15px] text-slate sm:px-7">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
