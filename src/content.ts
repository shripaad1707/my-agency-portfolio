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
  { id: 'showreel', label: 'Intro' },
  { id: 'services', label: 'Services' },
  { id: 'examples', label: 'Examples' },
  { id: 'process', label: 'Process' },
  { id: 'faq', label: 'FAQ' },
];

export const HERO = {
  badge: 'For real estate teams and growing agencies',
  lead: "I'm Shripaad. I help you win more clients with websites that bring in enquiries, automations that reply and follow up for you, and videos people actually watch.",
};

/** Sample notifications floating around the hero headline (wide screens only). */
export const HERO_CARDS = [
  { icon: 'inbox', title: 'New enquiry', text: 'From your website' },
  { icon: 'bolt', title: 'Replied in 38 seconds', text: 'By your AI assistant' },
  { icon: 'calendar', title: 'Viewing booked', text: 'Saturday at 11:00' },
  { icon: 'play', title: 'New reel ready', text: '30 seconds, for Instagram' },
] as const;

/** The row of services under the intro video. */
export const CHIPS = [
  { icon: 'web', label: 'Website design' },
  { icon: 'chat', label: 'AI chat and voice agents' },
  { icon: 'bolt', label: 'Workflow automation' },
  { icon: 'repeat', label: 'Lead follow-up' },
  { icon: 'play', label: 'Video editing' },
  { icon: 'cube', label: '3D walkthroughs' },
] as const;

export const GROWTH = [
  {
    id: 'seen',
    title: 'Get seen',
    text: 'Reels, listing videos, ad designs and 3D walkthroughs that make people stop scrolling and remember your name.',
    tags: ['Video editing', 'Ad designs', '3D walkthroughs'],
  },
  {
    id: 'web',
    title: 'Turn visitors into enquiries',
    text: 'A fast, clear website, or a redesign of the one you have, so visitors trust you and know exactly how to get in touch.',
    tags: ['New websites', 'Redesigns', 'Landing pages'],
  },
  {
    id: 'reply',
    title: 'Reply in seconds, day or night',
    text: 'Chat, WhatsApp and voice assistants that answer questions, qualify leads and book calls or viewings for you.',
    tags: ['Chat assistant', 'WhatsApp', 'Voice receptionist'],
  },
  {
    id: 'follow',
    title: 'Follow-ups that run themselves',
    text: 'Every lead lands in your CRM, your team gets a heads-up, and quiet leads get a polite nudge until they reply.',
    tags: ['Lead qualification', 'Follow-ups', 'CRM updates'],
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
    text: "Tell me about your business and goals. I'll look at your website and social pages and suggest where to start.",
  },
  {
    title: 'Plan and price',
    time: 'Days 2 to 3',
    text: "You get a clear plan for what I'll build, the timeline and one fixed price, before any work starts.",
  },
  {
    title: 'Build and launch',
    time: '1 to 4 weeks',
    text: 'We agree a fixed price. I build, you review, and I launch it connected to the tools your team already uses.',
  },
  {
    title: 'Support',
    time: 'After launch',
    text: "Your team gets a short video showing how everything works, and I'm on hand for changes once you're live.",
  },
];

export const FAQS = [
  {
    q: 'Is it just you?',
    a: 'Yes. You work directly with me, from the first message to launch. I take on a few projects at a time so each one gets proper attention.',
  },
  {
    q: 'What does it cost?',
    a: "Every project has a fixed price, agreed before I start and based on what you need. Message me with what you have in mind and I'll send you a quote.",
  },
  {
    q: 'How long does it take?',
    a: 'Most assistants and automations go live within one to two weeks. A full website takes two to four weeks.',
  },
  {
    q: 'Will it work with what we already use?',
    a: "Usually, yes. I connect to the tools you already have, like Gmail or Outlook, WhatsApp Business, Google Calendar, your CRM or a spreadsheet, so your team doesn't have to change how it works.",
  },
  {
    q: 'What time zone are you in?',
    a: "I'm in India (UTC+5:30) and keep flexible hours, so I can take calls during your working day in the UAE, UK, US or Australia.",
  },
  {
    q: 'What if I want changes?',
    a: 'You review the work at each stage, and I make the changes before anything goes live.',
  },
  {
    q: 'Who do you work with?',
    a: 'Mostly real estate teams and small to medium agencies. The same work suits most businesses that get enquiries online and want to answer them faster.',
  },
];
