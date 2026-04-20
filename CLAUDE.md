# CLAUDE.md — Focal&Co. Website

## Always Do First
- **Read the `frontend-design` skill** before writing any frontend code, every session.
- **Check `brand_assets/`** for logos, colour swatches, and any supplied imagery before designing.

---

## Project Context
This is the website for **Focal&Co.**, an independent optician brand. The visual identity is confident, editorial, and witty — think bold typographic headlines, a dark/charcoal base, and a sharp yellow-gold accent. Refer to the brand guidelines below and the `brand_assets/` folder at all times.

---

## Brand Guidelines

### Colours
| Role | Name | HEX |
|---|---|---|
| Primary (dark base) | Near-black | `#1a1b0f` |
| Primary accent | Yellow | `#f4ec5f` |
| Muted gold | Secondary yellow | `#b4af4c` |
| Mid grey | Neutral | `#c7c7c7` |
| Accent blue | Additional | `#6079bb` |
| Deep purple-blue | Additional | `#5654a4` |

- **Background:** `#1a1b0f` (default dark base) or off-white for light sections
- **Primary CTA / highlight colour:** `#f4ec5f`
- **Never** use default Tailwind blue/indigo/purple as brand colours

### Typography
- **Headings / Display:** PP Fragment Glare Regular — load via `@font-face` or Fontshare/CDN if available; fall back to a high-contrast serif (`'Georgia', serif`)
- **Subheadings:** PP Fragment Glare Light
- **Body:** Poppins Regular — load via Google Fonts (`https://fonts.googleapis.com/css2?family=Poppins&display=swap`)
- **Buttons:** PP Fragment Glare Light
- Apply tight tracking (`letter-spacing: -0.03em`) on large display headings
- Generous line-height (`1.7`) on body copy

### Logo
- Use files from `brand_assets/` — full lockup (logomark + wordmark) by default
- Maintain clearspace equal to the height of the "F" in the wordmark on all sides
- Never stretch, recolour, or apply effects to the logo
- On dark backgrounds: use the light/reversed version if supplied

### Voice & Tone
Witty, direct, warm. Headlines are punchy and conversational (e.g. *"Close your right eye, now the left."*). Avoid corporate or clinical language.

---

## Tech Stack
- **Framework:** Vanilla HTML/CSS/JS or Vite — single `index.html` unless scoped otherwise
- **CSS:** Tailwind CSS via CDN (`<script src="https://cdn.tailwindcss.com"></script>`) with custom config for brand tokens
- **Fonts:** Google Fonts CDN for Poppins; `@font-face` for PP Fragment Glare if files are in `brand_assets/fonts/`
- **Images:** Use files from `brand_assets/images/` where available; otherwise `https://placehold.co/WIDTHxHEIGHT`
- **Icons:** None by default — use typographic or SVG solutions to stay on-brand
- **No external UI libraries** (no Bootstrap, no Headless UI)

---

## Dev Server
- Serve locally with: `npx serve .` or `python3 -m http.server 3000`
- Default port: **3000**
- Never open `file:///` URLs directly — always use localhost

---

## Screenshot & QA Workflow
1. Start the dev server before taking any screenshots
2. Screenshot at `http://localhost:3000`
3. Compare against the reference design or brief
4. Note specific mismatches: font size, spacing (px), colour hex, alignment
5. Fix and re-screenshot — do **at least 2 rounds** before considering a pass done
6. Stop only when no visible differences remain or the user signs off

---

## Design Guardrails

### Do
- Use `#1a1b0f` as the base dark surface
- Use `#f4ec5f` as the primary accent/highlight — sparingly, for maximum impact
- Layer multiple radial gradients and subtle grain/noise (SVG `feTurbulence`) for depth
- Use PP Fragment Glare (or serif fallback) for all display text
- Build a clear surface layering system: base → elevated → floating
- Every clickable element needs hover, focus-visible, and active states
- Animate only `transform` and `opacity` — use spring-style easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`)
- Add gradient overlays on images: `linear-gradient(to top, rgba(26,27,15,0.7), transparent)`
- Use consistent spacing tokens — not random Tailwind steps

### Don't
- Don't use `transition-all`
- Don't use default Tailwind blue/indigo/purple as primary
- Don't use flat `shadow-md` — use layered, colour-tinted shadows with low opacity
- Don't use Inter, Roboto, or Arial
- Don't add sections or features not in the brief or reference
- Don't "improve" a reference design — match it first, then ask
- Don't use the same font for headings and body

---

## Reference Ad (Split Blur Design)
The supplied poster (`Screenshot_2026-03-18_at_11_31_58.png`) shows the brand's editorial style:
- Dark charcoal header band with large white + yellow serif headline
- Split image (blurred left / sharp right) divided by a dashed yellow vertical line
- Left caption: *"You, this morning."* / Right caption: *"You, after a chat with us."*
- Focal&Co. logo (logomark + wordmark) bottom-left in white on dark
- This aesthetic — wit, contrast, confident type — should inform the whole website

---

## Hard Rules
- Always check `brand_assets/` before using any placeholder
- Never use a `file:///` URL for screenshots
- Never use `transition-all`
- Never use default Tailwind blue/indigo as the brand colour
- Do not stop after one screenshot pass
- Do not add unrequested sections or features
- Do not reproduce the reference — match it
