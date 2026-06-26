# Landing variant — `site/`

A modern, single-page front door for Andre Ruiz Loera's personal website.

> This is an **alternative landing page**, not a replacement. The real, hand-authored site
> (`../index.html` and its sections — blog, press, reading lists, research, annotations) is
> untouched. This page only links *into* it.

## What this is

A polished one-page intro: hero (name and positioning), an "about / what you'll find here"
section, a grid of the five real site sections, a "currently" focus block, and a contact footer.
Copy is about the site and its sections — drawn from `../README.md` and `../docs/POSITIONING.md` —
not fabricated biography.

## Files

- `index.html` — the landing page. Section cards and the footer link to the existing pages
  one directory up (`../blog/index.html`, `../annotations/index.html`, etc.).
- `styles.css` — pure CSS, themed via `:root` custom properties.
- `app.js` — small vanilla JS: mobile nav toggle, scroll-reveal, footer year. No dependencies.

## Theme

Restrained slate/ink surfaces with a single muted steel-blue accent. To re-theme, edit two
variables at the top of `styles.css`:

```css
--accent:   #6b8cae;  /* primary accent */
--accent-2: #88a9c3;  /* gradient partner */
```

## Running it

No build step. Open it directly:

```bash
open index.html
```

Or serve the repo root so the `../` links to the full site resolve cleanly:

```bash
# from the repository root
python3 -m http.server 8000
# then visit http://localhost:8000/site/
```

## Deploy notes

The main site deploys as a GitHub Pages user site from the repo root, so this page is reachable
at `https://andreruizloera.github.io/site/` with no extra configuration. If you ever want it to
be the front page, that is a deliberate, separate decision — copy or point to it from the root
rather than modifying the existing `../index.html`. No build, bundler, or server is required.

No emojis, no tracking, no third-party fonts.
