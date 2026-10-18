import { useEffect, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CONTACT, NAV_LINKS } from '../content';
import { EASE, pauseScroll, resumeScroll, scrollToId } from '../lib/motion';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-accent to-accent-2 text-[15px] font-semibold text-white"
      >
        S
      </span>
      <span className="text-[16px] font-semibold tracking-[-0.02em]">{CONTACT.name}</span>
    </span>
  );
}

export default function Nav({ onContact }: { onContact: () => void }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    pauseScroll();
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      resumeScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToId(id), open ? 80 : 0);
  };

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)', height: 'calc(72px + env(safe-area-inset-top, 0px))' }}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-700 ease-arch ${
          solid && !open ? 'border-ink/10 bg-white/80 backdrop-blur-md' : 'border-transparent bg-transparent'
        }`}
      >
        <div className="wrap flex h-full items-center justify-between gap-6">
          <a href="#top" onClick={go('top')} aria-label={`${CONTACT.name}, back to top`}>
            <Logo />
          </a>

          <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.id} href={`#${link.id}`} onClick={go(link.id)} className="nav-link text-[14px] text-ink/80 hover:text-ink">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button type="button" onClick={onContact} className="btn btn-solid hidden h-10 px-5 text-[14px] sm:inline-flex">
              Contact me
            </button>
            <button
              type="button"
              className="-mr-2 grid h-11 w-11 place-items-center lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span className={`burger ${open ? 'is-open' : ''}`}>
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="menu"
            className="hero-glow fixed inset-0 z-40 overflow-y-auto bg-white lg:hidden"
            data-lenis-prevent
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <nav aria-label="Mobile" className="wrap flex min-h-full flex-col justify-center pt-[96px] pb-12">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={go(link.id)}
                  className="t-h2 py-2"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.08 + i * 0.06 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                className="mt-12 flex flex-col items-start gap-4 text-[15px] text-slate"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.08 + NAV_LINKS.length * 0.06 }}
              >
                <button
                  type="button"
                  className="btn btn-solid"
                  onClick={() => {
                    setOpen(false);
                    onContact();
                  }}
                >
                  Contact me
                </button>
                <a href={`mailto:${CONTACT.email}`} className="mt-2 hover:text-ink">
                  {CONTACT.email}
                </a>
                <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="hover:text-ink">
                  WhatsApp {CONTACT.phoneDisplay}
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
