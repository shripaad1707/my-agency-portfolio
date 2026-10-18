import { CONTACT } from '../content';
import { scrollToId } from '../lib/motion';
import { Logo } from './Nav';

const LINKS = [
  { label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { label: 'Phone', value: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
  { label: 'WhatsApp', value: CONTACT.phoneDisplay, href: CONTACT.whatsapp, external: true },
  { label: 'LinkedIn', value: CONTACT.linkedinDisplay, href: CONTACT.linkedin, external: true },
  { label: 'Instagram', value: CONTACT.instagramDisplay, href: CONTACT.instagram, external: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white pt-16 pb-10 lg:pt-20">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Logo />
          <p className="mt-5 max-w-[38ch] text-[15px] text-slate">
            Helping businesses get seen and sell more, with websites, automation and video. Based in {CONTACT.location}.
          </p>
        </div>

        <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
          {LINKS.map((link) => (
            <li key={link.label}>
              <p className="t-caption">{link.label}</p>
              <a
                href={link.href}
                className="nav-link mt-1 inline-block text-[15px] font-medium break-all"
                {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                {link.value}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap mt-14 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[13px] text-slate">
          © {new Date().getFullYear()} {CONTACT.name}
        </p>
        <button type="button" onClick={() => scrollToId('top')} className="nav-link text-[13px] text-slate hover:text-ink">
          Back to top
        </button>
      </div>
    </footer>
  );
}
