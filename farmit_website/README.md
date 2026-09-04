# FarmIt public website

Next.js landing site for FarmIt — WhatsApp-first AI farming assistant for Zimbabwe.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## WhatsApp CTA

Set your business number (digits only, with country code) so “Chat on WhatsApp” links work:

```bash
# .env.local
NEXT_PUBLIC_WHATSAPP_NUMBER=2637XXXXXXXX
FARMIT_API_URL=http://localhost:8080
```

Optional: update `hello@farmit.co.zw` in `lib/site.ts` if you use a different contact email.
