import { useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { DEMOS } from '../content';
import { EASE, useMediaQuery } from '../lib/motion';
import { DEMO_COMPONENTS, FluidDemo } from './demos';
import { Icon, MaskHeading, Pill, Reveal } from './ui';

type DemoId = (typeof DEMOS)[number]['id'];
const DEMO_ICONS: Record<DemoId, string> = { voice: 'phone', email: 'inbox', whatsapp: 'chat', followup: 'repeat' };

/** The stage where the selected example plays. */
function Stage({
  id,
  className = '',
  panelProps = {},
  fluid = false,
}: {
  id: DemoId;
  className?: string;
  panelProps?: object;
  fluid?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [replay, setReplay] = useState(0);
  const Demo = DEMO_COMPONENTS[id];

  return (
    <div>
      <div
        ref={ref}
        className={`panel relative overflow-hidden rounded-[28px] border border-accent/10 shadow-[0_30px_80px_-40px_rgba(79,70,229,0.45)] ${className}`}
        {...panelProps}
      >
        <FluidDemo.Provider value={fluid}>
          <AnimatePresence initial={false}>
            <motion.div
              key={id}
              className={fluid ? 'relative' : 'absolute inset-0'}
              initial={reduce ? false : { opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <Demo key={replay} play={inView} />
            </motion.div>
          </AnimatePresence>
        </FluidDemo.Provider>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 px-1">
        <p className="t-caption">Sample conversation, for illustration</p>
        {!reduce && (
          <button type="button" className="link-btn text-[14px]" onClick={() => setReplay((r) => r + 1)}>
            Play again
          </button>
        )}
      </div>
    </div>
  );
}

function Detail({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="detail"
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Title({ id, label, on }: { id: DemoId; label: string; on: boolean }) {
  return (
    <span className="flex items-center gap-4">
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors duration-500 ease-arch ${
          on ? 'bg-accent text-white' : 'bg-accent-soft text-accent'
        }`}
      >
        <Icon name={DEMO_ICONS[id]} />
      </span>
      <span className="t-h3">{label}</span>
    </span>
  );
}

/** Wide screens: the list on the left, the stage stays in view on the right. */
function DesktopExamples() {
  const [active, setActive] = useState(0);
  const current = DEMOS[active];

  return (
    <div className="mt-16 grid grid-cols-12 gap-10">
      <div className="col-span-5">
        <div role="tablist" aria-label="Examples" aria-orientation="vertical" className="space-y-3">
          {DEMOS.map((demo, i) => {
            const on = i === active;
            return (
              <div
                key={demo.id}
                className={`rounded-[22px] border transition-[background-color,border-color,box-shadow] duration-500 ease-arch ${
                  on ? 'card' : 'border-transparent'
                }`}
              >
                <button
                  type="button"
                  role="tab"
                  id={`tab-${demo.id}`}
                  aria-selected={on}
                  aria-controls="example-stage"
                  onClick={() => setActive(i)}
                  className={`w-full px-5 py-5 text-left transition-opacity duration-500 ease-arch ${
                    on ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                  }`}
                >
                  <Title id={demo.id} label={demo.title} on={on} />
                </button>
                <Detail open={on}>
                  <p className="max-w-[44ch] px-5 pb-6 pl-[76px] text-[15px] text-slate">{demo.blurb}</p>
                </Detail>
              </div>
            );
          })}
        </div>
      </div>
      <div className="col-span-7">
        <div className="sticky top-[104px]">
          <Stage
            id={current.id}
            className="h-[640px]"
            panelProps={{ id: 'example-stage', role: 'tabpanel', 'aria-labelledby': `tab-${current.id}` }}
          />
        </div>
      </div>
    </div>
  );
}

/** Phones and tablets: tap an example to open it and watch it play in place. */
function StackedExamples() {
  const [open, setOpen] = useState(0);

  return (
    <div className="mt-12 space-y-3">
      {DEMOS.map((demo, i) => {
        const on = i === open;
        return (
          <div key={demo.id} className={`rounded-[22px] ${on ? 'card' : 'border border-line bg-white'}`}>
            <button
              type="button"
              aria-expanded={on}
              aria-controls={`example-${demo.id}`}
              onClick={() => setOpen(on ? -1 : i)}
              className={`flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-opacity duration-500 ease-arch sm:px-5 ${
                on ? 'opacity-100' : 'opacity-70'
              }`}
            >
              <Title id={demo.id} label={demo.title} on={on} />
              <span className={`plus ${on ? 'is-open' : ''}`} aria-hidden="true" />
            </button>
            <Detail open={on}>
              <div id={`example-${demo.id}`} className="px-2 pb-3 sm:px-3">
                <p className="max-w-[46ch] px-2 pb-5 text-[15px] text-slate sm:px-2">{demo.blurb}</p>
                <Stage id={demo.id} fluid />
              </div>
            </Detail>
          </div>
        );
      })}
    </div>
  );
}

export default function Examples() {
  const desktop = useMediaQuery('(min-width: 1024px)');

  return (
    <section id="examples" className="py-20 lg:py-28">
      <div className="wrap">
        <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <Reveal>
            <Pill>See it working</Pill>
          </Reveal>
          <MaskHeading
            className="t-h2 mt-6"
            lines={['Assistants that answer', 'your customers for you.']}
            mobileLines={['Assistants that', 'answer your', 'customers for you.']}
          />
          <Reveal delay={0.15}>
            <p className="t-lead mt-5 max-w-[50ch]">
              These examples were built for a property business. The same setup answers product questions, order updates and returns for an online store.
            </p>
          </Reveal>
        </div>

        {desktop ? <DesktopExamples /> : <StackedExamples />}
      </div>
    </section>
  );
}
