import { createElement, Fragment, useRef, type ReactNode } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { EASE } from '../lib/motion';

/* ------------------------------------------------------------------ */
/* Masked line reveal for big headlines. Lines are authored explicitly */
/* so every break is deliberate; mobileLines lets narrow screens use   */
/* shorter lines instead of wrapping. A line can mix plain text and    */
/* { g: '...' } segments, which get the brand gradient.                */
/* ------------------------------------------------------------------ */
export type Segment = string | { g: string };
export type Line = string | Segment[];

const lineText = (line: Line) =>
  typeof line === 'string' ? line : line.map((s) => (typeof s === 'string' ? s : s.g)).join('');

function LineContent({ line }: { line: Line }) {
  if (typeof line === 'string') return <>{line}</>;
  return (
    <>
      {line.map((seg, i) =>
        typeof seg === 'string' ? (
          <Fragment key={i}>{seg}</Fragment>
        ) : (
          <span key={i} className="text-gradient">
            {seg.g}
          </span>
        ),
      )}
    </>
  );
}

type MaskHeadingProps = {
  lines: Line[];
  mobileLines?: Line[];
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  immediate?: boolean;
  delay?: number;
};

export function MaskHeading({ lines, mobileLines, as = 'h2', className, immediate, delay = 0 }: MaskHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.25 });
  const reduce = useReducedMotion();
  const play = immediate || seen;

  const renderLines = (set: Line[], visibility: string) =>
    set.map((line, i) => (
      <span key={`${visibility}-${i}`} className={`mask-line ${visibility}`} aria-hidden="true">
        <motion.span
          initial={reduce ? false : { transform: 'translateY(112%)' }}
          animate={play ? { transform: 'translateY(0%)' } : undefined}
          transition={{ duration: 1.3, ease: EASE, delay: delay + i * 0.1 }}
        >
          <LineContent line={line} />
        </motion.span>
      </span>
    ));

  return createElement(
    as,
    { ref, className },
    <span className="sr-only">{lines.map(lineText).join(' ')}</span>,
    mobileLines ? (
      <>
        {renderLines(mobileLines, 'sm:hidden')}
        {renderLines(lines, 'max-sm:hidden')}
      </>
    ) : (
      renderLines(lines, '')
    ),
  );
}

/* ------------------------------------------------------------------ */
/* Fade-up reveal for paragraphs, labels and small blocks.             */
/* ------------------------------------------------------------------ */
type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'p' | 'li' | 'ul';
};

export function Reveal({ children, delay = 0, y = 18, className, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, transform: `translateY(${y}px)` }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll-scrubbed words: the sentence brightens in reading order.     */
/* ------------------------------------------------------------------ */
function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

export function ScrubWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {reduce
          ? text
          : words.map((word, i) => (
              <span key={i}>
                <Word progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                  {word}
                </Word>{' '}
              </span>
            ))}
      </span>
    </p>
  );
}

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg className={`arrow ${className}`} width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
      <path d="M0 5h12.5M8.5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** Small rounded label above a section heading. */
export function Pill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`pill ${className}`}>
      <span className="pill-dot" aria-hidden="true" />
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Line icons, drawn on a 24px grid with a 1.6px stroke.               */
/* ------------------------------------------------------------------ */
const ICONS: Record<string, ReactNode> = {
  web: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M3 9h18M6.5 6.75h.01M9 6.75h.01" />
    </>
  ),
  chat: <path d="M5 18.5V7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v6a2.5 2.5 0 0 1-2.5 2.5H9l-4 2.5Z" />,
  bolt: <path d="M13 3 5.5 13.5H12L11 21l7.5-10.5H12L13 3Z" />,
  repeat: (
    <>
      <path d="M17 3.5 20 6.5l-3 3" />
      <path d="M4 11.5v-1a4 4 0 0 1 4-4h12" />
      <path d="m7 20.5-3-3 3-3" />
      <path d="M20 12.5v1a4 4 0 0 1-4 4H4" />
    </>
  ),
  play: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="m10 9 5 3-5 3V9Z" />
    </>
  ),
  cube: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  inbox: (
    <>
      <path d="M4 13.5 6.5 5h11l2.5 8.5V19H4v-5.5Z" />
      <path d="M4 13.5h4.5l1 2h5l1-2H20" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3.5v4M16 3.5v4M9 15l2 2 4-4" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1l8 8a1.5 1.5 0 0 1 0 2.1l-6.9 6.9a1.5 1.5 0 0 1-2.1 0l-8.1-7.9Z" />
      <circle cx="8.5" cy="8.5" r="1.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  phone: (
    <path d="M6.6 3.5h2.6l1.6 4.2-2.1 1.3a11.5 11.5 0 0 0 6.3 6.3l1.3-2.1 4.2 1.6v2.6a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.6 5.5a2 2 0 0 1 2-2Z" />
  ),
};

export function Icon({ name, className = '', size = 20 }: { name: string; className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {ICONS[name]}
    </svg>
  );
}

/** Rounded square holding an icon, used on cards. */
export function IconTile({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent-soft to-violet-100 text-accent ${className}`}>
      <Icon name={name} />
    </span>
  );
}
