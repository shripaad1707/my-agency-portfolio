# Shripaad's Agency

My agency portfolio. A one-page site for my work: websites, AI chat and voice assistants, automatic follow-ups and video for real estate teams and growing agencies.

Built with React, Vite, Tailwind CSS, Motion and Lenis.

## Edit the words

Most of the text lives in `src/content.ts`:
- contact details
- the hero line and the cards
- the automation examples
- the reasons, the process steps and the FAQ

The headlines are in each section's file in `src/components/`.

## Run it on your computer

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Put it online with Vercel

**Option 1: through GitHub**
1. Push this folder to a GitHub repository. `node_modules` and `dist` are already ignored.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Vercel detects Vite. Keep the defaults: the build command is `npm run build` and the output directory is `dist`.
4. Click **Deploy**.

**Option 2: from your terminal**
```bash
npm i -g vercel
vercel
```

### Link previews

Link previews on WhatsApp, LinkedIn and in email use `public/img/og.jpg`. On Vercel the full image address is filled in automatically. If you add your own domain, set this environment variable in Vercel and redeploy:

```
VITE_SITE_URL=https://yourdomain.com
```

## Contact form

The contact form sends each message straight to shripaad17@gmail.com through [FormSubmit](https://formsubmit.co). Visitors don't need an email app.

The first time someone sends the form, FormSubmit emails you an **Activate Form** link. Click it once. Messages before that point are not delivered. To use a different inbox, change `email` in `src/content.ts`.

## Media

- `public/media/intro.mp4` is the 90-second vertical intro (1080x1920, H.264). `public/media/intro.webm` is a smaller VP9 copy for browsers that can't play mp4.
- `public/img/intro-poster.webp` is the still that shows before the video plays.
- The jump-to chapters under the video are `INTRO_CHAPTERS` in `src/content.ts` (times in seconds).
- `public/img/shripaad.webp` is the portrait.
