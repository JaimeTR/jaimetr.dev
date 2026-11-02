---
target: projects gallery, project viewer modal, welcome screen, homepage sections
total_score: 23
max_score: 36
na_heuristics: 10
p0_count: 1
p1_count: 2
timestamp: 2026-08-25T06-55-16Z
slug: projects-gallery-viewer-welcome-screen
---
Method: dual-agent (A: acba48cd0279b6e99 - B: a806e728a428dc8a1)

Note: the Browser pane did not composite frames this session (document.hidden stayed true across both assessments and my own follow-up checks - confirmed via document.visibilityState), so live pixel screenshots of the Projects gallery, ProjectViewer modal, and homepage sections were not obtainable this pass. Both assessments compensated with accessibility-tree reads, direct DOM queries, and source-code cross-reference, which is how the findings below were actually verified (not guessed). This is flagged per the skill's degraded-run rule even though both assessments still ran as isolated dual agents.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | ProjectViewer showed up to 8s of unexplained spinner before failing, no progress signal - shortened to 6s this run, escape hatch (open-in-new-tab icon) already existed throughout but was unlabeled |
| 2 | Match Between System and Real World | 3 | Copy reads naturally in both locales now that the modal is translated |
| 3 | User Control and Freedom | 3 | Mobile category dropdown now has proper open/close state, Escape key, and click-outside dismissal (was raw classList mutation with none of that) - fixed this run |
| 4 | Consistency and Standards | 2 | Was 1/4: ProjectViewer had zero i18n, WelcomeScreen subtitle was English-only regardless of locale, Navbar hamburger and Chatbot aria-labels were hardcoded Spanish - all fixed this run. Still open: no case-study layer around projects, no visible in-product evidence of the "AI" positioning claim |
| 5 | Error Prevention | 2 | Iframe preview still has no upfront signal about which project sites will actually preview (WordPress sites commonly block iframing) - not fixed this run, flagged as P1 below |
| 6 | Recognition Rather Than Recall | 3 | Category pills and card grid are scannable and consistent |
| 7 | Flexibility and Efficiency of Use | 2 | No search/sort on the Projects page, no way to jump to the strongest project first |
| 8 | Aesthetic and Minimalist Design | 3 | Visually clean, dark theme respected, glassmorphic cards restrained |
| 9 | Error Recovery | 3 | Error state in ProjectViewer is clear and now bilingual with an immediate "open in new tab" fallback |
| 10 | Help and Documentation | n/a | Not applicable to this surface type |

**Total: 23/36 (applicable max, #10 n/a) - 63.9% - Acceptable.**

## Design Specificity Verdict

**LLM assessment:** The Projects page pattern (name-gate -> filter pills -> glassmorphic grid -> iframe-preview modal) is a competent but generic portfolio-template shape - nothing about the structure alone signals this is Jaime specifically. The one place PRODUCT.md's stated positioning ("practical AI applied to real development work, not a blog topic") should show up as product evidence - the Projects page itself - currently does not demonstrate it: the "Inteligencia Artificial" category filter exists but whether any real project is tagged into it depends entirely on live Supabase data with no code-level guarantee, and the one concrete AI artifact found in the codebase (a link to a real deployed AI assistant, InoIA) only renders in a fallback code path that admin-dashboard content edits could silently remove. The claim is real (confirmed via source) but not durably wired into the product - it currently survives by accident, not by design.

**Deterministic scan:** detect.mjs flagged 7 warnings across the reviewed files - 6 are `gradient-text` (bg-clip-text) hits in WelcomeScreen, StatsCard, and Stack.jsx (a known AI-generated-design smell for overusing gradient text as a crutch), and 1 `gray-on-color` hit in ProjectViewer.tsx that both assessments agree is a false positive (the gray text and red background are on mutually-exclusive default/hover states, never rendered simultaneously). The gradient-text pattern is already an established part of the site's stated brand accent (PRODUCT.md notes "blue/cyan gradient on dark backgrounds" as a Brand Commitment) - flagged for awareness, not treated as a defect to fix.

**Browser evidence:** Blocked this pass by the Browser pane not compositing (see note above). Both assessments independently hit the same `document.hidden: true` condition and reported it transparently rather than fabricating screenshots. DOM-level facts were still gathered and are the basis for every fix below.

## Overall Impression

The real fixes this pass were concrete and code-verified: the single most-used interaction on the Projects page (the ProjectViewer modal) was showing 100% Spanish UI to English-locale visitors, which directly violated PRODUCT.md's own stated constraint. That's fixed, along with three other hardcoded-Spanish spots (Navbar menu button, Chatbot buttons, "Sin enlace" fallback) and a real accessibility gap in the mobile category dropdown (no state, no Escape, no click-outside). What's left is more structural: the iframe-preview's reliability against real WordPress sites, the mandatory WelcomeScreen gate adding friction before any project is visible, and the "AI" positioning claim having no durable, code-enforced evidence on the page that's supposed to prove it.

## What's Working

1. **Real-data architecture is sound** - ProjectGallery.tsx reads live from Supabase with proper `is_visible`/`sort_order`/`is_featured` handling, no hardcoded placeholder projects, correctly avoiding the exact "fake indexed projects" mistake documented in PRODUCT.md's Capabilities and Constraints.
2. **Bilingual string-table coverage is genuinely thorough** at the translations.js level - every category label and gallery microcopy string had full ES/EN parity already; the gaps found were specifically in components that bypassed the translation system with hardcoded strings, not gaps in the table itself.
3. **The iframe "browser chrome" modal is a distinctive, well-designed idea when it works** - a live interactive preview is stronger trust-building evidence than a static screenshot, directly serving the "client evaluating trust" persona.

## Priority Issues

**[P0] ProjectViewer.tsx had zero i18n - FIXED this run.** Added useLanguage/useTranslation, translated all four hardcoded Spanish strings (close/open-in-new-tab titles, error heading, error body), added matching aria-labels. Also fixed "Sin enlace" in ProjectCard.tsx, the Navbar hamburger aria-label, and two Chatbot aria-labels - all were hardcoded Spanish regardless of locale.

**[P1] Iframe preview has no upfront signal about which project sites will actually preview successfully.** WordPress sites (a real share of the project book per PRODUCT.md) commonly send X-Frame-Options/CSP headers that block iframing - the failure is only discovered after a multi-second wait. Timeout shortened from 8s to 6s this run as a partial mitigation; the open-in-new-tab escape was already visible throughout (not only after failure, contrary to what the initial review assumed) but was unlabeled until this run.
- Fix: consider a server-side or build-time check per project link_url to pre-flag iframe-unfriendly domains and skip straight to "open in new tab" for those specific cards.
- Suggested command: /impeccable harden

**[P1] Mobile category dropdown bypassed React state entirely - FIXED this run.** Converted to proper useState, added aria-expanded/aria-haspopup, Escape-to-close, and click-outside dismissal via a document listener.

**[P2] WelcomeScreen gate adds a mandatory, non-skippable extra step on every visit with no memory across a session.** Its subtitle text is now bilingual (fixed this run), but the gate itself still always shows, even on repeat visits within the same session.
- Suggested command: /impeccable adapt

**[P3] "Practical AI" positioning has no durable, code-enforced evidence on the Projects page or homepage.** The one concrete AI artifact (a real deployed AI assistant link) lives in a fallback code path that CMS-edited content could silently override; the AI category filter's population is unverifiable from code alone.
- Fix: consider a Supabase-backed "AI-powered" badge on ProjectCard, driven by a column rather than admin-editable prose, so the stated differentiator survives content changes.
- Suggested command: /impeccable clarify

## Persona Red Flags

**"Recruiter skimming fast" (from PRODUCT.md Users):** hits the WelcomeScreen gate before any project evidence, then risks a multi-second dead-end on the exact click meant to prove a project is real (P1 above) - every friction point stacks against this persona's time budget specifically.

**"Client evaluating trust" (from PRODUCT.md Users):** the iframe-preview pattern is the site's boldest trust-building idea but its reliability against his own real project mix (WordPress-heavy) is unverified and untested against failure. No case-study narrative (problem/solution/role) exists around any project yet - a client sees that something shipped, not why it mattered or what he specifically did.

**Sam (accessibility-dependent):** the floating contact-dock icons (LinkedIn/GitHub/Email/WhatsApp) relied solely on `title` for their accessible name - explicit aria-label added this run as a reliability fix (title-only accessible names are inconsistently announced across screen readers).

## Minor Observations

- StatsCard defaults to an animated count-up from 120 to 360 over 12 seconds before Supabase data overrides it - a visitor who doesn't linger a third of a minute never sees the real number settle, and 360 is an arbitrary placeholder that could read as a real stat if the backing column is ever empty.
- Footer end-of-page on /projects is a plain copyright line with no CTA, despite a full contact dock already on-screen the whole time - the two could be merged into one purposeful closing moment instead of a decorative floating dock plus a dead-end footer, given PRODUCT.md's own Principle #1 ("every surface exists to move toward wants to talk").
- Detector's 6 gradient-text hits are an established brand pattern per PRODUCT.md, not treated as defects here - worth a deliberate check that it's not overused to the point of diminishing its own emphasis value as more sections adopt it.

## Questions to Consider

1. Is a mandatory-every-visit WelcomeScreen gate solving a real problem for the recruiter/client personas, or is it primarily aesthetic ceremony that could instead spotlight the single most impressive project first?
2. Given the AI positioning claim currently depends on whichever admin-dashboard content happens to be live, is a code-enforced "AI-powered" project badge worth the schema change to make the differentiator durable rather than accidental?
