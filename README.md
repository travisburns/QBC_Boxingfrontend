# Apex Athletic — Frontend

Marketing site + member portal + Square checkout for the Apex Athletic gym.
Mobile-first, dark theme with a single electric-green accent.

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- **Fonts:** Anton (display) + Inter (body), self-hosted via `next/font`
- **Payments:** Square Web Payments SDK (client-side card tokenization)

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run dev                    # http://localhost:3000
```

## Environment

Only **publishable** values live in `NEXT_PUBLIC_*` — never the Square access
token or webhook keys (those stay on the backend). See `.env.example`:

| Variable                          | What it is                                  |
|-----------------------------------|---------------------------------------------|
| `NEXT_PUBLIC_API_BASE_URL`        | Base URL of the .NET backend                |
| `NEXT_PUBLIC_SQUARE_ENV`          | `sandbox` or `production`                    |
| `NEXT_PUBLIC_SQUARE_APP_ID`       | Square Application ID (publishable)         |
| `NEXT_PUBLIC_SQUARE_LOCATION_ID`  | Square Location ID                          |

## Structure

```
src/
├─ app/                    # routes (App Router)
│  ├─ page.tsx             # home (hero, stats, offerings, coaches, CTA)
│  ├─ membership/          # pricing + FAQ
│  ├─ classes/             # weekly schedule
│  ├─ trainers/            # coach grid
│  ├─ contact/             # contact form + location
│  ├─ login, register/     # auth
│  ├─ account/             # protected member portal
│  ├─ checkout/            # Square payment flow
│  └─ legal/               # terms, privacy
├─ components/
│  ├─ site/                # Header (mobile drawer), Footer, PageHero
│  ├─ ui/                  # Button, Container, Bits (Eyebrow/Heading/…)
│  ├─ home/                # PlanCard
│  ├─ auth/                # AuthShell
│  └─ checkout/            # SquarePaymentForm (SDK integration)
└─ lib/                    # api client, auth context, plans, square, types
```

## How payments work (frontend side)

1. The checkout page mounts `SquarePaymentForm`, which loads the Square Web
   Payments SDK and renders Square's secure card fields.
2. On submit, the card is **tokenized in the browser**. The raw card number
   never reaches our code.
3. We POST only the single-use token to the backend, which talks to Square.

If `NEXT_PUBLIC_SQUARE_APP_ID` / `LOCATION_ID` aren't set, the payment form
shows a friendly "not configured yet" message instead of breaking.

## Design tokens

All colors, the display/eyebrow type scale, and the hero "glitch" effect are
defined once in `src/app/globals.css` under `@theme`. Swap real photography in
by replacing the `MediaSlot` placeholders with `next/image`.

## Build

```bash
npm run build && npm start
```
