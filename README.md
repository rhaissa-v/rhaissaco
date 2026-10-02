# rhaissa.co — Product leadership, mentoring & consultancy [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A bilingual site for my 1:1 mentoring, focused product sessions, and hands-on consultancy with founders and companies.

**Live:** [rhaissa.co](https://rhaissa.co) · **Repo:** [github.com/rhaissa-v/rhaissaco](https://github.com/rhaissa-v/rhaissaco) · **Built with:** [Lovable](https://lovable.dev) · **Refined by hand:** copy, information architecture, and product decisions.

---

## Why this repo exists

I'm a Product Leader with 10+ years shipping digital products, and I'm increasingly working as an **AI builder** — using AI tooling to go from idea to shipped product fast, with product judgment guiding every decision.

This site is a small, honest example of that. The interesting part isn't the code — it's the *decisions*. This README documents how I thought about the problem, so you can see the reasoning, not just the result.

## The build: AI-assisted, product-led

I built the first version in **Lovable** and then refined it by hand. I'm transparent about that on purpose: knowing *which* tool to reach for and *what to change after it generates* is the skill, not typing every line from scratch.

What Lovable helped with: scaffolding, responsive layout, component structure, and deployment.

What I owned: the story, the order, the offers, and the words. I also connected the domain and the services behind the booking and request flows: Google Calendar, Gmail, Google Sheets, and Stripe.

## Product decisions I made

These are the calls that mattered more than any line of code:

**Storytelling order — proof before offer.** The homepage opens with my positioning, then shows experience, recognition, and selected work before the ways to work together, mentee reviews, and a closing invitation. My intention is to give visitors context before asking them to choose a service. There is also an early link for people ready to book.

**Each service explains method + deliverable, not just topics.** Early drafts listed themes ("bring anything: career, growth, interview prep"). That describes *what* but not *how* or *what you leave with*. I rewrote each service around a fixed spine — For whom · What I do · How I work · What you leave with — because the value of mentoring is the structure, and the site should show it.

**Method framed as adaptive.** For 1:1 mentoring I made the method explicitly flexible (design thinking, PM frameworks, or Management 3.0 depending on the problem), with room for an exploratory, provocation-led part when the goal is finding the real problem statement. This matches how I actually work and widens the audience beyond product/tech.

**Positioning tuned for market weight.** The hero balances executive credibility (scale, metrics) with a human, approachable tone — without framing mentoring as an after-hours hobby, which would undercut the value.

**Built the booking flow into the site.** Rather than link out to a separate scheduling page, I use **Google Calendar** to check availability and create invites, and **Stripe** to take payment. The three public sessions are priced in USD ($35, $35, and $90); Brazilian visitors can contact me about alternative payment methods.

**Bilingual by design.** The platform runs in **English and Portuguese** end to end — not just the marketing copy, but the whole experience — so mentees from either audience feel the product was built for them, not translated as an afterthought.

**Social proof curated by hand.** I didn't auto-pull testimonials. I read through my reviews and history across **LinkedIn**, **ADPList**, and **GrowthMentor**, and selected the ones that best show how I work. Having my own site lets visitors book and pay here rather than depend on a mentoring platform for that step.

## Architecture & booking flow

The booking journey is intentionally short and self-contained:

1. A visitor chooses General Mentoring ($35, one 60-minute call), Product Strategy ($35, one 60-minute call), or Leadership ($90, three 60-minute calls; the first is scheduled now). Open first-call slots are Monday, Tuesday, and Thursday at 18:00 São Paulo time, displayed in the visitor's local timezone. Calendar availability and existing reservations are checked before checkout.
2. Stripe Checkout collects payment in USD while the chosen time is held briefly.
3. Once payment is verified, the booking is finalized and a Google Calendar invitation with a Meet link is sent to the guest. I receive a separate booking notification. For a three-call package, we arrange the remaining two calls together.
4. The visitor sees their session details and meeting link on the `/booked` confirmation page.

This removes the manual back-and-forth that usually happens on mentoring platforms and gives me full ownership of the relationship.

## Custom scope requests (consultancy form)

Alongside the three bookable offers, the site has a fourth offer: **Long-term Consultancy**, with a custom scope rather than a fixed price. It supports consulting engagements or fractional leadership for companies and founders at a weekly or monthly cadence. Instead of Stripe, its *"Submit request"* link opens `/partnership`, with context on one side and a short form on the other (Full name · Email · "How can I help you?", all required).

Instead of relying on a Google Form embed, submissions are handled on the site:

1. The request is validated (Zod) and stored in the database.
2. The site attempts to send me a **Gmail notification**, with the requester's address as Reply-To.
3. It also attempts to **append the request to a Google Sheet** for a structured, exportable list.

The visitor always sees the confirmation once the request is saved; notification issues are logged on my side instead of being shown to them, so a saved lead never looks lost.

Why this way: I get the exact workflow I wanted from Google Forms (collect + review answers from my Gmail account) while keeping the visitor on my own site, in my design system, bilingual.

## Project structure

```
src/
  content/           # Copy in EN and PT + i18n helpers
  routes/            # TanStack Start file-based routes
  components/        # Shared UI components
  lib/               # Server functions, booking logic, Stripe helpers
  integrations/      # Backend client and auth helpers
  styles.css         # Tailwind v4 theme and tokens
```

## Stack

- **TanStack Start** — full-stack React framework with server functions
- **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** components
- **Lovable Cloud** — backend and database
- **Google Calendar API** — availability checks and event creation
- **Gmail** — notifications to me for paid bookings and consultancy requests
- **Google Sheets** — a second channel for logging consultancy requests
- **Stripe** — USD payment checkout for bookable sessions

## What I'd do next

- Add **Pix** as a payment method alongside Stripe, to make booking effortless for the Brazilian audience.
- Make the booking process clearer for first-time mentees.
- A/B test the hero headline.
- Grow this into a small portfolio of AI-built projects, each documented like this one.

---

Built and maintained by **Rhaissa V.** (aka Ray) — Product Leader · Mentor · Consultant.
[rhaissa.co](https://rhaissa.co) · [LinkedIn](https://www.linkedin.com/in/rhaissavitor/)
