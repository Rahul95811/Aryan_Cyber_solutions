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
ACS_RESEND_API_KEY=re_your_api_key_here
ACS_CONTACT_TO_EMAIL=sriaryan.dev@gmail.com
ACS_RESEND_FROM_EMAIL="Aryan Cyber Solutions <onboarding@resend.dev>"
ACS_TRAINING_ADMIN_EMAIL=sriaryan.dev@gmail.com
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/acs_training?retryWrites=true&w=majority
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
