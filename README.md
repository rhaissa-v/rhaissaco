# rhaissa.co — Personal mentoring & advisory site [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A conversion-focused landing page for my 1:1 mentoring, product & growth strategy, and advisory work.

**Live:** [rhaissa.co](https://rhaissa.co) · **Repo:** [github.com/rhaissav-source/rhaissaco](https://github.com/rhaissav-source/rhaissaco) · **Built with:** [Lovable](https://lovable.dev) · **Refined by hand:** copy, information architecture, and product decisions.

---

## Why this repo exists

I'm a Product Leader with 10+ years shipping digital products, and I'm increasingly working as an **AI builder** — using AI tooling to go from idea to shipped product fast, with product judgment guiding every decision.

This site is a small, honest example of that. The interesting part isn't the code — it's the *decisions*. This README documents how I thought about the problem, so you can see the reasoning, not just the result.

## The build: AI-assisted, product-led

I built the first version in **Lovable** and then refined it by hand. I'm transparent about that on purpose: knowing *which* tool to reach for and *what to change after it generates* is the skill, not typing every line from scratch.

What Lovable handled: scaffolding, responsive layout, component structure, deploy.

What I owned: everything that actually makes the page convert — the story, the order, the offer, and the words. I also handled the pieces around the build: buying the domain through **GoDaddy** and wiring up the third-party **integrations via connectors** (Google Calendar, Gmail, Google Sheets, Stripe) so booking, notifications, and payments work end to end.

## Product decisions I made

These are the calls that mattered more than any line of code:

**Storytelling order — Proof before Offer.** I structured the page as Hero → credibility (stats + selected work) → services → testimonials → CTA. Reasoning: asking someone to buy *before* proving value loses them. When the offer appears, the visitor is already convinced of the background, so the price reads as cheap instead of risky. A CTA also lives in the hero for returning visitors who arrive ready to book.

**Each service explains method + deliverable, not just topics.** Early drafts listed themes ("bring anything: career, growth, interview prep"). That describes *what* but not *how* or *what you leave with*. I rewrote each service around a fixed spine — For whom · What I do · How I work · What you leave with — because the value of mentoring is the structure, and the site should show it.

**Method framed as adaptive.** For 1:1 mentoring I made the method explicitly flexible (design thinking, PM frameworks, or Management 3.0 depending on the problem), with room for an exploratory, provocation-led part when the goal is finding the real problem statement. This matches how I actually work and widens the audience beyond product/tech.

**Positioning tuned for market weight.** The hero balances executive credibility (scale, metrics) with a human, approachable tone — without framing mentoring as an after-hours hobby, which would undercut the value.

**Chose a more robust setup from day one.** Rather than ship a static page and retrofit infrastructure later, I opted for a build that supports real integrations upfront — **Google Calendar** for booking and **Stripe** for payments. Stripe is configured to charge in **USD or BRL**, so the solution serves both my international and Brazilian audiences without friction. Paying for that robustness early avoids a painful rebuild once bookings scale.

**Bilingual by design.** The platform runs in **English and Portuguese** end to end — not just the marketing copy, but the whole experience — so mentees from either audience feel the product was built for them, not translated as an afterthought.

**Social proof curated by hand.** I didn't auto-pull testimonials. I manually read through my reviews and history across my own channels (**LinkedIn**) and the mentoring platforms I'd used before — **ADPList** and **GrowthMentor** — and selected the ones that best show how I actually work. Those platforms got me started, but I still depended on their partnerships to handle payments; owning this site is the step toward running booking and payments myself.

## Architecture & booking flow

The booking journey is intentionally short and self-contained:

1. Visitor picks a service and an available time slot (Tue–Thu, two windows per day, shown in the user's local timezone).
2. Stripe checkout opens in the right currency (USD or BRL).
3. After successful payment, a server-side webhook:
   - checks Google Calendar free/busy time to avoid double bookings,
   - creates the calendar event with a Google Meet link,
   - stores the booking record,
   - sends a confirmation email in the chosen language.
4. The user lands on a `/booked` confirmation page with session details and the calendar link.

This removes the manual back-and-forth that usually happens on mentoring platforms and gives me full ownership of the relationship.

## Custom scope requests (partnership form)

Alongside the three bookable offers, the site has a fourth, price-less **"Custom scope / Long-term Partnership"** offer. Instead of Stripe, its CTA — *"Submit request"* — opens a dedicated `/partnership` page styled like the booking page: context and expectations on the left, a short form on the right (Full name · Email · "How can I help you?", all required).

Instead of relying on a Google Form embed, submissions are handled natively and fanned out to two Google channels via connectors:

1. The request is validated (Zod) and stored in the database.
2. A notification **email lands in my Gmail** (`rhaissavitor@gmail.com`), with the requester's address as Reply-To so I can answer in one click.
3. The same request is **appended as a row in a Google Sheet** — giving me the structured, exportable list of answers a Google Form would have produced, without sending visitors to an external form.

The visitor always sees the confirmation once the request is saved; notification issues are logged on my side instead of being shown to them, so a saved lead never looks lost.

Why this way: I get the exact workflow I wanted from Google Forms (collect + review answers from my Gmail account) while keeping the visitor on my own site, in my design system, bilingual.

## Project structure

```
src/
  content/           # Copy in EN and PT + i18n helpers
  routes/            # TanStack Start file-based routes
  components/        # Shared UI components
  lib/               # Server functions, booking logic, Stripe helpers
  integrations/      # Supabase, Google Calendar, auth middleware
  styles.css         # Tailwind v4 theme and tokens
```

## Stack

- **TanStack Start** — full-stack React framework with server functions
- **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** components
- **Lovable Cloud** — backend, auth, and database (Supabase under the hood)
- **Google Calendar API** — availability checks and event creation
- **Gmail** — notification emails for custom scope requests (sent from my own account)
- **Google Sheets** — every custom scope request logged as a row, replacing a Google Form
- **Stripe** — payment checkout (USD / BRL)
- **Lovable email domain** — confirmation emails

## Running locally

The repo uses `bun`:

```bash
bun install
bun run dev
```

The dev server starts at `http://localhost:8080`.

## Deploy

Frontend deploys via **Lovable Publish** — click the Publish button in the editor and then Update in the publish dialog to push changes live.

- **Preview URL:** `https://id-preview--03a3d69a-f891-4b0d-98f0-ad4cfacde6ad.lovable.app`
- **Production URL:** `https://rhaissa.lovable.app`
- **Custom domains:** `rhaissa.co` and `www.rhaissa.co`

Backend changes (server functions, database, webhooks) deploy automatically when saved. Frontend changes need an explicit publish update to reach production.

## Environment variables

Secrets are managed inside Lovable and never committed. The app expects variables like these (names only, no values):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- Stripe keys (public and secret)
- Google OAuth / Calendar API credentials
- Email domain configuration

If you clone this repo, you'll need to wire up your own Lovable project or Supabase backend and reconnect the integrations.

## What I'd do next

- Add **Pix** as a payment method alongside Stripe, to make booking effortless for the Brazilian audience.
- Add a lightweight "How it works" 3-step section above services to reduce friction for first-time mentees.
- A/B test the hero headline.
- Grow this into a small portfolio of AI-built projects, each documented like this one.

---

Built and maintained by **Rhaissa "Ray" Vitor** — Staff Product Manager · Mentor · Advisor.
[rhaissa.co](https://rhaissa.co) · [LinkedIn](https://www.linkedin.com/in/rhaissavitor/)
