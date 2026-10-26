import type { MouseEvent } from 'react';
import { CONTACT, NAV_LINKS } from '../content';
import { scrollToId } from '../lib/motion';
import { Logo } from './Nav';
import { Arrow } from './ui';

const CONTACT_LINKS = [
  { label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { label: 'Phone', value: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
  { label: 'WhatsApp', value: CONTACT.phoneDisplay, href: CONTACT.whatsapp, external: true },
];

const SOCIAL_LINKS = [
  { label: 'LinkedIn', value: CONTACT.linkedinDisplay, href: CONTACT.linkedin },
  { label: 'Instagram', value: CONTACT.instagramDisplay, href: CONTACT.instagram },
];

export default function Footer({ onContact }: { onContact: () => void }) {
  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <footer className="relative overflow-hidden border-t border-line bg-white pt-16 lg:pt-20">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-5 max-w-[34ch] text-[15px] text-slate">
            UGC video ads, 3D product renders, websites and web apps for brands. Based in {CONTACT.location}.
          </p>
          <button type="button" className="btn btn-solid mt-7" onClick={onContact}>
            Start a project <Arrow />
          </button>
        </div>

        <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-6">
          <p className="t-caption">Explore</p>
          <ul className="mt-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} onClick={go(link.id)} className="nav-link text-[15px] text-ink/80 hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <p className="t-caption">Contact</p>
          <ul className="mt-4 space-y-4">
            {CONTACT_LINKS.map((link) => (
              <li key={link.label}>
                <span className="block text-[12.5px] text-slate">{link.label}</span>
                <a
                  href={link.href}
                  className="nav-link inline-block text-[15px] font-medium break-all"
                  {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  {link.value}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <p className="t-caption">Social</p>
          <ul className="mt-4 space-y-4">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <span className="block text-[12.5px] text-slate">{link.label}</span>
                <a href={link.href} target="_blank" rel="noreferrer" className="nav-link inline-block text-[15px] font-medium">
                  {link.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="wrap mt-16">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 pb-2">
          <p className="text-[13px] text-slate">
            © {new Date().getFullYear()} {CONTACT.name}
          </p>
          <button type="button" onClick={() => scrollToId('top')} className="nav-link text-[13px] text-slate hover:text-ink">
            Back to top
          </button>
        </div>
      </div>

      <p aria-hidden="true" className="footer-word wrap mt-4 -mb-[0.12em] select-none text-center">
        {CONTACT.name}
      </p>
    </footer>
  );
}
