# Personal Website — Security & Privacy

> Threat model and hardening for a hand-authored, build-free static site served over HTTPS.
> The attack surface is intentionally tiny: no backend, no database, no user accounts, no
> secrets in the source, and (by design) no tracking. This document states what is protected,
> what it is protected against, the concrete controls in place, and a short roadmap for the
> gaps that remain.

Companion docs: [`SYSTEM_DESIGN.md`](SYSTEM_DESIGN.md) (architecture), [`LAUNCH_READINESS.md`](LAUNCH_READINESS.md)
(deploy and go/no-go), [`BUSINESS_PLAN.md`](BUSINESS_PLAN.md) (goals and metrics).

---

## 1. Assets to Protect

| Asset | Why it matters | Sensitivity |
|---|---|---|
| The domain / GitHub Pages source repo | Compromise = defacement or malicious redirect under a trusted name | High |
| GitHub account (owner) | Push access = full control of what ships | High |
| Site integrity (the HTML/CSS/JS that ships) | Readers trust it; injected script would be served over a trusted origin | High |
| Reputation | The entire point of the site; defacement or spammy content is the real damage | High |
| Contact address | Currently an obfuscated `mailto`-style email; target for scraping/spam | Low |
| Visitor privacy | A privacy-first posture is a feature and a promise | Medium |
| Analytics data (if ever added) | Aggregate, non-PII by design intent | Low |
| Secrets / API keys | **None today.** Would become High if a form handler or analytics key is added | n/a today |

There is no sensitive PII, no payment data, no authentication, and no user-generated content.

---

## 2. Threat Model

**In scope (realistic threats for a static personal site):**

- **Account/repo takeover** — phished or leaked GitHub credentials leading to malicious commits.
- **Supply-chain / dependency risk** — the one external runtime dependency (MathJax from a CDN)
  or any future npm tooling being compromised or swapped.
- **Third-party CDN compromise or outage** — MathJax on jsDelivr executing in the page origin.
- **Clickjacking / framing** — the site embedded in a hostile iframe.
- **Content/spam abuse** — email scraping today; comment/form spam if those are ever added.
- **DNS hijack / domain lapse** — if a custom domain is added and its registrar/DNS is weak or
  the registration expires.
- **Man-in-the-middle** — mitigated by HTTPS-only + HSTS.

**Out of scope (do not apply to this architecture):**

- Server-side exploits (SQLi, RCE, SSRF) — there is no server or database.
- Authentication/session attacks — there are no accounts or sessions.
- Data breach of stored user records — nothing is stored server-side.
- The only client-side state is a local-only `theme` value in `localStorage` (non-sensitive).

---

## 3. Controls In Place

### 3.1 Transport
- **HTTPS-only.** GitHub Pages enforces HTTPS; the "Enforce HTTPS" setting must stay enabled.
- **HSTS.** `*.github.io` is preloaded for HSTS by the host. A `_headers` file (see below) also
  declares HSTS for header-capable hosts (Netlify / Cloudflare Pages) if the site ever moves.
- **No mixed content.** All first-party assets are relative; the single external script
  (MathJax) is loaded over `https://`. Verified: no `http://` asset references in the source.

### 3.2 Content Security Policy and security headers
Two layers, because GitHub Pages cannot set custom response headers today:

1. **`_headers` file at the repo root** — full header set (CSP, HSTS, `X-Content-Type-Options`,
   `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`).
   Honored by Netlify, Cloudflare Pages, and similar; a no-op on GitHub Pages but ready if the
   host changes.
2. **`<meta http-equiv="Content-Security-Policy">`** on the primary entry pages (root
   `index.html` and `site/index.html`) — a portable fallback that works even on GitHub Pages.

The CSP is deliberately compatible with a no-build site:

```
default-src 'self';
base-uri 'self';
object-src 'none';
frame-ancestors 'none';
img-src 'self' data:;
style-src 'self' 'unsafe-inline';
script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
font-src 'self';
connect-src 'self';
form-action 'self';
upgrade-insecure-requests;
```

**Why `'unsafe-inline'` is present, honestly:** the site's core design principle is "source is
the artifact" — no build step. The theme toggle is an inline script with an inline `onclick`
handler, and blog posts carry scoped per-post `<style>`/`<script>` effects. A nonce- or
hash-based CSP would require a build/templating step, which contradicts the architecture. The
CSP therefore still delivers real value — it locks down `default-src`, forbids plugins
(`object-src 'none'`), blocks framing (`frame-ancestors 'none'`), restricts base URIs and form
targets, and whitelists exactly one external script origin (jsDelivr) — while accepting inline
code. Tightening to nonces is a roadmap item that is only worth it if a minimal generator is
adopted (Phase 4 of the system-design roadmap).

Additional headers in `_headers`:
- `X-Content-Type-Options: nosniff` — no MIME sniffing.
- `X-Frame-Options: DENY` — legacy clickjacking defense alongside `frame-ancestors`.
- `Referrer-Policy: strict-origin-when-cross-origin` — minimal referrer leakage.
- `Permissions-Policy: geolocation=(), camera=(), microphone=(), interest-cohort=()` — disable
  powerful features and FLoC.
- `Cross-Origin-Opener-Policy: same-origin` — process isolation.

### 3.3 Secrets and supply chain
- **No secrets in client code.** Verified by scanning the source for API keys, tokens,
  passwords, and private keys — none present. There is no server, so there is nowhere to leak
  server secrets from.
- **Minimal third-party surface.** Exactly one external runtime dependency: MathJax
  (`cdn.jsdelivr.net`), loaded only on annotation pages. No web fonts, no analytics, no ad or
  share widgets.
- **Build supply chain: none today.** There is no `package.json`, no `node_modules`, no CI
  build — so there is no npm dependency tree to be compromised. If tooling is ever added, pin
  versions, commit a lockfile, and enable Dependabot/`npm audit`.

### 3.4 Privacy
- **No tracking by design.** No analytics, no cookies (only a local-only `theme` in
  `localStorage`), no cross-site requests beyond MathJax.
- **Email obfuscation.** The contact address is rendered split/human-readable to deter scrapers.
- **No user-generated content.** No comments or forms means no moderation or spam surface today.

### 3.5 Account and repository hygiene
- The owning GitHub account should have **2FA enabled** and a strong unique password.
- Branch protection on the deploy branch and review of any automated/agent commits.
- The repo is public source; keep it free of anything not meant to be world-readable.

---

## 4. Risks Introduced by Optional Future Features

If the roadmap's optional features are pursued, revisit this model:

| Future feature | New risk | Required control |
|---|---|---|
| Contact form (replacing `mailto`) | Spam, abuse, handler-key leakage, PII in submissions | Use a serverless/form provider; add CAPTCHA or honeypot + rate limiting; keep the handler key server-side (never in client JS); validate/escape inputs; state retention/GDPR handling |
| Newsletter opt-in | PII (emails), consent, unsubscribe | Double opt-in, privacy-respecting provider, easy unsubscribe, no data selling, disclosed in a privacy note |
| Cookieless analytics | Even minimal analytics implies a privacy stance | Prefer no-cookie provider; disclose in a privacy note; still no PII |
| Custom domain | DNS hijack, expiry, mis-issuance | Registrar with 2FA, auto-renew, registrar lock; DNSSEC if available; keep GitHub Pages "Enforce HTTPS" on after DNS points over |
| Comments | Spam and moderation surface | Prefer a static-friendly, privacy-respecting option; moderate |
| npm build tooling | Dependency/supply-chain compromise | Lockfile, pinned versions, Dependabot, `npm audit`, minimal deps |

---

## 5. Privacy / Compliance Posture

- **GDPR / CCPA:** with no cookies, no analytics, and no data collection, the site is trivially
  compliant today — there is nothing to consent to and nothing stored about visitors.
- **Cookie/analytics consent:** not required while the site sets no non-essential cookies. If
  analytics or a newsletter is added, publish a short **privacy note** describing what is
  collected, why, retention, and how to opt out — and prefer cookieless tooling so a consent
  banner is unnecessary.
- **EU/CA visitors:** the safest posture (no tracking) is already the default. Keep it unless a
  feature genuinely requires data, then add the note and controls above.

---

## 6. Incident Response Basics

Small site, simple playbook:

1. **Defacement / bad deploy:** every deploy is a git commit — `git revert` the offending commit
   and push; the CDN republishes within about a minute. History is the backup.
2. **Suspected account compromise:** rotate the GitHub password, re-verify 2FA, review recent
   commits and deploy keys/tokens, revoke anything unrecognized, and audit the diff since the
   last known-good commit.
3. **Malicious content in a dependency (e.g. MathJax CDN):** math degrades to readable raw
   `$...$` source if the script is removed; temporarily drop or self-host MathJax until resolved.
4. **Domain / DNS issue (if a custom domain exists):** contact the registrar, re-enable
   registrar lock, restore correct DNS records, and confirm "Enforce HTTPS" once propagated.
5. **Contact:** the site owner (`andre.x.ruizloera@gmail.com`) is the single point of contact
   and responder.

---

## 7. Security Roadmap

| Priority | Item | Rationale |
|---|---|---|
| **Now (ship with launch)** | `_headers` file + meta CSP on entry pages; confirm HTTPS-only + no secrets | Baseline hardening with zero design cost |
| **Now** | Enable 2FA + strong password on the GitHub account; branch protection | Account takeover is the highest-impact realistic threat |
| **Soon** | Extend the meta CSP (or move to a header-capable host) so *all* pages, including MathJax annotation pages, carry the policy | Consistent enforcement beyond the two entry pages |
| **When a custom domain is added** | Registrar 2FA, auto-renew, registrar lock, DNSSEC; re-verify HTTPS | Prevents hijack and lapse |
| **If a form/newsletter is added** | Handler key server-side, spam protection, privacy note, input validation | New PII and secret surface |
| **If build tooling is added** | Lockfile, pinned deps, Dependabot, `npm audit` | Introduces a supply chain to manage |
| **Later / optional** | Subresource Integrity (SRI) on the MathJax script; tighten CSP to nonces if a minimal generator is adopted | Defense in depth against CDN compromise; only worth it with a build step |
</content>
