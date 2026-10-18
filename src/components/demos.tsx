import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { EASE } from '../lib/motion';

/* ------------------------------------------------------------------ */
/* Shared timing: steps light up at the given times (ms), hold, loop.  */
/* Under reduced motion every demo shows its finished state at once.   */
/* ------------------------------------------------------------------ */
function useSequence(times: number[], play: boolean, hold = 4500) {
  const reduce = useReducedMotion();
  const total = times.length;
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(reduce ? total : 0);

  useEffect(() => {
    if (reduce) {
      setStep(total);
      return;
    }
    if (!play) return;
    setStep(0);
    const timers = times.map((t, i) => window.setTimeout(() => setStep(i + 1), t));
    timers.push(window.setTimeout(() => setRun((r) => r + 1), times[total - 1] + hold));
    return () => timers.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play, run, reduce]);

  return { step, run };
}

/**
 * On phones the stage grows with its content instead of having a fixed height,
 * so every line of a demo stays readable on narrow screens.
 */
export const FluidDemo = createContext(false);

/** Fades the whole demo out before each replay. */
function Loop({ run, children }: { run: number; children: ReactNode }) {
  const fluid = useContext(FluidDemo);
  const reduce = useReducedMotion();
  if (fluid) {
    // No exit fade here: swapping in place keeps the page from jumping.
    return (
      <motion.div
        key={run}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={run}
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function Appear({
  show,
  children,
  className,
  y = 8,
  layout,
}: {
  show: boolean;
  children: ReactNode;
  className?: string;
  y?: number;
  layout?: boolean;
}) {
  const reduce = useReducedMotion();
  const fluid = useContext(FluidDemo);
  // In a fluid stage, upcoming lines keep their space (invisible) so nothing shifts as they appear.
  const reserve = fluid && !layout;
  if (!show && !reserve) return null;
  return (
    <motion.div
      layout={layout ? 'position' : undefined}
      className={className}
      aria-hidden={show ? undefined : true}
      data-pending={show ? undefined : ''}
      initial={reduce ? false : { opacity: 0, y }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function CalendarIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true" className="shrink-0 text-accent">
      <rect x="3.5" y="6.5" width="23" height="20" rx="3" stroke="currentColor" />
      <path d="M3.5 12.5h23M9.5 3.5v6M20.5 3.5v6" stroke="currentColor" />
      <path d="M10.5 19l3 3 6-6" stroke="currentColor" />
    </svg>
  );
}

/** The white "window" each demo sits in, inset from the grey stage. */
function Window({ children, className = '' }: { children: ReactNode; className?: string }) {
  const fluid = useContext(FluidDemo);
  return (
    <div
      className={`${fluid ? 'relative m-3 sm:m-7' : 'absolute inset-4 sm:inset-7'} flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_-30px_rgba(30,27,75,0.35)] ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 1. AI voice receptionist                                             */
/* ------------------------------------------------------------------ */
const CALL = [
  { who: 'Caller', text: 'Hi, is the three-bed villa in Dubai Hills still available?' },
  {
    who: 'Assistant',
    text: "It is. It has a private garden and it's a short walk from the park. Would you like to see it this week?",
  },
  { who: 'Caller', text: 'Yes, Saturday morning if possible.' },
  { who: 'Assistant', text: "Saturday at 11:00 is free. I've booked it and sent the details to your phone." },
];
const CALL_TIMES = [1100, 2300, 4400, 6500, 8200, 10400];
const BARS = Array.from({ length: 28 }, (_, i) => ({
  h: 0.35 + ((i * 37) % 60) / 100,
  d: 0.55 + ((i * 53) % 50) / 100,
  delay: ((i * 29) % 40) / 100,
}));

function VoiceBody({ step }: { step: number }) {
  const reduce = useReducedMotion();
  const [secs, setSecs] = useState(reduce ? 52 : 0);
  const live = step >= 1 && step < CALL_TIMES.length;

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setSecs((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [live]);

  const clock = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
  const ended = step >= CALL_TIMES.length;

  return (
    <Window>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line px-5 py-5 sm:px-7">
        <div className="min-w-0 whitespace-nowrap">
          <p className="t-caption flex items-center gap-2.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${step === 0 ? 'animate-pulse bg-slate' : ended ? 'bg-slate' : 'bg-accent'}`}
            />
            <span className="tabular">{step === 0 ? 'Incoming call' : ended ? `Call ended ${clock}` : `On call ${clock}`}</span>
          </p>
          <p className="tabular mt-2 text-[1.3rem] font-semibold leading-none tracking-[-0.02em] sm:text-[1.5rem]">+971 50 482 2214</p>
        </div>
        <div className={`flex h-9 items-center gap-[3px] ${live ? 'wave-on' : ''}`} aria-hidden="true">
          {BARS.map((b, i) => (
            <span
              key={i}
              className="wave-bar"
              style={{ ['--h' as string]: b.h, ['--d' as string]: `${b.d}s`, ['--delay' as string]: `${b.delay}s` }}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-hidden px-5 py-6 sm:px-7">
        {CALL.map((line, i) => (
          <Appear key={i} show={step >= i + 2}>
            <p className="t-caption">{line.who}</p>
            <p className={`mt-1 text-[15px] leading-[1.6] ${line.who === 'Assistant' ? 'text-ink' : 'text-slate'}`}>
              {line.text}
            </p>
          </Appear>
        ))}
      </div>

      <div className="px-5 pb-5 sm:px-7 sm:pb-6">
        <Appear show={step >= 6} className="flex items-center gap-4 rounded-xl border border-line bg-fog px-4 py-4">
          <CalendarIcon />
          <div>
            <p className="text-[15px] font-medium">Viewing booked</p>
            <p className="text-[14px] text-slate">Saturday at 11:00, three-bed villa in Dubai Hills</p>
          </div>
        </Appear>
      </div>
    </Window>
  );
}

export function VoiceDemo({ play }: { play: boolean }) {
  const { step, run } = useSequence(CALL_TIMES, play);
  return (
    <Loop run={run}>
      <VoiceBody step={step} />
    </Loop>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Email lead qualification                                          */
/* ------------------------------------------------------------------ */
const EMAIL_TIMES = [700, 2000, 2600, 3200, 3800, 4900, 6700, 8500];
const FACTS = [
  { label: 'Budget', value: 'AED 3 to 4M' },
  { label: 'Moving', value: 'In about 3 months' },
  { label: 'Area', value: 'Palm Jumeirah' },
  { label: 'Finance', value: 'Mortgage approved' },
];

function EmailBody({ step }: { step: number }) {
  const reduce = useReducedMotion();
  return (
    <Window>
      <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-7">
        <p className="t-caption">Website enquiries</p>
        <p className="t-caption tabular">09:41</p>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 overflow-hidden px-5 py-4 sm:px-7">
        <Appear show={step >= 1} className="flex gap-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-[13px] font-medium text-accent">
            SM
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-medium">Sarah Mitchell</p>
            <p className="text-[15px]">Looking for a 3-bed on Palm Jumeirah</p>
            <p className="mt-1 line-clamp-2 text-[14px] text-slate">
              Hi, we're moving from London in the spring. Our budget is around AED 3.5M and our mortgage is approved.
              Could someone call me?
            </p>
          </div>
        </Appear>

        <div>
          <Appear show={step >= 2}>
            <p className="t-caption">What the assistant picked out</p>
          </Appear>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {FACTS.map((fact, i) => (
              <Appear key={fact.label} show={step >= i + 2} className="rounded-xl border border-line px-3 py-2">
                <p className="text-[12px] text-slate">{fact.label}</p>
                <p className="text-[14px] font-medium leading-snug">{fact.value}</p>
              </Appear>
            ))}
          </div>
        </div>

        <Appear show={step >= 6} className="flex items-center gap-4">
          <p className="text-[14px] text-slate">Priority</p>
          <div className="relative h-1 flex-1 overflow-hidden bg-line">
            <motion.span
              className="absolute inset-y-0 left-0 w-full origin-left bg-accent"
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: step >= 6 ? 0.86 : 0 }}
              transition={{ duration: 1.1, ease: EASE }}
            />
          </div>
          <p className="text-[14px] font-medium text-accent">High</p>
        </Appear>

        <Appear show={step >= 7} className="rounded-xl bg-accent-soft px-4 py-3">
          <p className="text-[12px] text-slate">Reply sent at 09:41:50, 38 seconds after the enquiry</p>
          <p className="mt-1 text-[13.5px] leading-[1.55]">
            Hi Sarah, thanks for getting in touch. We have two 3-bed homes on the Palm in your budget. Would Tuesday
            at 4:30pm London time suit you for a short call?
          </p>
        </Appear>

        <Appear show={step >= 8} className="flex items-center gap-3">
          <CalendarIcon />
          <p className="text-[14px]">
            <span className="font-medium">Call booked:</span> Tuesday, 4:30pm London time
          </p>
        </Appear>
      </div>
    </Window>
  );
}

export function EmailDemo({ play }: { play: boolean }) {
  const { step, run } = useSequence(EMAIL_TIMES, play);
  return (
    <Loop run={run}>
      <EmailBody step={step} />
    </Loop>
  );
}

/* ------------------------------------------------------------------ */
/* 3. WhatsApp assistant                                                */
/* ------------------------------------------------------------------ */
type Msg =
  | { kind: 'in' | 'out'; text: string; at: number; listings?: boolean }
  | { kind: 'typing'; at: number; until: number }
  | { kind: 'note'; text: string; at: number };

const CHAT: Msg[] = [
  { kind: 'in', text: 'Hi, I saw your ad for the Marina apartments. Are they still available?', at: 1 },
  { kind: 'typing', at: 2, until: 3 },
  { kind: 'out', text: 'Hi Omar, yes they are. Are you looking to buy or rent, and what budget do you have in mind?', at: 3 },
  { kind: 'in', text: 'Buying. Around AED 2M.', at: 4 },
  { kind: 'typing', at: 5, until: 6 },
  { kind: 'out', text: 'Here are two that fit:', at: 6, listings: true },
  { kind: 'in', text: 'The first one looks great. Can I see it?', at: 7 },
  { kind: 'typing', at: 8, until: 9 },
  { kind: 'out', text: 'Of course. Would Thursday at 5pm or Friday at 10am suit you?', at: 9 },
  { kind: 'in', text: 'Friday at 10.', at: 10 },
  { kind: 'note', text: 'Viewing booked, Friday 10:00. Agent notified.', at: 11 },
];
const CHAT_TIMES = [600, 1500, 2800, 4300, 5200, 6500, 8600, 9500, 10700, 12200, 13400];
const LISTINGS = [
  { tone: 'from-sky-200 via-accent-soft to-indigo-200', name: '2-bed, Marina Gate', price: 'AED 1.95M' },
  { tone: 'from-violet-200 via-accent-soft to-sky-100', name: '2-bed, Marina Vista', price: 'AED 2.1M' },
];

/** A simple drawn thumbnail for a listing card. */
function ListingThumb({ tone }: { tone: string }) {
  return (
    <span className={`relative block aspect-[4/3] w-full bg-gradient-to-br ${tone}`}>
      <svg viewBox="0 0 40 30" className="absolute inset-x-[22%] bottom-0 text-white/90" fill="currentColor" aria-hidden="true">
        <path d="M4 30V14l8-5v21H4Zm10 0V6l9-6 9 6v24H14Zm20 0V16l6 3v11h-6Z" />
      </svg>
    </span>
  );
}

function ChatBody({ step }: { step: number }) {
  const fluid = useContext(FluidDemo);
  return (
    <div className={`${fluid ? 'relative m-3 h-[580px] sm:m-7' : 'absolute inset-4 sm:inset-7'} flex justify-center`}>
      <div className="flex h-full w-full max-w-[360px] flex-col overflow-hidden rounded-[26px] border border-line bg-white">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-[14px] font-semibold text-white">
            M
          </span>
          <div>
            <p className="text-[14px] font-medium leading-tight">Marina Homes</p>
            <p className="text-[12px] text-slate">Replies instantly</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-end gap-2 overflow-hidden bg-fog px-3 py-3">
          {CHAT.map((m, i) => {
            if (m.kind === 'typing') {
              return (
                <Appear key={i} show={step >= m.at && step < m.until} layout className="self-end">
                  <div className="typing flex gap-1 rounded-[14px] rounded-tr-[4px] bg-accent-soft px-3.5 py-3">
                    <span />
                    <span />
                    <span />
                  </div>
                </Appear>
              );
            }
            if (m.kind === 'note') {
              return (
                <Appear key={i} show={step >= m.at} layout className="mt-1 self-center">
                  <p className="rounded-full bg-white px-3.5 py-1.5 text-center text-[12px] text-accent">{m.text}</p>
                </Appear>
              );
            }
            const out = m.kind === 'out';
            return (
              <Appear
                key={i}
                show={step >= m.at}
                layout
                className={`max-w-[82%] ${out ? 'self-end' : 'self-start'}`}
              >
                <div
                  className={`px-3.5 py-2 text-[14px] leading-[1.5] ${
                    out ? 'rounded-[14px] rounded-tr-[4px] bg-accent-soft' : 'rounded-[14px] rounded-tl-[4px] bg-white'
                  }`}
                >
                  {m.text}
                  {m.listings && (
                    <div className="mt-2 grid grid-cols-2 gap-2 pb-1">
                      {LISTINGS.map((l) => (
                        <div key={l.name} className="overflow-hidden rounded-[8px] bg-white">
                          <ListingThumb tone={l.tone} />
                          <p className="px-2 pt-1.5 text-[11px] leading-tight">{l.name}</p>
                          <p className="px-2 pb-2 text-[12px] font-medium">{l.price}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Appear>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function WhatsAppDemo({ play }: { play: boolean }) {
  const { step, run } = useSequence(CHAT_TIMES, play);
  return (
    <Loop run={run}>
      <ChatBody step={step} />
    </Loop>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Automatic follow-up                                               */
/* ------------------------------------------------------------------ */
const TIMELINE = [
  { when: 'Monday 10:02', what: 'James enquires about a 2-bed apartment in JVC.' },
  { when: 'Monday 10:03', what: 'He gets a personal reply with the floor plans.' },
  { when: 'Wednesday 09:30', what: 'No reply yet, so a short follow-up email goes out.' },
  { when: 'Friday 18:00', what: 'A friendly check-in on WhatsApp.' },
  { when: 'Friday 18:12', what: 'James replies: "Can we talk on Monday?"' },
];
const FOLLOW_TIMES = [600, 1900, 3400, 4900, 6400, 8000];

function FollowBody({ step }: { step: number }) {
  const reduce = useReducedMotion();
  const reached = Math.min(step, TIMELINE.length);
  const progress = TIMELINE.length > 1 ? Math.max(0, reached - 1) / (TIMELINE.length - 1) : 0;

  return (
    <Window>
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
        <p className="text-[15px] font-medium">James Carter</p>
        <p className="t-caption">New lead</p>
      </div>

      <div className="relative flex-1 overflow-hidden px-5 py-6 sm:px-7">
        <div className="relative">
          <span className="absolute top-2 bottom-2 left-[4px] w-px bg-line" aria-hidden="true" />
          <motion.span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[4px] w-px origin-top bg-accent"
            initial={reduce ? false : { scaleY: 0 }}
            animate={{ scaleY: progress }}
            transition={{ duration: 1, ease: EASE }}
          />
          <ol className="space-y-6">
            {TIMELINE.map((item, i) => (
              <li key={item.when} className="relative pl-8">
                <span
                  aria-hidden="true"
                  className={`absolute top-[7px] left-0 h-[9px] w-[9px] rounded-full border transition-colors duration-500 ${
                    step > i ? 'border-accent bg-accent' : 'border-line bg-white'
                  }`}
                />
                <Appear show={step > i}>
                  <p className="t-caption tabular">{item.when}</p>
                  <p className="mt-1 text-[15px] leading-[1.55]">{item.what}</p>
                </Appear>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="px-5 pb-5 sm:px-7 sm:pb-6">
        <Appear show={step >= 6} className="flex items-center gap-4 rounded-xl border border-line bg-fog px-4 py-4">
          <CalendarIcon />
          <div>
            <p className="text-[15px] font-medium">Call booked for Monday at 11:00</p>
            <p className="text-[14px] text-slate">Follow-ups stopped automatically when James replied.</p>
          </div>
        </Appear>
      </div>
    </Window>
  );
}

export function FollowUpDemo({ play }: { play: boolean }) {
  const { step, run } = useSequence(FOLLOW_TIMES, play);
  return (
    <Loop run={run}>
      <FollowBody step={step} />
    </Loop>
  );
}

export const DEMO_COMPONENTS = {
  voice: VoiceDemo,
  email: EmailDemo,
  whatsapp: WhatsAppDemo,
  followup: FollowUpDemo,
};
