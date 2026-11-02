---
target: blog listing, article detail hero, homepage, blog covers
total_score: 26
max_score: 36
na_heuristics: 10
p0_count: 1
p1_count: 3
timestamp: 2026-08-25T05-41-17Z
slug: ite-wide-blog-listing-article-hero-homepage-covers
---
Method: dual-agent (A: afbc63b96285f1421 · B: a403d9409a5f56aee)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Pagination click now scrolls to results (fixed this run); minor gap remains on "hace 0 dias" wording for same-day posts |
| 2 | Match Between System and Real World | 3 | Spanish-first content is natural; "hace 0 dias" instead of "hoy" is the one awkward phrase |
| 3 | User Control and Freedom | 3 | Clear search-X, "Limpiar filtros", breadcrumbs on article pages; no URL-persisted filter state so a refresh loses search/tags/page |
| 4 | Consistency and Standards | 3 | Card component now reused consistently everywhere; cover-art collisions (was the biggest inconsistency) fixed this run. Title voice still swings formal/casual across posts |
| 5 | Error Prevention | 3 | No destructive actions on this surface; nothing to prevent |
| 6 | Recognition Rather Than Recall | 3 | Tag pills and search are visible, not hidden; cover art now reliably distinct so it works as a recognition cue |
| 7 | Flexibility and Efficiency of Use | 2 | No sort options, no URL-synced filters, no keyboard shortcuts; search+filter+pagination are real accelerators though |
| 8 | Aesthetic and Minimalist Design | 3 | Card grid is clean and uniform-height regardless of content length; mobile blog-listing first viewport is filter-panel-only with zero article content, which reads as clutter-before-substance |
| 9 | Error Recovery | 3 | Empty-state has icon+heading+guidance; Banner has a defensive image-load fallback |
| 10 | Help and Documentation | n/a | Persuade/Experience-mode surface (portfolio + blog); not a task-based app |

**Total: 26/36 (applicable max, #10 n/a) - 72.2% - Good.**

## Design Specificity Verdict

**LLM assessment:** The card grid pattern itself (image-top, glassmorphism tag pills, 2-line clamped title) is a well-executed but genuinely generic 2024-era blog-card pattern - it would drop unchanged into any SaaS blog. The one deliberately bespoke idea - procedurally generated, topic-matched cover art instead of stock photos or repeated placeholders - is the actual differentiator, and it is the thing that was broken (see below, now fixed). With unique covers per post, the specificity verdict improves materially: scrolling the grid now shows a shield, a database cylinder, a node network, a search icon, a gauge, etc., each legitimately tied to its post's topic - that reads as authored, not templated.

**Deterministic scan:** detect.mjs flagged 2 items across the changed files: a border-l-4 side-tab accent on the article intro paragraph (ArticleBody.jsx:40, browser-confirmed) and a bounce-easing (animate-bounce, Tailwind) on the homepage's scroll-down hint (Banner.jsx:219, detector-reported, not independently browser-triggered). Both are minor "slop" category flags, not defects.

**Browser evidence (critical finding, now fixed):** Assessment B ran SHA-256 hashing across all cover images on disk and found 19 of 50 files were byte-for-byte duplicates across 6 collision groups - most severely, 6 completely unrelated posts (Docker, WordPress migration, image optimization, content planning, and 2 SEO posts) all rendered the identical gray magnifying-glass cover. Root cause: the topic-matching logic checked title+tags combined, and the AI-generated batch of posts tags almost everything with the same boilerplate set (desarrollo web, javascript, react, next.js, seo), so the generic "seo" tag alone was enough to collide 6 unrelated posts onto the same icon. A second layer of the bug: even after fixing title-only matching, the fallback hash only has 48 possible variant+icon combinations for 29 posts, so plain hashing still collided in practice (confirmed empirically). Fixed during this critique: theme matching now checks the title only (tags dropped from the match), and a new catalog-aware allocator (regenerateAllCovers() in cover.mjs) tracks which combos are already claimed across the whole batch and walks to a free one instead of colliding - verified via a second full SHA-256 pass: zero duplicate covers remain across all 29 posts.

## Overall Impression

The homepage hero is the strongest single moment on the site - confident, warm, immediately reads as "competent modern developer." The blog card redesign this session (image-top, uniform height, clamped text) is solid, disciplined component craft. The single biggest problem found - cover art colliding across unrelated posts, undermining the one bespoke idea in the rework - has been fixed and verified during this critique, along with a broken heading hierarchy (13 h1 elements on one page, now 1) and unlabeled pagination buttons. What's left is smaller: a mobile blog-listing page that's 100% filter chrome with zero visible content on first scroll, and no persisted filter state across refreshes.

## What's Working

1. **Uniform card geometry under real content variance** - measured all 12 cards on /posts at identical height regardless of 1-tag vs. 3-tag posts or 1-line vs. 2-line titles; the min-h reservation plus line-clamp-2 on title and description never lets the grid waterfall.
2. **Tag-pill contrast over the cover images is genuinely solid** - measured 10.9:1-12.1:1 for the white glassmorphism pill text against the actual served covers, well above WCAG AA's 4.5:1, because the generator's palettes are deliberately near-black and the pills sit away from the brighter icon glow.
3. **Defensive image fallback in the hero** (Banner.jsx's onError handler falling back to a bundled static image if the Supabase-hosted photo 404s) - the kind of edge-case handling most single-developer portfolios skip.

## Priority Issues

**[P0] Cover-art generator producing duplicate images across unrelated posts - FIXED this run.** Root cause (title+tag matching plus insufficient fallback entropy) corrected in src/services/cover.mjs; all 29 covers regenerated and verified unique via SHA-256. No action needed, noted for the record since it was the most severe finding.

**[P1] Blog listing has zero article content on the first mobile viewport.** On a 375x812 screen, the search bar + 10-button tag-filter row consume the entire first screen; the first card doesn't appear until ~798px down. A mobile visitor sees no proof of content before scrolling.
- **Fix:** Collapse the tag-filter row behind a toggle on mobile (the Projects section already has this pattern for its category dropdown - reuse it), or show 2-3 cards above the filter panel.
- **Suggested command:** /impeccable adapt

**[P1] Pagination doesn't return the user to the content it just changed - FIXED this run.** Clicking next/prev now scrolls the results grid into view (goToPage in FilteredPosts.jsx), and both buttons got aria-labels (previously empty-text icon-only buttons with no accessible name).

**[P1] Heading hierarchy was broken: 13 h1 elements on one page - FIXED this run.** All 12 article-card titles were rendered as h1 alongside the real page h1. Changed to h3 in ArticleCard.jsx.

**[P2] Tag taxonomy has collapsed into near-uselessness for filtering.** 6 of the 12 posts on listing page 1 share the exact same 3-tag set (desarrollo web, javascript, react), inherited from the AI-generated batch. The filter row surfaces 10 buttons but several barely discriminate the actual result set - also directly caused the P0 cover collision.
- **Fix:** Re-tag the catalog with more specific tags; cap the visible filter row at 5-6 with the rest under "mas temas."
- **Suggested command:** /impeccable clarify

**[P2] No URL-persisted filter/search/page state.** Refreshing /posts mid-search loses the search term, selected tags, and current page - a filtered view can't be bookmarked or shared.
- **Suggested command:** /impeccable harden

**[P3] Hero action pills are under the mobile touch-target minimum.** Measured the CV/LinkedIn/GitHub/TikTok/Contacto/Proyectos pills in Banner.jsx at 25.3px tall on mobile, against the 44x44pt guideline - these are the primary conversion actions for the recruiter/client audience.
- **Suggested command:** /impeccable adapt

## Persona Red Flags

**Riley (Deliberate Stress Tester):** Checking the cover-art system against the full catalog (not just 1-2 sample posts) is exactly what surfaced the P0 collision - now fixed. Riley would still hit refresh mid-filter-session and lose search/tags/page (no URL sync, P2 above).

**Casey (Mobile User):** Two concrete hits - the sub-44px hero pills (P3) sitting in the primary thumb zone, and landing on /posts on a phone with zero article content visible until a near-full-screen scroll (P1) - exactly the pattern that makes an interrupted mobile visitor bounce before seeing the content they came for.

**Alex (Power User / recruiter skimming many posts fast):** No sort options (newest is hardcoded), no keyboard shortcuts, and the lost-filter-state-on-refresh issue means Alex can't bookmark or share a filtered view (e.g. "all Next.js posts") to send to someone else.

## Minor Observations

- "hace 0 dias" for a same-day post reads awkwardly in Spanish; "hoy" would be more natural.
- Post title voice is inconsistent - formal/technical titles sit next to casual/emoji ones ("...conceptos", "Deja de usar &&") in the same grid.
- Article body content uses numbered academic section headings ("1. Introduccion contextual", "2.1 Que es...") that read more like a technical report than the personable, first-person hero copy ("Hola, soy Jaime").
- ArticleBody.jsx's cover image has a hover:scale-105 transform with no functional purpose on a static, non-clickable hero - likely copy-pasted from the card component where the same hover does make sense.
- Detector flagged border-l-4 side-tab accent (ArticleBody.jsx:40) and animate-bounce easing (Banner.jsx:219) as minor "slop" patterns - neither is broken, both are stylistic and low priority.

## Questions to Consider

1. Now that covers are guaranteed unique, is 6 color palettes x 8 icons (48 combos) enough headroom as the blog grows past ~40 posts, or should the palette/icon set expand alongside the catalog?
2. Is the numbered-academic-essay structure of the article body ("1. Introduccion contextual") intentional for SEO/structure reasons, or should it read more like the conversational voice used elsewhere on the site?
