# Personal Website — Strategy & Objectives

> This is not a revenue business. It is a personal website — a reputation and thinking
> surface for one person. This document frames it the way a business plan frames a company:
> purpose and goals, who it serves, how success is measured, how it grows, what it costs to
> run, and a twelve-month roadmap. Where the positioning implies a light form of "return"
> (inbound opportunities, an eventual newsletter), that is treated as the model — but the
> honest baseline is that this site is a cost center measured in tens of dollars a year,
> optimized for the right reader rather than the most readers.

Companion docs: [`POSITIONING.md`](POSITIONING.md) (audience, voice), [`SYSTEM_DESIGN.md`](SYSTEM_DESIGN.md)
(architecture), [`LAUNCH_READINESS.md`](LAUNCH_READINESS.md) (what remains before launch),
[`SECURITY.md`](SECURITY.md) (threat model).

---

## 1. Purpose

A single owned home on the internet for Andre Ruiz Loera that outlasts any platform feed and
represents the work, the reading, and the thinking in one calm, fast, ad-free place. It exists
to convert a name into a credible, specific impression — for recruiters, admissions and hiring
committees, potential collaborators, and curious readers — through substance rather than
assertion.

The site is deliberately not monetized today. Its "profit" is reputational and optional:
opportunities that arrive because someone read a page and reached out. That framing keeps the
incentives clean — the medium (no tracking, no ads, no growth-hacking) reinforces the message
that this is careful, owned work.

---

## 2. Goals (12-month objectives)

Ordered by importance, not by ease.

1. **Be the canonical link.** The one URL that goes in a resume, an email signature, a DM, or
   an application — and lands well within ten seconds of a busy reader's attention.
2. **Show depth, do not claim it.** Ship enough annotations and essays that a professor or a
   quant recruiter can point to something specific.
3. **Build a durable, compounding record.** A growing archive of notes and essays owned
   outright, not rented from a social platform.
4. **Stay effortless to maintain.** Keep authoring friction low enough (copy a template, edit
   text, push) that the site survives busy semesters.
5. **Look right when shared.** Basic SEO and social-card hygiene so a pasted link previews
   cleanly.

Explicit non-goals: traffic-maximization, SEO ranking races, follower counts, virality. Those
would distort the content toward the wrong reader.

---

## 3. Audience Served (the "market")

In rough priority order (from `POSITIONING.md`):

| Segment | What they want | What the site gives them |
|---|---|---|
| Recruiters / admissions / hiring committees | Fast signal on seriousness and fit | A sharp About page, annotations that show *how* he reads, honest research/press surfaces |
| Collaborators and peers | Shared-interest signal and a way to reach out | Reading lists, essays, a clear contact path |
| Curious readers | A good read worth returning to | Blog posts, curated lists, a calm reading experience |
| Future self | A personal knowledge base | Structured annotations and lists worth keeping for their own sake |

The highest-value visitors arrive by direct link, which is why discoverability is intentionally
modest and reach is not the objective.

---

## 4. Success Metrics

Because this is a personal site, most signals are qualitative. A small number are quantifiable
and worth watching without being optimized for.

**Primary (qualitative, leading indicators of the goal):**

- A recruiter or professor cites something specific ("I saw your notes on ...") — proof the
  site was read, not skimmed.
- The URL becomes the default thing Andre shares.
- Inbound contact (collaboration, opportunity, or thoughtful reader mail) traceable to the site.
- The archive keeps growing — new notes and posts keep landing.

**Secondary (quantitative, watched not chased):**

| Metric | Instrument | 12-month target (modest by design) |
|---|---|---|
| Unique visitors / month | Privacy-respecting analytics (see below) or host logs | Steady, non-zero; no growth quota |
| Pages per session on annotations/blog | Analytics | Deep reads over shallow bounces |
| Inbound contacts / semester | Manual tally | A handful of *relevant* ones beats volume |
| Content cadence | Git history | At least one substantive annotation or post per active month |
| Core Web Vitals / Lighthouse | Lighthouse CI or manual | 95+ performance, 100 accessibility |

Analytics, if added, must be cookieless and privacy-first (e.g. a self-hosted or minimal
provider). Given the non-goals, running with no analytics at all is an acceptable and even
principled choice — the primary signals above do not depend on a dashboard.

---

## 5. Content & Growth Strategy

Growth here means *depth and the right reach*, not audience maximization.

**Content strategy (per section):**

- **About** — short and human; the first thing recruiters read. Keep it sharp.
- **Blog** — fewer, better essays on mathematics, markets, and craft. Quality over cadence.
- **Annotations** — the intellectual core and strongest differentiator; structured reading
  notes with real math rendered properly.
- **Reading Lists** — curated taste across twelve domains; the move is to link entries to
  annotations as they are written, turning lists into a navigable map of the work.
- **Research / Press** — credibility surfaces filled only as real items exist; never padded.

**Channels (how the right readers arrive):**

- **Direct link** (primary) — resume, email signature, applications, DMs. The site is designed
  to reward exactly this path.
- **Word of mouth / citation** — a good annotation or essay gets linked or forwarded.
- **Search** (secondary) — once basic SEO ships (meta descriptions, Open Graph, sitemap), pages
  become findable for their specific topics.
- **Cross-post excerpts** — optional, occasional pointers from existing profiles (X, GitHub,
  LinkedIn) back to canonical pages here, keeping the site the source of record.

**Optional light "model" (only if pursued):** the positioning leaves room for an eventual
low-key newsletter (readers who want new annotations/essays by email). If added, it should be a
privacy-respecting list (double opt-in, no selling data, easy unsubscribe) whose only "revenue"
is a warmer, returning audience — not paid subscriptions. Any consulting or paid work would live
off-site; the website stays a portfolio, not a storefront.

---

## 6. Cost to Run

Deliberately minimal. The architecture (static, no build, no backend) keeps recurring cost near
zero.

| Item | Provider (typical) | Annual cost |
|---|---|---|
| Hosting | GitHub Pages (current) — free for public user sites | $0 |
| TLS / HTTPS | Included by host | $0 |
| Custom domain (optional) | Registrar (e.g. `.com`) | ~$10–15/yr |
| Analytics (optional) | Cookieless/self-hosted or none | $0–9/mo if a paid provider is chosen |
| Newsletter (optional, only if pursued) | Free tier of a privacy-respecting provider | $0 until list grows |
| Form handler (optional, if a contact form replaces mailto) | Serverless free tier | $0 at this scale |
| Developer time | The real cost | Author's hours |

Realistic steady state: **$0–15/year** (just a domain if one is bought). The binding constraint
is authoring time, not money or infrastructure.

---

## 7. Twelve-Month Roadmap

Aligned with the phased roadmap in `SYSTEM_DESIGN.md`, expressed as quarters.

| Quarter | Focus | Concrete deliverables |
|---|---|---|
| **Q1** | Make the scaffold credible | Real bio and working social/email links on About; first research and press entries; decide root vs. `site/` landing; ship launch hardening (headers/CSP), meta descriptions on key pages |
| **Q2** | Show substance | Publish the math annotations whose LaTeX sources already exist; begin linking reading-list items to annotations; one strong new essay |
| **Q3** | Shareability and reach | Open Graph / Twitter cards, `sitemap.xml`, `robots.txt`; optional custom domain (`CNAME` + DNS); decide analytics (cookieless) or none; optional newsletter opt-in if pursued |
| **Q4** | Maintainability and compounding | De-duplicate the nav via a tiny include/minimal generator; optional client-side search; a steady cadence of at least one substantive addition per active month |

Success at the end of twelve months is not a traffic number — it is that the site is the thing
Andre reaches for when someone asks "where can I read more about you?", and that the answer keeps
getting better.
</content>
</invoke>
