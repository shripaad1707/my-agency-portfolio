import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { GROWTH } from '../content';
import { EASE } from '../lib/motion';
import { Icon, MaskHeading, Pill, Reveal } from './ui';

/* ------------------------------------------------------------------ */
/* Each card has a small picture of the work that plays once when it  */
/* scrolls into view. Under reduced motion it shows the end state.     */
/* ------------------------------------------------------------------ */
function useSteps(times: number[], start: boolean) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? times.length : 0);
  useEffect(() => {
    if (reduce) {
      setStep(times.length);
      return;
    }
    if (!start) return;
    const timers = times.map((t, i) => window.setTimeout(() => setStep(i + 1), t));
    return () => timers.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, reduce]);
  return step;
}

function Show({ on, children, className = '', y = 10 }: { on: boolean; children: ReactNode; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={on ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const Bar = ({ className = '' }: { className?: string }) => <span className={`block h-2 rounded-full ${className}`} />;

/* Get seen: a reel, an ad and a 3D walkthrough over an edit timeline */
function SeenVisual({ start }: { start: boolean }) {
  const reduce = useReducedMotion();
  const step = useSteps([200, 450, 700], start);
  return (
    <div className="absolute inset-0 flex flex-col gap-3 p-4 sm:p-5">
      <div className="flex min-h-0 flex-1 gap-3">
        <Show on={step >= 1} className="relative w-[36%] overflow-hidden rounded-xl bg-gradient-to-br from-[#1e1b4b] via-accent to-accent-2">
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-accent">
              <svg width="12" height="14" viewBox="0 0 10 12" aria-hidden="true" className="ml-0.5">
                <path d="M0 0l10 6-10 6z" fill="currentColor" />
              </svg>
            </span>
          </span>
          <span className="absolute inset-x-3 bottom-3 space-y-1.5">
            <Bar className="w-[80%] bg-white/85" />
            <Bar className="w-[55%] bg-white/50" />
          </span>
          <span className="absolute top-3 left-3 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
            Reel, 0:30
          </span>
        </Show>
        <div className="grid min-w-0 flex-1 grid-rows-2 gap-3">
          <Show on={step >= 2} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
            <span className="h-full max-h-16 w-11 shrink-0 rounded-lg bg-gradient-to-br from-sky-200 via-accent-soft to-violet-200 sm:w-16" />
            <span className="min-w-0 flex-1 space-y-2">
              <span className="block text-[12px] font-medium text-ink">Ad design</span>
              <Bar className="w-[85%] bg-line" />
              <Bar className="w-[60%] bg-line" />
            </span>
          </Show>
          <Show on={step >= 3} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
            <span className="grid h-full max-h-16 w-11 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent sm:w-16">
              <Icon name="cube" size={22} />
            </span>
            <span className="min-w-0 flex-1 space-y-2">
              <span className="block text-[12px] font-medium text-ink">3D walkthrough</span>
              <span className="relative block h-2 overflow-hidden rounded-full bg-line">
                <motion.span
                  className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-accent to-accent-2"
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={step >= 3 ? { scaleX: 0.72 } : undefined}
                  transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
                />
              </span>
            </span>
          </Show>
        </div>
      </div>

      {/* Edit timeline with a playhead sweeping across */}
      <div className="relative overflow-hidden rounded-xl border border-line bg-white px-3 py-3">
        <div className="space-y-1.5">
          <div className="flex gap-1">
            {[22, 30, 18, 26].map((w, i) => (
              <span key={i} className="h-4 rounded-[5px] border border-accent/25 bg-accent-soft" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="flex gap-1 pl-[8%]">
            {[24, 16, 20].map((w, i) => (
              <span key={i} className="h-3 rounded-[4px] bg-accent-2/25" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="flex h-4 items-center gap-[3px]">
            {Array.from({ length: 72 }, (_, i) => (
              <span key={i} className="min-w-px flex-1 rounded-full bg-slate/30" style={{ height: `${25 + ((i * 37) % 70)}%` }} />
            ))}
          </div>
        </div>
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-3 right-3"
          initial={false}
          animate={reduce ? undefined : { x: ['0%', '100%'] }}
          transition={{ duration: 7, ease: 'linear', repeat: Infinity }}
        >
          <span className="absolute inset-y-1 left-0 w-[2px] rounded-full bg-accent" />
        </motion.span>
      </div>
    </div>
  );
}

/* Turn visitors into enquiries: a clean site with an enquiry arriving */
function WebVisual({ start }: { start: boolean }) {
  const step = useSteps([300, 1200], start);
  return (
    <div className="absolute inset-0 p-4 sm:p-5">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-[0_12px_30px_-20px_rgba(14,17,33,0.3)]">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="ml-3 rounded-full bg-fog px-3 py-0.5 text-[11px] text-slate">yourcompany.com</span>
        </div>
        <Show on={step >= 1} className="flex flex-1 flex-col gap-3 p-4">
          <Bar className="h-3 w-[70%] bg-ink/85" />
          <Bar className="h-3 w-[48%] bg-ink/85" />
          <Bar className="w-[62%] bg-line" />
          <span className="mt-1 flex gap-2">
            <span className="rounded-full bg-accent px-3 py-1.5 text-[11px] font-medium text-white">Book a viewing</span>
            <span className="rounded-full border border-line px-3 py-1.5 text-[11px] font-medium text-ink">See homes</span>
          </span>
          <span className="mt-auto grid grid-cols-3 gap-2">
            {['from-sky-200 to-accent-soft', 'from-violet-200 to-accent-soft', 'from-indigo-200 to-sky-100'].map((g) => (
              <span key={g} className="space-y-1.5">
                <span className={`block aspect-[4/3] rounded-lg bg-gradient-to-br ${g}`} />
                <Bar className="w-[80%] bg-line" />
              </span>
            ))}
          </span>
        </Show>
      </div>
      <Show on={step >= 2} y={-10} className="absolute top-12 right-6 flex w-[230px] items-center gap-3 rounded-xl border border-line bg-white px-3 py-2.5 shadow-[0_16px_36px_-16px_rgba(30,27,75,0.35)] sm:right-8">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-white">
          <Icon name="check" size={16} />
        </span>
        <span className="min-w-0">
          <span className="block text-[12.5px] font-semibold leading-tight">New enquiry</span>
          <span className="block truncate text-[11.5px] text-slate">Sarah wants a viewing</span>
        </span>
      </Show>
    </div>
  );
}

/* Reply in seconds: a chat where the assistant answers and books */
function ReplyVisual({ start }: { start: boolean }) {
  const step = useSteps([300, 1100, 1900, 2700], start);
  return (
    <div className="absolute inset-0 flex flex-col justify-end gap-2.5 p-4 sm:p-5">
      <Show on={step >= 1} className="max-w-[80%] self-start rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-[13px] leading-snug shadow-sm">
        Hi, is the 2-bed in the Marina still available?
      </Show>
      <Show on={step >= 2} className="max-w-[82%] self-end rounded-2xl rounded-tr-md bg-accent px-3.5 py-2.5 text-[13px] leading-snug text-white">
        Yes, it is. Would Saturday at 11:00 work for a viewing?
      </Show>
      <Show on={step >= 3} className="max-w-[80%] self-start rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-[13px] leading-snug shadow-sm">
        Perfect, see you then.
      </Show>
      <Show on={step >= 4} className="mt-1 flex items-center gap-2 self-center rounded-full border border-line bg-white px-3 py-1.5 text-[12px] font-medium text-accent">
        <Icon name="calendar" size={15} />
        Viewing booked, Saturday 11:00
      </Show>
    </div>
  );
}

/* Follow-ups that run themselves: the steps tick off on their own */
const FOLLOW_ROWS = ['Added to your CRM', 'Agent notified on WhatsApp', 'Follow-up email set for Wednesday', 'Reminder sent before the viewing'];

function FollowVisual({ start }: { start: boolean }) {
  const reduce = useReducedMotion();
  const step = useSteps([300, 900, 1500, 2100, 2700], start);
  return (
    <div className="absolute inset-0 p-4 sm:p-5">
      <div className="flex h-full flex-col rounded-xl border border-line bg-white p-4">
        <Show on={step >= 1} className="flex items-center gap-3 border-b border-line pb-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-soft text-[12px] font-semibold text-accent">JC</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold leading-tight">New lead: James Carter</span>
            <span className="block text-[11.5px] text-slate">From your website, just now</span>
          </span>
        </Show>
        <ul className="mt-3 flex flex-1 flex-col justify-around">
          {FOLLOW_ROWS.map((row, i) => {
            const done = step >= i + 2;
            return (
              <li key={row} className="flex items-center gap-3">
                <span className="relative grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line">
                  <motion.span
                    className="absolute inset-[-1px] grid place-items-center rounded-full bg-accent text-white"
                    initial={reduce ? false : { scale: 0, opacity: 0 }}
                    animate={done ? { scale: 1, opacity: 1 } : undefined}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <Icon name="check" size={13} />
                  </motion.span>
                </span>
                <span className={`text-[13px] transition-colors duration-500 ${done ? 'text-ink' : 'text-slate/60'}`}>{row}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* 3D renders: the real NOVA render, with a soft studio caption */
function RenderVisual({ start }: { start: boolean }) {
  const step = useSteps([200, 600], start);
  return (
    <div className="absolute inset-0 grid grid-cols-2 gap-3 p-4 sm:p-5">
      <Show on={step >= 1} className="relative overflow-hidden rounded-xl bg-[#e9e7f1]">
        <img src={`${import.meta.env.BASE_URL}img/renders/solenne.webp`} alt="" className="h-full w-full object-cover" />
      </Show>
      <Show on={step >= 2} className="relative overflow-hidden rounded-xl bg-[#e9e7f1]">
        <img src={`${import.meta.env.BASE_URL}img/renders/fuego.webp`} alt="" className="h-full w-full object-cover" />
        <span className="absolute inset-x-3 bottom-3 rounded-lg bg-white/90 px-3 py-2 text-[12px] font-medium backdrop-blur">Rendered in 3D</span>
      </Show>
    </div>
  );
}

const VISUALS = { ugc: SeenVisual, web: WebVisual, render: RenderVisual, reply: ReplyVisual };
const SPANS = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7'];

function GrowthCard({ index }: { index: number }) {
  const item = GROWTH[index];
  const Visual = VISUALS[item.id];
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.45 });

  return (
    <Reveal className={SPANS[index]} delay={(index % 2) * 0.1}>
      <article className="card spot zoom flex h-full flex-col overflow-hidden p-2">
        <div ref={ref} className="panel relative h-[250px] overflow-hidden rounded-[18px] sm:h-[270px]">
          <div className="zoom-img absolute inset-0">
            <Visual start={seen} />
          </div>
        </div>
        <div className="flex flex-1 flex-col px-5 pt-6 pb-5 sm:px-6">
          <h3 className="t-h3">{item.title}</h3>
          <p className="mt-2 max-w-[48ch] text-[15px] text-slate">{item.text}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-accent-soft px-3 py-1 text-[12.5px] font-medium text-accent">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  );
}

export default function Growth() {
  return (
    <section id="services" className="glow-bg py-20 lg:py-28">
      <div className="wrap">
        <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <Pill>What I do</Pill>
            </Reveal>
            <MaskHeading className="t-h2 mt-6" lines={['Four ways I help', 'your brand grow.']} />
          </div>
          <Reveal delay={0.15} className="lg:col-span-5">
            <p className="t-lead max-w-[46ch]">
              Pick one, or let me handle all four. Everything is set up around your brand, your offer and the tools you
              already use.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-12">
          {GROWTH.map((item, i) => (
            <GrowthCard key={item.id} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
