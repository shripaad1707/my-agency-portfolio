import { useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { RENDERS, WORK } from '../content';
import { EASE, asset, usePauseOffscreen, useSmartVideo } from '../lib/motion';
import { Aurora, Stars } from './ambient';
import { Arrow, MaskHeading, Reveal } from './ui';

/** A muted clip that loads just before it is needed and only plays while it is on screen. */
function Loop({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useSmartVideo(ref);
  return (
    <video
      ref={ref}
      className="h-full w-full object-cover"
      src={asset(src)}
      poster={asset(poster)}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-label={label}
    />
  );
}

/** Small label that sits on top of an image. */
function Tag({ children, right }: { children: string; right?: boolean }) {
  return (
    <span className={`absolute top-4 ${right ? 'right-4' : 'left-4'} glass-ink rounded-full px-3 py-1 text-[12.5px] font-medium text-white`}>
      {children}
    </span>
  );
}

/** One product render. The image settles from a slight zoom as it scrolls in. */
function RenderTile({ item, index }: { item: (typeof RENDERS)[number]; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.figure
      className="dark-card spot zoom w-[min(74vw,300px)] shrink-0 snap-center overflow-hidden p-1.5 sm:w-auto"
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, ease: EASE, delay: (index % 3) * 0.08 }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[18px]" style={{ background: item.tone }}>
        <img src={asset(item.image)} alt={item.alt} loading="lazy" className="zoom-img h-full w-full object-cover" />
      </div>
      <figcaption className="flex items-baseline justify-between gap-3 px-3 pt-4 pb-2.5">
        <span className="text-[15px] font-semibold tracking-[-0.015em] text-white">{item.name}</span>
        <span className="text-[13px] text-white/55">{item.kind}</span>
      </figcaption>
    </motion.figure>
  );
}

type App = Extract<(typeof WORK)[number], { host: string }>;

/** A web app project: a browser window playing a tour of the live site, with the details beside it. */
function AppCard({ app, flip }: { app: App; flip?: boolean }) {
  return (
    <Reveal>
      <article className="dark-card spot grid overflow-hidden p-1.5 lg:grid-cols-12">
        <div
          className={`overflow-hidden rounded-[18px] border border-white/10 bg-[#0b0d18] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] lg:col-span-8 ${flip ? 'lg:order-2' : ''}`}
        >
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5" aria-hidden="true">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            </span>
            <span className="mx-auto truncate rounded-md bg-white/[0.06] px-3 py-1 text-[12px] text-white/55">{app.host}</span>
            <span className="w-[42px]" />
          </div>
          <div className="relative aspect-[1280/696] bg-[#0b0d18]">
            <Loop src={app.video} poster={app.poster} label={`Tour of the ${app.title} website, scrolling from the top of the page to the footer`} />
          </div>
        </div>
        <div className={`flex flex-col justify-center px-5 pt-7 pb-6 sm:px-7 lg:col-span-4 lg:px-8 ${flip ? 'lg:order-1' : ''}`}>
          <span className="self-start rounded-full bg-white/[0.08] px-3 py-1 text-[12.5px] font-medium text-white/85">{app.label}</span>
          <p className="mt-5 text-[13.5px] font-medium text-[#a5b4fc]">{app.kind}</p>
          <h3 className="mt-1 text-[clamp(1.5rem,2vw,1.9rem)] leading-[1.15] font-semibold tracking-[-0.03em]">{app.title}</h3>
          <p className="mt-3 text-[15px] leading-[1.7] text-white/65">{app.text}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {app.tags.map((t) => (
              <li key={t} className="rounded-full border border-white/12 px-3 py-1 text-[12.5px] text-white/70">
                {t}
              </li>
            ))}
          </ul>
          <a href={app.href} target="_blank" rel="noreferrer" className="btn btn-light mt-7 self-start">
            {app.cta} <Arrow />
          </a>
        </div>
      </article>
    </Reveal>
  );
}

export default function Work({ onContact }: { onContact: () => void }) {
  const [relay, flowstack, site, villa] = WORK;
  const skyRef = useRef<HTMLDivElement>(null);
  usePauseOffscreen(skyRef);
  return (
    <section
      id="work"
      className="night-band relative mx-2 overflow-hidden rounded-[28px] py-24 text-white sm:mx-4 sm:rounded-[40px] lg:py-32"
    >
      {/* Night sky at the top of the panel: slow light pools, twinkling stars and fine grain. Paused once scrolled past. */}
      <div ref={skyRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[1300px] overflow-hidden">
        <Aurora preset="night" />
        <Stars count={24} className="inset-0 [mask-image:linear-gradient(to_bottom,#000_40%,transparent)]" />
        <div className="grain absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_50%,transparent)]" />
      </div>
      <div className="wrap relative">
        <div className="mx-auto flex max-w-[780px] flex-col items-center text-center">
          <Reveal>
            <span className="pill-dark">
              <span className="pill-dot" aria-hidden="true" />
              Work
            </span>
          </Reveal>
          <MaskHeading
            className="t-h2 mt-6"
            lines={['Real projects,', 'and concept shoots.']}
            mobileLines={['Real projects,', 'and concept', 'shoots.']}
          />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-[56ch] text-[clamp(1rem,0.35vw+0.94rem,1.15rem)] leading-[1.7] text-white/70">
              Relay.ai and FlowStack AI are web apps, and Skyline Villas is a real estate website. I designed and built
              all three. The product shots are concept brands I created in 3D, to show the look your products could have.
            </p>
          </Reveal>
        </div>

        {/* Web apps: each shown as a browser window playing a tour of the live site */}
        <div className="mt-16 flex flex-col gap-5 lg:mt-20">
          <AppCard app={relay} />
          <AppCard app={flowstack} flip />
        </div>

        {/* Skyline Villas: the website, the mobile view and the 3D model */}
        <div className="mt-5 grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <article className="dark-card spot zoom flex h-full flex-col overflow-hidden p-1.5">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-[#1b1e2e]">
                <img src={asset(site.image)} alt="Skyline Villas website home page" loading="lazy" className="zoom-img h-full w-full object-cover object-top" />
                <Tag right>{site.label}</Tag>
              </div>
              <div className="flex flex-1 flex-col gap-4 px-5 pt-6 pb-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
                <div>
                  <p className="text-[13.5px] font-medium text-[#a5b4fc]">{site.kind}</p>
                  <h3 className="t-h3 mt-1">{site.title}</h3>
                  <p className="mt-2 max-w-[50ch] text-[15px] text-white/65">{site.text}</p>
                </div>
                <a href={site.href} target="_blank" rel="noreferrer" className="link-btn shrink-0 self-start text-[14px] sm:self-auto">
                  {site.cta} <Arrow />
                </a>
              </div>
            </article>
          </Reveal>

          <Reveal className="lg:col-span-4" delay={0.1}>
            <article className="dark-card spot flex h-full flex-col overflow-hidden p-1.5">
              <div className="phone-stage relative flex flex-1 items-center justify-center overflow-hidden rounded-[18px] px-6 py-8">
                <div className="relative w-[58%] max-w-[220px] overflow-hidden rounded-[26px] border-[5px] border-[#05060c] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] lg:w-[64%]">
                  <img src={asset('img/work/skyline-phone.webp')} alt="Skyline Villas website on a phone" loading="lazy" className="block w-full" />
                </div>
              </div>
              <div className="px-5 pt-5 pb-5 sm:px-6">
                <p className="text-[13.5px] font-medium text-[#a5b4fc]">Mobile</p>
                <p className="mt-1 text-[15px] text-white/65">The same site on a phone, where most buyers first see it.</p>
              </div>
            </article>
          </Reveal>

          <Reveal className="lg:col-span-12">
            <article className="dark-card spot grid overflow-hidden p-1.5 lg:grid-cols-12">
              <div className="relative aspect-[16/11] overflow-hidden rounded-[18px] bg-[#0b0d18] lg:col-span-6 lg:aspect-[4/3]">
                <Loop src={villa.video} poster={villa.poster} label="3D villa model turning slowly" />
                <Tag>{villa.label}</Tag>
              </div>
              <div className="flex flex-col justify-center px-5 pt-6 pb-5 sm:px-6 lg:col-span-6 lg:px-12">
                <p className="text-[13.5px] font-medium text-[#a5b4fc]">{villa.kind}</p>
                <h3 className="t-h3 mt-1">{villa.title}</h3>
                <p className="mt-2 max-w-[46ch] text-[15px] text-white/65">{villa.text}</p>
              </div>
            </article>
          </Reveal>
        </div>

        {/* Product renders */}
        <div className="mt-24 flex flex-col gap-6 lg:mt-28 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[560px]">
            <Reveal>
              <h3 className="text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.12] font-semibold tracking-[-0.035em]">
                Product renders, made in Blender.
              </h3>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-[16px] leading-[1.7] text-white/65">
                Concept brands I designed to show the style. Send me photos of your product and I'll build it in 3D,
                light it like a studio shoot and give you shots for your store and ads.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <button type="button" className="btn btn-light" onClick={onContact}>
              Get renders of your product <Arrow />
            </button>
          </Reveal>
        </div>

        <div
          className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 lg:gap-5"
          data-lenis-prevent-wheel
        >
          {RENDERS.map((item, i) => (
            <RenderTile key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
