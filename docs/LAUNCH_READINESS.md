# Personal Website — Launch Readiness

> What exists, what remains, the exact services needed, the deploy steps, a pre-launch
> checklist, and a Go/No-Go gate. The site is already structurally live on GitHub Pages; this
> document is about crossing from "a scaffold with placeholders" to "a site worth putting on a
> resume."

Companion docs: [`SYSTEM_DESIGN.md`](SYSTEM_DESIGN.md) (architecture), [`SECURITY.md`](SECURITY.md)
(hardening), [`BUSINESS_PLAN.md`](BUSINESS_PLAN.md) (goals, metrics, roadmap),
[`POSITIONING.md`](POSITIONING.md) (audience and voice).

---

## 1. What Exists Today

- **All six sections render:** About (`index.html`), Research, Blog, Annotations, Reading Lists,
  Press — with shared `style.css`, light/dark theming, and accessibility (skip link, focus
  styles, ARIA, reduced-motion).
- **Content, early:** one blog post, twelve reading-list pages populated; math LaTeX sources
  exist (`annotations/math/*.tex`) and compile to PDFs.
- **An alternative landing variant** in `site/` (literary single-page front door) that links
  into the real sections; it does not replace the root `index.html`.
- **Deployment is live and free:** GitHub Pages user site served from the default branch, HTTPS
  enforced, Fastly CDN.
- **Security hardening added at this pass:** a `_headers` file (for header-capable hosts) and a
  meta CSP on the two entry pages; verified no secrets in client code and no `http://` assets.

---

## 2. What Remains Before Launch

| Area | Gap | Priority |
|---|---|---|
| About page | Placeholder bio ("Add your bio here.") and dead `#` social links | **Blocker** |
| Contact | Email is obfuscated placeholder text; confirm it is correct and reachable | **Blocker** |
| Research / Press | Empty placeholders that read as abandoned if left | High |
| Annotations | Math sources exist but notes are not yet published as pages | High |
| SEO / sharing | No per-page `<meta name="description">` on most pages, no Open Graph/Twitter cards, no `sitemap.xml`, no `robots.txt` | Medium |
| Landing decision | Root `index.html` vs. `site/` variant as the front door — pick one | Medium |
| Privacy note | Not needed today (no tracking); required only if analytics/newsletter is added | Conditional |
| Custom domain | Optional; none configured (no `CNAME`) | Optional |

---

## 3. Exact Services Needed

The site is cheap by design. Only the first is required; the rest are optional.

| Need | Recommended service | Cost | Required? |
|---|---|---|---|
| **Hosting** | GitHub Pages (current) — free user site. Alternatives if header control is wanted: **Netlify** or **Cloudflare Pages** (both free, both honor the `_headers` file) | $0 | **Required** (already in place) |
| **TLS / HTTPS** | Included by the host; keep "Enforce HTTPS" on | $0 | **Required** (in place) |
| **Domain** (optional) | Any registrar (`.com` ~ $10–15/yr); prefer one with 2FA + registrar lock | ~$10–15/yr | Optional |
| **Analytics** (optional) | Cookieless/privacy-first (self-hosted or minimal provider) — or none at all, which is a principled default | $0–9/mo | Optional |
| **Contact handling** | `mailto:`/obfuscated email today (no service). If a form is wanted later: a serverless form provider (free tier) with spam protection | $0 | Optional |
| **Email** | The personal Gmail already used for contact | $0 | In place |
| **Newsletter** (optional) | Privacy-respecting provider, free tier, double opt-in | $0 to start | Optional |

Bottom line: launch requires **no new paid service**. A domain is the only likely spend.

---

## 4. Deploy Steps

**Current host — GitHub Pages (no build):**

```bash
git add .
git commit -m "Fill About page and section placeholders"
git push origin main
# Live at https://andreruizloera.github.io within about a minute (CDN-cached).
```

Rollback: `git revert <sha> && git push` — every deploy is a commit.

**If migrating to a header-capable host (to enforce the `_headers` file), e.g. Cloudflare Pages
or Netlify:**

1. Connect the GitHub repo to the host; set build command to none and the publish directory to
   the repo root (static).
2. Deploy; confirm the `_headers` file is applied (check response headers, section 5).
3. Point DNS / custom domain at the new host; keep HTTPS enforced.

**Custom domain (optional, GitHub Pages):**

1. Add a `CNAME` file containing the domain (one line).
2. At the registrar, add the DNS records GitHub specifies (apex `A`/`AAAA` or a `CNAME` for a
   subdomain).
3. In repo Settings > Pages, set the custom domain and re-enable "Enforce HTTPS" after the
   certificate provisions.

---

## 5. Pre-Launch Checklist

**Content**
- [ ] Real bio replaces "Add your bio here." on the About page.
- [ ] Social links (X, GitHub, LinkedIn) point at real profiles, not `#`.
- [ ] Contact email is correct, reachable, and tested.
- [ ] Research and Press either have a first real entry or an intentional, non-abandoned note.
- [ ] At least one math annotation published from the existing `.tex` sources.
- [ ] Decide root `index.html` vs. `site/` landing as the front door; make the other reachable
      or remove it.

**SEO / sharing**
- [ ] Per-page `<meta name="description">` on the main pages.
- [ ] Open Graph / Twitter card tags on entry pages (title, description, image).
- [ ] `sitemap.xml` and `robots.txt` at the repo root.
- [ ] Descriptive, unique `<title>` per page (mostly present — verify).

**Security / privacy** (see `SECURITY.md`)
- [ ] `_headers` file present at repo root.
- [ ] Meta CSP present on entry pages and not breaking the theme toggle, MathJax, or per-post
      effects (test in a browser).
- [ ] "Enforce HTTPS" enabled on the host.
- [ ] No secrets in client code (verified this pass).
- [ ] GitHub account has 2FA and a strong password; branch protection considered.
- [ ] Privacy note published *only if* analytics or a newsletter is added.

**Quality**
- [ ] Renders correctly in light and dark on phone and laptop.
- [ ] Theme toggle persists; skip link and keyboard focus work.
- [ ] MathJax renders on an annotation page; degrades readably if blocked.
- [ ] Lighthouse: performance 95+, accessibility 100.
- [ ] No console errors; no mixed-content warnings.

---

## 6. Go / No-Go

**Go when all of these are true:**

- [ ] About page has a real bio and working social + email links. *(No-Go blocker)*
- [ ] Contact email verified reachable. *(No-Go blocker)*
- [ ] Research and Press are not bare placeholders (real entry or intentional note).
- [ ] At least one annotation published to back the "shows depth" promise.
- [ ] Site loads over HTTPS with no mixed content; theming and MathJax work.
- [ ] `_headers` + meta CSP in place; no secrets in client code.
- [ ] Basic SEO shipped (per-page descriptions; sitemap/robots or a dated plan to add them).
- [ ] Front-door decision (root vs. `site/`) made and consistent.

**No-Go if any of these are true:**

- [ ] About still says "Add your bio here." or social links are `#`.
- [ ] Contact email is wrong or unreachable.
- [ ] A page throws console errors or shows mixed-content warnings.
- [ ] The CSP breaks the theme toggle, MathJax, or per-post effects.

Everything on the No-Go list is fast to fix; none require new infrastructure. The launch gate is
about **content credibility**, not engineering — the engineering is done.
</content>
