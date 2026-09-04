# Aryan Cyber Solutions

Enterprise cybersecurity company website built with Next.js 15, TypeScript, and Tailwind CSS.

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file:

```
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL=contact@aryancybersolutions.com
FROM_EMAIL=onboarding@resend.dev
```

Get your Resend API key at [resend.com](https://resend.com).

## Features

- Enterprise-grade dark navy design with cyber blue accents
- Responsive layout (desktop, tablet, mobile)
- Contact forms with Resend email integration and auto-reply
- Consultancy and internship form tabs with validation
- Course curriculum accordions for internship programs
- SEO metadata and accessibility support
- Lazy-loaded images and GPU-friendly animations

## Production Build

```bash
npm run build
npm start
```

## Deploy

Deploy to [Vercel](https://vercel.com) or any Node.js hosting platform. Set environment variables in your deployment dashboard.
