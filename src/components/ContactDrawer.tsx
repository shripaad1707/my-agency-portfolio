import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CONTACT } from '../content';
import { pauseScroll, resumeScroll } from '../lib/motion';

const NEEDS = [
  'More enquiries from my website',
  'A new or redesigned website',
  'Faster replies and follow-ups',
  'An AI chat or voice assistant',
  'Videos, reels or ad designs',
  'A 3D model or walkthrough',
  'Something else',
];

// Messages go straight to Shripaad's inbox through FormSubmit (no email app needed).
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT.email}`;

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      if (status !== 'sending') setStatus('idle');
      dialog.showModal();
      pauseScroll();
    } else if (!open && dialog.open) {
      dialog.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      resumeScroll();
      onClose();
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const get = (key: string) => String(data.get(key) ?? '').trim();
    if (get('_honey')) return; // spam bots fill the hidden field

    setStatus('sending');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: get('name'),
          email: get('email'),
          website: get('website') || 'Not given',
          'what they need': get('need'),
          message: get('message') || 'No message',
          _subject: `New enquiry from ${get('name')} (website contact form)`,
          _replyto: get('email'),
          _template: 'table',
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) !== 'true') throw new Error(json.message || 'Not sent');
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <dialog
      ref={ref}
      className="drawer"
      aria-labelledby="contact-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
    >
      <div className="flex h-full flex-col overflow-y-auto" data-lenis-prevent>
        <div className="flex items-center justify-between border-b border-line px-6 py-5 sm:px-10">
          <p className="t-caption">Contact</p>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center"
            aria-label="Close"
            onClick={() => ref.current?.close()}
          >
            <span className="burger is-open" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>

        <div className="flex-1 px-6 py-10 sm:px-10">
          <h2 id="contact-title" className="t-h2">
            Contact me
          </h2>
          <p className="mt-4 text-[15px] text-slate">
            Tell me about your business and what you need. I'll reply within one working day.
          </p>

          {status === 'sent' ? (
            <div className="mt-10 rounded-2xl bg-accent-soft px-5 py-5" role="status">
              <p className="text-[15px] font-medium">Thanks, your message has been sent.</p>
              <p className="mt-2 text-[15px] text-slate">I'll reply to the email you gave within one working day.</p>
              <button type="button" className="link-btn mt-5" onClick={() => setStatus('idle')}>
                Send another message
              </button>
            </div>
          ) : (
            <form className="mt-10 space-y-5" onSubmit={submit}>
              <label className="block">
                <span className="mb-2 block text-[14px] font-medium">Your name</span>
                <input id="contact-name" className="field" name="name" required autoComplete="name" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[14px] font-medium">Email</span>
                <input id="contact-email" className="field" name="email" type="email" required autoComplete="email" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[14px] font-medium">Your website or social page (optional)</span>
                <input id="contact-website" className="field" name="website" placeholder="yourcompany.com" autoComplete="url" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[14px] font-medium">What do you need help with?</span>
                <select id="contact-need" className="field" name="need" defaultValue={NEEDS[0]}>
                  {NEEDS.map((need) => (
                    <option key={need}>{need}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-[14px] font-medium">Message</span>
                <textarea id="contact-message" className="field" name="message" rows={4} required />
              </label>
              {/* Hidden from people; bots that fill it are ignored */}
              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              <button type="submit" className="btn btn-solid w-full" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>

              {status === 'error' && (
                <p className="rounded-xl bg-fog px-4 py-3 text-[14px] text-ink" role="alert">
                  Your message didn't go through. Please try again, or email me at{' '}
                  <a className="underline underline-offset-4" href={`mailto:${CONTACT.email}`}>
                    {CONTACT.email}
                  </a>
                  .
                </p>
              )}
            </form>
          )}
        </div>

        <div className="border-t border-line px-6 py-6 text-[14px] text-slate sm:px-10">
          Prefer to talk?{' '}
          <a className="text-ink underline underline-offset-4" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">
            WhatsApp {CONTACT.phoneDisplay}
          </a>
        </div>
      </div>
    </dialog>
  );
}
