// Everything a visitor reads lives here, so the copy can be edited in one place.

export const CONTACT = {
  name: 'Shripaad Koduri',
  email: 'shripaad17@gmail.com',
  phoneDisplay: '+91 78931 55092',
  phoneHref: 'tel:+917893155092',
  whatsapp:
    'https://wa.me/917893155092?text=' +
    encodeURIComponent("Hi Shripaad, I saw your website and I'd like to talk about my business."),
  linkedin: 'https://www.linkedin.com/in/shripaad-koduri/',
  linkedinDisplay: 'in/shripaad-koduri',
  instagram: 'https://www.instagram.com/shripaad_17/',
  instagramDisplay: '@shripaad_17',
  demoSite: 'https://skylinevillas-puce.vercel.app/',
  location: 'Hyderabad, India',
};

export const NAV_LINKS = [
  { id: 'ugc', label: 'UGC ads' },
  { id: 'services', label: 'Services' },
  { id: 'work', label: 'Work' },
  { id: 'process', label: 'Process' },
  { id: 'faq', label: 'FAQ' },
];

export const HERO = {
  badge: 'For brands and online stores',
  lead: "I'm Shripaad. I make UGC-style video ads, AI product videos, 3D product renders, websites and web apps for brands, so you can test fresh ads every week and turn more visitors into buyers.",
};

/** Sample notifications floating around the hero headline (wide screens only). */
export const HERO_CARDS = [
  { icon: 'play', title: '5 new ads ready', text: '9:16, for Reels and TikTok' },
  { icon: 'bolt', title: 'Hook B is winning', text: 'Test three angles at once' },
  { icon: 'cube', title: '3D render done', text: 'Your product, any angle' },
  { icon: 'inbox', title: 'New order', text: 'From your website' },
] as const;

/** The row of services under the intro video. */
export const CHIPS = [
  { icon: 'play', label: 'UGC video ads' },
  { icon: 'eye', label: 'AI product videos' },
  { icon: 'cube', label: '3D product renders' },
  { icon: 'web', label: 'Websites and web apps' },
  { icon: 'chat', label: 'AI chat assistants' },
  { icon: 'repeat', label: 'Follow-up automation' },
] as const;

/** Sample UGC ads shown in phone frames. Files live in public/media/ugc. */
export const UGC_SAMPLES: { id: string; product: string; angle: string; src: string; poster: string }[] = [
  { id: 'wildgold', product: 'Wild Gold', angle: 'Tallow balm, skincare routine', src: 'media/ugc-wildgold.mp4', poster: 'img/ugc/wildgold.webp' },
  { id: 'fresco', product: 'Fresco Sauce', angle: 'Hot sauce, taste test', src: 'media/ugc-fresco.mp4', poster: 'img/ugc/fresco.webp' },
  { id: 'littleseed', product: 'Little Seed Farm', angle: 'Deodorant, quick demo', src: 'media/ugc-littleseed.mp4', poster: 'img/ugc/littleseed.webp' },
  { id: 'whaling', product: 'Old Whaling Co.', angle: 'Body butter, seasonal hook', src: 'media/ugc-whaling.mp4', poster: 'img/ugc/whaling.webp' },
];

/** The UGC ad section: the starter offer and how it works. */
export const UGC = {
  price: '$50',
  pack: '5 UGC video ads',
  includes: [
    '5 vertical video ads (9:16) for Reels, Stories and TikTok',
    'A different hook and angle in each one, ready to test',
    'Bold captions, so they work with the sound off',
    'Yours to keep and run as often as you like',
  ],
  steps: [
    { title: 'Send me your product', text: 'A link to the product page is enough. No shipping, no samples.' },
    { title: 'I write the hooks', text: 'Problem, demo, comparison, offer: one angle per ad, written for your customer.' },
    { title: 'Get your ads in 3 days', text: 'Ready-to-run MP4 files, plus one round of changes.' },
  ],
  note: 'The presenters in these ads are made with AI. That is what keeps them fast and affordable. Meta and TikTok ask advertisers to label realistic AI content, and I will show you where to switch that on.',
};

export const GROWTH = [
  {
    id: 'ugc',
    title: 'UGC-style video ads',
    text: 'Short vertical ads where a presenter shows your product and talks to camera, so you can test new hooks every week without hiring creators or shipping samples.',
    tags: ['UGC ads', 'Hooks to test', 'Reels and TikTok'],
  },
  {
    id: 'web',
    title: 'Websites and web apps',
    text: 'A fast, clear website or store, a redesign of the one you have, or a custom web app with sign-in and AI built in.',
    tags: ['New websites', 'Web apps', 'Landing pages'],
  },
  {
    id: 'render',
    title: '3D product renders and AI video',
    text: 'Studio-quality 3D renders of your product from any angle, and AI-made product videos for launches, listings and ads.',
    tags: ['3D renders', 'Product videos', 'Launch content'],
  },
  {
    id: 'reply',
    title: 'Replies and follow-ups that run themselves',
    text: 'Chat and WhatsApp assistants that answer customer questions in seconds, and follow-ups that bring quiet leads back.',
    tags: ['Chat assistant', 'WhatsApp', 'Follow-ups'],
  },
] as const;

/** Recent work, in the Work section. */
export const WORK = [
  {
    id: 'relay',
    title: 'Relay.ai',
    kind: 'AI web app, built end to end',
    text: 'An AI assistant for work. It turns meetings and email into tasks, drafts replies and books meetings, and nothing is sent until you approve it.',
    tags: ['Next.js', 'Supabase', 'Gemini AI', 'Gmail and Calendar'],
    video: 'media/relay-tour.mp4',
    poster: 'img/work/relay-poster.webp',
    href: 'https://relay-ai-ivory-chi.vercel.app/',
    host: 'relay-ai-ivory-chi.vercel.app',
    cta: 'Open the live app',
    label: 'Web app',
  },
  {
    id: 'flowstack',
    title: 'FlowStack AI',
    kind: 'AI automation marketplace',
    text: 'A storefront for ready-made AI automations. Businesses browse workflows, see how each one works step by step, and launch it in a test space before it goes live.',
    tags: ['React', 'Vite', 'Supabase', 'GSAP motion'],
    video: 'media/flowstack-tour.mp4',
    poster: 'img/work/flowstack-poster.webp',
    href: 'https://flowstack-ai-eta.vercel.app/',
    host: 'flowstack-ai-eta.vercel.app',
    cta: 'Open the live site',
    label: 'Web app',
  },
  {
    id: 'skyline',
    title: 'Skyline Villas',
    kind: 'Website, 3D model and AI assistant',
    text: 'A premium website for a villa developer, with a 3D model buyers can rotate and an assistant that answers price questions.',
    image: 'img/work/skyline-site.webp',
    href: 'https://skylinevillas-puce.vercel.app/',
    cta: 'Open the website',
    label: 'Real estate website',
  },
  {
    id: 'villa',
    title: 'Villa turntable',
    kind: '3D animation',
    text: 'The Skyline villa model, rendered as a turntable clip for ads and listings.',
    video: 'media/villa-orbit.mp4',
    poster: 'img/work/villa-orbit-poster.webp',
    label: '3D render',
  },
] as const;

/** Product renders in the Work gallery. All are concept brands made for the portfolio. */
export const RENDERS = [
  {
    id: 'solenne',
    name: 'Solenne serum',
    kind: 'Concept brand',
    image: 'img/renders/solenne.webp',
    alt: 'Amber glass serum bottle and jar on stone blocks, striped with window-blind shadows',
    tone: '#d9c3ad',
  },
  {
    id: 'fuego',
    name: 'Fuego Lento hot sauce',
    kind: 'Concept brand',
    image: 'img/renders/fuego.webp',
    alt: 'Red hot sauce bottle and two chillies on a cobalt blue backdrop',
    tone: '#2747a8',
  },
  {
    id: 'ember',
    name: 'Ember & Oak candle',
    kind: 'Concept brand',
    image: 'img/renders/ember.webp',
    alt: 'Lit candle in an amber glass tumbler with a cream label, on a wooden table',
    tone: '#3a2a20',
  },
  {
    id: 'tide',
    name: 'Tidewater soap',
    kind: 'Concept brand',
    image: 'img/renders/tide.webp',
    alt: 'Three bars of soap in cream, sage and terracotta stacked on a wooden soap dish',
    tone: '#a9b8a7',
  },
  {
    id: 'nova',
    name: 'NOVA headphones',
    kind: 'Concept brand',
    image: 'img/work/nova-hero.webp',
    alt: 'Black over-ear headphones on a dark background, 3D hero render',
    tone: '#111216',
  },
  {
    id: 'nova-detail',
    name: 'NOVA, close-up',
    kind: 'Concept brand',
    image: 'img/work/nova-detail.webp',
    alt: 'Close-up of the NOVA headphone ear cup with its red ring',
    tone: '#111216',
  },
] as const;

export const DEMOS = [
  {
    id: 'voice',
    title: 'AI voice receptionist',
    blurb:
      "Picks up when your team can't, answers questions about your listings, and books viewings straight into your calendar.",
  },
  {
    id: 'email',
    title: 'Email lead qualification',
    blurb:
      'Replies to every new enquiry within a minute, asks the questions an agent would, and flags the serious buyers.',
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp assistant',
    blurb:
      'Answers people who message you from your ads, shares listings that match, and hands hot leads to your agents.',
  },
  {
    id: 'followup',
    title: 'Automatic follow-up',
    blurb:
      'Leads who go quiet get a friendly nudge by email or WhatsApp, and it stops the moment they reply.',
  },
] as const;

export const REASONS = [
  {
    icon: 'person',
    title: 'Talk to the person doing the work',
    text: 'You message me and I reply. There are no account managers in between.',
  },
  {
    icon: 'eye',
    title: 'You review every stage',
    text: 'You see the work as it takes shape and ask for changes before anything goes live.',
  },
  {
    icon: 'tag',
    title: 'One fixed price',
    text: 'Agreed before I start, so there are no hourly bills or surprises.',
  },
  {
    icon: 'clock',
    title: 'Hours that suit you',
    text: "I'm in India (UTC+5:30) and take calls during your working day in the UAE, UK, US or Australia.",
  },
] as const;

export const STEPS = [
  {
    title: 'Get in touch',
    time: 'Day 1',
    text: "Tell me about your brand and what you sell. I'll look at your ads, website and social pages and suggest where to start.",
  },
  {
    title: 'Plan and price',
    time: 'Day 1 to 2',
    text: "You get a clear plan, the timeline and one fixed price before any work starts. Ad packs start at $50 for 5 ads.",
  },
  {
    title: 'Make and review',
    time: '3 days to 4 weeks',
    text: 'Ads take about 3 days, a website two to four weeks. You review the work and ask for changes before anything goes live.',
  },
  {
    title: 'Launch and improve',
    time: 'After launch',
    text: "You get the final files or the live site. When you know which ads win, I make more like them.",
  },
];

export const FAQS = [
  {
    q: 'Are the people in the ads real?',
    a: 'No. The presenters are made with AI, which is why the ads are fast and affordable. They show and talk about your product, and they never claim to be real customers. Meta and TikTok ask advertisers to label realistic AI content, and I will show you how.',
  },
  {
    q: 'What do you need from me?',
    a: "A link to your product page, and anything you'd like the ads to say. I take it from there. You don't need to send samples.",
  },
  {
    q: 'What does it cost?',
    a: 'A starter pack of 5 UGC video ads is $50. Websites, 3D renders and assistants are priced per project, with one fixed price agreed before I start.',
  },
  {
    q: 'How long does it take?',
    a: 'About 3 days for an ad pack, one to two weeks for 3D renders or an assistant, and two to four weeks for a full website.',
  },
  {
    q: 'Can I run the ads on Facebook, Instagram and TikTok?',
    a: 'Yes. You get vertical MP4 files sized for Reels, Stories and TikTok, and you own them.',
  },
  {
    q: 'Is it just you?',
    a: 'Yes. You work directly with me, from the first message to the final files. I take on a few projects at a time so each one gets proper attention.',
  },
  {
    q: 'What time zone are you in?',
    a: "I'm in India (UTC+5:30) and keep flexible hours, so I can take calls during your working day in the US, UK, UAE or Australia.",
  },
];
