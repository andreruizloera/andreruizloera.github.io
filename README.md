# Andre Ruiz Loera — Personal Website

> A quiet, fast, hand-built corner of the internet: writing, reading, and notes — no framework, no build step, no tracking.

This is the source for [`andreruizloera.github.io`](https://andreruizloera.github.io) — a personal site for a Mathematics & Economics student at UIUC. It is deliberately plain HTML and CSS: a single stylesheet, a fixed sidebar, a light/dark toggle, and a handful of content sections you can extend by copying a template and editing text. No generator stands between the source and what ships.

---

## Documentation

- **[`docs/SYSTEM_DESIGN.md`](docs/SYSTEM_DESIGN.md)** — architecture of the static site: content store, the page-template convention, the asset pipeline (shared CSS, MathJax, per-post effects), critical authoring/deploy flows, performance & SEO, hosting/reliability, privacy, and a phased roadmap.
- **[`docs/POSITIONING.md`](docs/POSITIONING.md)** — purpose and goals, who it's for, voice and content strategy, what "good" looks like, and comparable personal sites / digital gardens.

---

## Overview

The site is a personal hub with five public surfaces plus an about page. It is intentionally low-maintenance and durable: every page is a self-contained `.html` file that links one shared `style.css`. There is no JavaScript framework, no bundler, and no server — the only runtime scripts are a tiny inline theme toggle and (on annotation pages) MathJax loaded from a CDN.

Design values it already embodies, visible in the source:

- **Readable by default.** Georgia serif body text, generous line height, a 640–680px reading measure.
- **Light and dark.** A fixed top-right toggle flips a `data-theme` attribute; CSS custom properties do the rest, and the choice persists in `localStorage`.
- **Accessible.** Skip-to-content link, visible `:focus-visible` outlines, ARIA labels on controls, and `prefers-reduced-motion` honored (animations collapse to near-zero).
- **Fast.** No tracking, no analytics, no third-party fonts; a single small CSS file and an inline SVG favicon.

---

## Sections / Information Architecture

A fixed left sidebar (`ARL` wordmark + nav) appears on every page. The nav is hand-maintained in each file rather than templated.

| Section | Path | What lives here |
|---|---|---|
| **About** | `index.html` | Name, one-line subtitle, bio, and contact / social links (X, GitHub, LinkedIn, obfuscated email). |
| **Research** | `research/index.html` | Papers and projects, listed as `.entry` cards. Currently a placeholder with an inline copy-paste template. |
| **Blog** | `blog/index.html` + `blog/*.html` | Essays. Each post is its own page and may carry bespoke per-post effects. First post: *How to Design Better with AI*. |
| **Annotations** | `annotations/index.html` | Reading notes, split into a sub-nav: **Books, Math, Finance, Philosophy, Other**. Math notes render LaTeX via MathJax and have a paired `.tex` source. |
| **Reading Lists** | `reading-lists/index.html` + 12 category pages | Curated booklists: Classics, Finance, Mathematics, Statistics, Economics, Computer Science, Fiction, Biography & History, Self-Help & Psychology, Technology & Society, Religion & Spirituality, Penguin Classics. |
| **Press** | `press/index.html` | Media and mentions, as `.entry` cards. Placeholder with an inline template. |

Shared building blocks in `style.css`: `.entry` (listing card with `.meta`), `.subnav` (annotation categories), `.book-section` / `.book-list` / `.book-link` (reading lists), `.annotation-body` + `.math-block` + `blockquote` (note pages), and `.empty-note` for sections awaiting content.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Markup | Static, hand-authored HTML5 (one file per page) |
| Styling | A single `style.css` using CSS custom properties for theming; no preprocessor |
| Theming | Inline vanilla JS toggling `data-theme` + `localStorage` persistence |
| Math | [MathJax 3](https://www.mathjax.org/) (tex-svg) from jsDelivr, on annotation pages only |
| Per-post effects | Scoped `<style>` + vanilla JS in the individual post (e.g. drifting gradient hero, staggered word reveal, WebGL) |
| Notes source | LaTeX (`pdflatex` / `xelatex`) for printable PDFs, paired with an HTML twin |
| Build | None — source files are the deployed artifact |
| Hosting | GitHub Pages (user site) |
| Icons | Inline SVG favicon |

---

## Local Development

No toolchain required. Either open a file directly, or serve the folder so relative paths resolve cleanly:

```bash
git clone https://github.com/andreruizloera/andreruizloera.github.io.git
cd andreruizloera.github.io

# Option A: just open it
open index.html

# Option B: a local static server (recommended; matches deployed paths)
python3 -m http.server 8000
# then visit http://localhost:8000
```

To rebuild a math annotation's PDF from its LaTeX source:

```bash
cd annotations/math
pdflatex evan-chen-egmo.tex   # or xelatex
```

---

## Deployment (GitHub Pages)

The repository is named `andreruizloera.github.io`, so it is served as a **user GitHub Pages site** straight from the default branch — no Actions workflow, no build, no `Jekyll` config required for plain HTML.

```bash
git add .
git commit -m "Add post / update section"
git push origin main
```

Within a minute or so, changes are live at `https://andreruizloera.github.io`. There is currently no custom domain (no `CNAME`); adding one is a one-file change plus a DNS record.

---

## Content Workflow

**Add a blog post**
1. Copy an existing post in `blog/` to a new kebab-case filename (e.g. `blog/markets-and-noise.html`).
2. Edit the `<title>`, the heading, and the body; keep or trim the per-post `<style>`/script if you don't want the effects.
3. Add an `.entry` card linking it in `blog/index.html` (newest first).

**Add an annotation**
1. Copy `templates/annotation-template.html` into the right category folder (e.g. `annotations/math/rudin-principles.html`) and fill in the placeholders. Math uses `$...$` inline and `$$...$$` display.
2. For a printable version, copy `templates/annotation-template.tex`, write the notes, and compile with `pdflatex`.
3. Add an `.entry` card in that category's `index.html` (each category page already carries a commented template).

**Update a reading list**
1. Open the relevant `reading-lists/<topic>.html`.
2. Add a `<li>` inside the appropriate `.book-section` → `.book-list`, with the title in a `.book-link` and the author in an `.author` span.

**Add a research or press entry**
- Open `research/index.html` or `press/index.html` and paste the `.entry` template that already sits commented in the file; remove the `.empty-note` once real content exists.

---

## Roadmap

- **Fill the placeholders** — real bio, working social/email links on the About page; first research and press entries.
- **Seed the annotations** — publish the math notes whose LaTeX sources already exist, then expand to other categories.
- **Reduce nav duplication** — the sidebar is copied into every page; consider a tiny include step or a minimal generator if page count grows.
- **Reading-list links** — point `book-link` hrefs at the paired annotations as they're written.
- **Polish for sharing** — per-page meta descriptions, Open Graph / Twitter cards, `sitemap.xml`, and `robots.txt`.
- **Optional custom domain** — add a `CNAME` and DNS records.

---

## Status

Live and structurally complete: navigation, theming, accessibility, and all six sections exist and render. Content is early — one blog post and twelve reading-list pages are populated; research, press, and most annotation categories are placeholders ready to fill. This README and the companion docs describe the site as it actually is, plus a sensible path forward.
</content>
</invoke>
