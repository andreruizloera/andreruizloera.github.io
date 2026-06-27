# Personal Website — System Design

> How a hand-authored, build-free static site stays fast, readable, and durable — and how content flows from a text editor to GitHub Pages.

This document describes the architecture, the page-template convention, the asset pipeline, the authoring and deploy flows, performance & SEO, hosting/reliability, privacy, and a phased roadmap. The guiding principle is **the source is the artifact**: there is no compile step between what is written and what ships, so the site is simple to reason about and effectively impossible to "break the build."

---

## 1. Design Principles

1. **Source is the artifact.** Every page is a finished `.html` file. No generator, bundler, or framework sits between authoring and deploy — fewer moving parts, nothing to rot.
2. **One stylesheet, many pages.** A single `style.css` with CSS custom properties is the design system. Theme, spacing, and typography change in one place.
3. **Content over chrome.** Serif body text, a narrow reading measure, and restraint with motion. Effects are opt-in per page, never global.
4. **Accessible and motion-safe by default.** Skip links, visible focus, ARIA labels, and `prefers-reduced-motion` are baked into the shared CSS, not bolted on.
5. **Privacy by omission.** No analytics, no third-party fonts, no trackers. The only external request is MathJax, and only on pages that render math.
6. **Cheap to extend.** Adding content means copying a template and editing text — a workflow that survives long gaps between updates.

---

## 2. High-Level Architecture

```
   AUTHOR (local editor)
   ┌───────────────────────────────────────────────┐
   │  hand-written .html pages                       │
   │  shared style.css (CSS custom properties)       │
   │  templates/  (annotation .html + .tex)          │
   │  LaTeX notes → pdflatex/xelatex → .pdf          │
   └───────────────────────┬─────────────────────────┘
                           │  git commit + push (main)
                           v
   SOURCE = ARTIFACT (no build step)
   ┌───────────────────────────────────────────────┐
   │  GitHub repo: andreruizloera.github.io          │
   │  default branch served as-is                    │
   └───────────────────────┬─────────────────────────┘
                           │  GitHub Pages publish
                           v
   HOSTING / EDGE
   ┌───────────────────────────────────────────────┐
   │  GitHub Pages + Fastly CDN (HTTPS, caching)     │
   └───────────────────────┬─────────────────────────┘
                           │  HTTPS
                           v
   CLIENT (browser)
   ┌───────────────────────────────────────────────┐
   │  render HTML + style.css                        │
   │  inline theme toggle (data-theme + localStorage)│
   │  MathJax from jsDelivr (annotation pages only)  │
   │  per-post <style>/JS effects (blog only)        │
   └───────────────────────────────────────────────┘
```

---

## 3. Core Components

### 3.1 Content Store
The repository's directory tree *is* the content store. Sections map to folders, each with an `index.html` listing and (where applicable) leaf pages:

- `index.html` — About / home.
- `research/`, `press/` — listing pages with `.entry` cards (placeholders carry an inline copy-paste template).
- `blog/` — `index.html` plus one file per post.
- `annotations/` — `index.html` plus category folders (`books/`, `math/`, `finance/`, `philosophy/`, `other/`), each with its own `index.html`.
- `reading-lists/` — `index.html` plus one page per topic (12 today).

### 3.2 Page-Template Convention (the "generator")
There is no generator; consistency comes from a **shared page skeleton** copied across files: `<head>` linking `../style.css`, a `skip-link`, the fixed `<nav>` sidebar (logo + section list, annotations adding a `.subnav`), a `<main id="main">`, and the inline theme-toggle script. New pages are produced by copying a sibling or a file in `templates/`. The cost of this approach is duplication — the nav lives in every file and must be edited in each; the benefit is zero tooling.

### 3.3 Asset Pipeline
- **CSS** — a single `style.css`. `:root` defines light-theme variables; `[data-theme="dark"]` overrides them. Components (`.entry`, `.subnav`, `.book-list`, `.annotation-body`, `.math-block`, `.empty-note`) are plain class selectors.
- **Fonts** — system/standard families only (Georgia for prose, Arial for nav and metadata); no web-font fetch.
- **Icons** — an inline SVG favicon.
- **Math** — MathJax 3 (tex-svg) from jsDelivr, included only on annotation pages, configured for `$...$` inline and `$$...$$` display.
- **Per-post effects** — scoped `<style>` and vanilla JS inside the individual post (drifting gradient hero, staggered word reveal, WebGL), each guarded by `prefers-reduced-motion`.
- **LaTeX** — `templates/annotation-template.tex` (theorem environments, macros) compiles to a printable PDF that lives beside its HTML twin.

### 3.4 Theming Runtime
A small inline script reads `localStorage.theme` (default `light`), sets `data-theme` on `<html>` before paint to avoid a flash, and a fixed top-right button flips it on click. This is the only always-on JavaScript.

### 3.5 Search
None today. The site is small enough to browse via the sidebar. If it grows, a build-free client-side index (e.g. a prebuilt JSON + a tiny fuzzy matcher) is the natural fit — see the roadmap.

---

## 4. Content / Data Model

The "data model" is structural HTML conventions rather than a database. Each content type has a stable shape:

| Type | Lives in | Fields / structure |
|---|---|---|
| **Post** | `blog/<slug>.html`, listed in `blog/index.html` | title (`<title>` + heading), date + read-time (`.meta`), summary (in the listing card), body; optional scoped effects |
| **Note (Annotation)** | `annotations/<category>/<slug>.html` (+ optional `.tex`/`.pdf`) | book/paper title, author + year (`.subtitle`), Overview, Key Ideas, Notes (LaTeX-capable), Notable Passages (`blockquote`), Takeaways |
| **Annotation listing entry** | category `index.html` `.entry` card | title + link, author · year (`.meta`), one-line takeaway |
| **ReadingListItem** | `reading-lists/<topic>.html` `<li>` | title (`.book-link`, optionally linking an annotation), author (`.author` span), grouped under a `.book-section` heading |
| **PressItem** | `press/index.html` `.entry` card | title + link, publication · date (`.meta`), short description |
| **ResearchItem** | `research/index.html` `.entry` card | title + link, venue · year (`.meta`), abstract/description |

---

## 5. Critical Flows

**A. Author a blog post**
`Copy an existing blog/*.html → set title, heading, body (trim or keep per-post effects) → add an .entry card (newest first) in blog/index.html → preview locally.`

**B. Author an annotation**
`Copy templates/annotation-template.html into the category folder → fill placeholders (math as $...$ / $$...$$) → optionally copy the .tex template and run pdflatex for a PDF → add an .entry card in the category index.`

**C. Update a reading list**
`Open reading-lists/<topic>.html → add a <li> in the right .book-section with .book-link (title) + .author → optionally point the link at a published annotation.`

**D. Publish / deploy**
`git add → commit → push origin main → GitHub Pages republishes the branch as-is → live at andreruizloera.github.io within ~a minute (CDN-cached).`

**E. Local preview**
`python3 -m http.server 8000 (or open the file) → verify relative paths, theme toggle, and any math/effects before pushing.`

---

## 6. Performance & SEO

- **Tiny payloads.** One small CSS file, inline SVG favicon, no web fonts, no framework runtime. Most pages are a single HTML request plus the cached stylesheet.
- **No render-blocking JS.** The theme script is inline and trivial; MathJax loads only where math exists; blog effects are confined to their own page.
- **Motion-safe and a11y-friendly**, which also helps Core Web Vitals (no layout-shifting hero on reduced-motion).
- **SEO baseline + gaps.** `lang`, `charset`, viewport, descriptive `<title>` per page are present. To improve discoverability: per-page `<meta name="description">`, Open Graph / Twitter cards, semantic `<article>`/`<time>` on posts, a `sitemap.xml`, and `robots.txt` (tracked in the roadmap).

---

## 7. Scaling & Reliability

- **Static hosting scales for free.** GitHub Pages serves through a CDN (Fastly); concurrency and traffic spikes are the host's problem, not the site's.
- **No backend, no database, no secrets** means almost nothing to fail at runtime — availability is essentially the CDN's.
- **Rollback is `git revert` + push.** Every deploy is a commit; history is the backup.
- **Caching.** Static assets are edge-cached; `style.css` is shared, so a single fetch covers the whole visit. (If aggressive caching ever masks an update, a query-string version bump on the stylesheet link is the escape hatch.)
- **Growth limit.** The real scaling constraint is *authoring*, not serving: duplicated nav across pages. Past a few dozen pages, a minimal include/generator step is warranted.

---

## 8. Security & Privacy

- **HTTPS** is enforced by GitHub Pages.
- **No secrets in the client.** There is no server, no API key, nothing sensitive in the source.
- **Minimal third-party surface.** Only MathJax (jsDelivr) is fetched externally, and only on annotation pages; everything else is first-party.
- **No tracking by design.** No analytics, no cookies beyond the local-only `theme` value in `localStorage`, no ad/share widgets.
- **Email obfuscation.** The contact address is rendered in a split, human-readable form to deter scrapers.
- **No comments.** No user-generated content means no comment-spam or moderation surface; if comments are ever added, prefer a privacy-respecting, static-friendly option.

---

## 9. Phased Roadmap

| Phase | Ships | Why this order |
|---|---|---|
| **0 — Live shell** *(done)* | All six sections, shared CSS, theming, accessibility, one post, twelve reading lists | Establish structure and look before pouring in content |
| **1 — Fill placeholders** | Real bio + working social/email links; first research and press entries | Turn the scaffold into a credible personal site |
| **2 — Seed annotations** | Publish math notes from existing `.tex` sources; link reading-list items to them | Show the intellectual substance the structure promises |
| **3 — Shareability** | Per-page meta descriptions, Open Graph/Twitter cards, `sitemap.xml`, `robots.txt`, optional custom domain (`CNAME`) | Make pages look right when shared and easy to index |
| **4 — Maintainability** | De-duplicate the nav via a tiny include or minimal generator; optional client-side search | Pay down the copy-paste cost only once page count justifies it |

---

## 10. Risks → Mitigations

| Risk | Mitigation |
|---|---|
| Duplicated nav drifts out of sync across pages | Keep edits scripted/checklisted now; introduce a minimal include step in Phase 4 |
| Empty placeholder sections read as abandoned | `.empty-note` signals intent; prioritize Phase 1–2 content |
| MathJax CDN unavailable | Math degrades to raw `$...$` source (still readable); could self-host if it matters |
| Per-post effect breaks on a device/browser | Effects are scoped to one page and guarded by `prefers-reduced-motion`; the rest of the site is unaffected |
| Weak link previews / discoverability | Add meta descriptions + OG/Twitter cards + sitemap in Phase 3 |
| Accidental bad deploy | Every deploy is a commit; `git revert` + push restores instantly |
| Custom-domain misconfiguration | Add `CNAME` and DNS carefully; until then the default `*.github.io` domain is stable |

---

*Companion docs: [`../README.md`](../README.md) (overview, sections, workflows), [`POSITIONING.md`](POSITIONING.md) (purpose, audience, voice, comparables).*
</content>
