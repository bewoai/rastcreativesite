# Rast Creative Studio — Site Animation Brief

**"Live Set": a premium logo entry, an experiential header, and a site-wide scroll-reveal system — all built from the studio's own visual language, optimized for a broad, non-technical audience**

---

## 1. Context

**rastcreative.com** is a cinematic video production agency site (Sakarya, Turkey) built on Astro. It already speaks a film-set visual language it isn't yet using to full effect: `REC · TC 00:00:00:00`, `PRODUCTION · DIRECTOR · CAMERA · DATE · SCENE · TAKE`, and homepage sections labeled `Sahne 01`, `Sahne 02`... (`Scene 01`, `Scene 02`...). Dark theme (`#191612`), 13+ brands, 33+ pieces of content, and 20+ programmatic local-SEO location pages plus a blog.

**Reference: why.zero.university** — a WebGL/Three.js-heavy experience using compressed KTX2 texture atlases (a volumetric "clouds" scene), a scroll-linked camera with live degree/bezier readouts (`degree`, `-100 BZ`...`0 BZ`), and odometer-style digit-roll counters (0–9 flipping) during a percentage-based preloader. Aesthetically it reads as a technical HUD / debug overlay laid over a 3D scene — striking, but asset-heavy (the clouds texture alone stalled loading during review) and built for an audience that already expects a "digital showcase" experience.

**The direction: don't copy Zero's 3D weight or its blocking preloader.** Borrow its HUD/technical-readout *feeling* and its digit-roll/scroll-linked-readout techniques, and build them out of Rast Creative's own vocabulary (REC, timecode, slate/clapperboard, scene numbering, color grading) so the result feels like *theirs*, not a generic template — applied consistently from the first frame through every page, without ever risking the stall/bounce failure mode the reference site hit.

---

## 2. Audience constraint

Target audience is roughly **18–60**, skewing toward B2B decision-makers (factory owners, clinic managers, retail owners) rather than digital-native early adopters. Design principle:

> **HUD/technical elements are ambient texture and live feedback, never information the user has to parse, and never an obstacle between the user and the content.**

Concretely:

- Drop fake technical readouts (f-stops, ISO values) or keep them extremely low-opacity/decorative — they read as noise to a non-filmmaker.
- Keep the live-counting timecode (`00:00:00:00`) — it's universally and instantly legible as "this is video."
- No custom cursor, no scroll-hijacking. Scroll-triggered reveals are fine (intuitive to everyone); anything that changes scroll direction or takes over input erodes trust fast, especially on mobile.
- No blocking loaders. Content must always be present and readable in the DOM — animation is a layer on top, never a gate.
- The CTA (`Ücretsiz Ön Görüşme`) always stays visible/prominent, never obscured.
- Header stays permanently visible (no hide-on-scroll-down); only its density/style changes. Disappearing navigation confuses less tech-fluent users.

---

## 3. Concept: "Live Set" — three layers

### 3.1 Entry — "Aperture Draw" (premium logo loader)

A deliberate, crafted open — not a percentage bar, and never gated on asset loading.

| Time | What happens |
|---|---|
| 0ms | Screen fills instantly with the theme color (`#191612`) — no white flash. |
| 0–900ms | The logo is drawn on screen via an SVG line-draw animation (`stroke-dashoffset`), like chalk on a slate — unhurried, precise, premium pacing rather than a quick flash. |
| 900–1500ms | Once the mark is fully drawn, a circular iris-wipe (`clip-path`, expanding from the logo's center — a camera-aperture opening) reveals the hero underneath. The header's timecode starts counting from `00:00:00:00` the instant the iris begins opening — "recording starts now." |
| ~1.5s total | Overlay is gone, hero is fully interactive. |

**Why it's safe:** the entire sequence is time-based, not asset-based. Astro server-renders the page, so hero headline, CTA, and hero poster are already present and interactive underneath the overlay well before the animation finishes — nothing is ever waiting on this animation, and the animation is never waiting on a slow network. This is the structural fix for the failure mode observed on the reference site (stuck at a 99% loader waiting on a large texture).

**Guardrails:** plays once per session (`sessionStorage`), never replays on internal navigation or location subpages. Any tap/click/keypress skips straight to the revealed state. `prefers-reduced-motion` disables it entirely (straight to static hero). On mobile, the logo line-draw is shortened or skipped, leaving a quicker ~700ms iris-open only — mobile users are more impatient and the animation cost is proportionally higher.

### 3.2 Header — a living slate

- **State change on scroll**: header starts tall/transparent over the hero, then condenses into a compact bar with a dark blurred glass panel (`backdrop-filter: blur` + translucent `#191612`) as the user scrolls — logo scales down, spacing tightens. Always visible, never hidden.
- **Live scene tag**: next to the timecode, a small `SAHNE 03` style label reflects whichever `Sahne` section is currently in view (via IntersectionObserver watching each section's id). On change, the tag does a quick clapperboard-style flip (CSS `rotateX`, ~200ms) rather than a generic fade — a transition unique to this brand's own object (the slate).
- **REC pulse**: the existing REC dot pulses while the user is actively scrolling and holds steady when idle — subtle "we're capturing this" feedback tied directly to input.
- **Color-grading progress line**: a hairline progress bar under the header shifts hue gradually across scroll depth, referencing the studio's own color-grading service rather than a generic loading-bar red.

### 3.3 Site-wide scroll-reveal system

Every page (homepage, project pages, service pages, the 20+ location pages, blog) uses the same lightweight reveal vocabulary as content enters the viewport — rooted in film/edit language, not generic "fade-up":

| Element type | Motif | Mechanic |
|---|---|---|
| Headings / body text | **Focus pull** | Slight blur → sharp + tiny opacity ramp, like a lens racking focus |
| Photos / video thumbnails | **Exposure fade** | Opacity + a few px of scale-in, like a frame being exposed |
| Section/scene labels | **Slate flip** | Short `rotateX` flip, same motion as the header's scene tag |
| Stat numbers (13+, 33+, 4K) | **Odometer roll** | Digits count up from 0 once in view |
| Project/card grids | **Frame advance** | Cards stagger in (60–80ms apart) like film frames advancing, not a simultaneous pop |

All of it is IntersectionObserver-driven, CSS `transform`/`opacity` only (GPU-cheap, no layout thrashing), and reusable as a single shared utility rather than bespoke per-page work — which is what makes site-wide rollout affordable.

---

## 4. Making it safe at site-wide scale (20+ location pages + blog)

- **Content is never gated on animation or JS.** Astro server-renders full markup; both the entry overlay and the reveal system only toggle `opacity`/`transform`/`clip-path` on elements already in the HTML. Search crawlers and no-JS visitors see full content immediately.
- **One shared, cached script.** The reveal logic and entry sequence ship as a single small JS module, loaded once and cached by the browser across all pages — marginal cost per additional page is close to zero after the first load.
- **No animation on first paint of below-the-fold content required for LCP.** Hero content on each page type renders immediately; reveals only apply to content the user hasn't scrolled to yet.
- **`prefers-reduced-motion`**: entry and all reveals resolve instantly to their end state, no transition.
- **Mobile**: same system, shorter/smaller transforms (less blur radius, smaller translate distances, shorter entry sequence) to stay cheap on mid-range Android GPUs common in the target region.
- **Fallback-safe by construction**: if JS fails to load, elements default to visible (reveal/entry classes only hide content after JS confirms it's running), so nothing is ever permanently invisible.

---

## 5. Technical approach summary

Stack: SVG stroke-draw + CSS `clip-path`/transform/opacity animations for the entry sequence; a lightweight IntersectionObserver utility for reveals; optionally GSAP/ScrollTrigger for the header's more choreographed moments (scene-flip, color line) and Lenis for smooth (not hijacked) scroll easing. No WebGL, no 3D assets, no blocking preloader. Everything deferred/non-blocking via dynamic import so first paint is never delayed.

Target budget: LCP < 2.5s on 4G, CLS ≈ 0, consistent across homepage and the programmatic location/blog pages.

---

## 6. Rollout

1. **v1** — Homepage: entry sequence (Aperture Draw) + header behavior (scene tag, REC pulse, color line) + full reveal system across all homepage sections.
2. **v2** — Extend the same shared reveal utility and header to location pages, service pages, project detail pages, and blog — no new design work required, just applying the existing system since it's built as a reusable layer from the start. Entry sequence stays homepage-only (per-session, never on subpages).

---

## 7. Why this works for this audience

The "cinema set" feeling lives in typography, color, the live timecode, the logo draw, and the scene tag — all universally legible, no explanation needed. The "tech showcase" feeling (jargon HUD data, blocking loaders, unconventional scroll) is stripped out. A 19-year-old social media manager and a 55-year-old factory owner should both understand, within two seconds on any page of the site, what this business does and what to click — the animation's only job is to make the studio's own identity (set, scene, take, color) felt in motion, consistently, everywhere, without ever getting in the way.
