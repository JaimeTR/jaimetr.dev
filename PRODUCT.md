# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two primary audiences, both evaluating whether to bring Jaime Tarazona Rodriguez onto a project or team:

- **Recruiters and companies** assessing him for a hiring process — they land here to validate real technical experience before or during an interview.
- **Freelance/agency clients** deciding whether to hire him for a project — they want to see real, shipped work, the technologies involved, and evidence he can deliver.

Developers reading the technical blog are a secondary audience, not the primary one the site is designed around.

## Product Purpose

A personal portfolio + technical blog that gets Jaime hired — either into a role or onto a freelance/agency project. Success means a recruiter or prospective client leaves convinced he can do the work, with enough real evidence (shipped projects, technical writing, experience) to move to a conversation.

## Positioning

Practical AI applied to real development work — not AI as a blog topic or a buzzword, but AI actually used in his workflow and shipped in client products. This is the claim a generic "full-stack developer portfolio" competitor could not truthfully copy: most portfolios either ignore AI or treat it as a talking point; his projects and workflow actually use it.

## Operating Context

- Bilingual site (ES default, EN available) via `src/middleware.js` locale routing — every surface must work in both languages.
- Real project data is managed through a Supabase-backed admin dashboard (`/admin`), not hardcoded — the public `/projects` gallery and homepage projects section read live from the `projects` table.
- Blog posts are MDX files (`src/posts/`), some hand-written, some AI-assisted (Groq) through an in-repo generation pipeline (`src/services/ai.mjs`, `scripts/generate-blog.mjs`). AI-assisted posts must read as genuinely useful, specific technical content — a prior batch of templated/generic AI content was found and rewritten this session because it read as low-effort and risked search-engine penalties.
- Deployed target is a live, publicly indexed website (SEO matters directly — this is often the first thing a recruiter or client finds).

## Capabilities and Constraints

- Dark theme is the site's visual identity — not a preference to be defaulted away from; any future design work keeps dark as the primary/default mode.
- Bilingual ES/EN must be maintained end to end (content, UI strings, metadata) — no feature ships ES-only or with untranslated UI chrome.
- Real project/case-study content lives in Supabase, not in static files — future work should not reintroduce a parallel hardcoded project list (this happened before and produced fake/placeholder projects that got indexed by Google).
- CV/resume is a hosted PDF (Supabase storage), linked from the header.

## Brand Commitments

- Name: Jaime Tarazona Rodriguez. Roles used in copy: Systems Engineer, Full-Stack Developer, Web Developer.
- Social presence: LinkedIn, GitHub, TikTok, direct email contact — all linked from the header/hero.
- Primary accent: blue/cyan gradient on dark backgrounds (see existing hero/nav styling) — not yet formally documented as a token system.

## Evidence on Hand

- Real, shipped client projects (Supabase `projects` table) — WordPress sites, e-commerce, SaaS dashboards, real-estate CRMs, clinic/business sites, spanning multiple industries and countries.
- Real work history: WordPress/full-stack roles at MeM Tecnologia (Spain), Impulso Digital–Taklab, and a university research-systems project (Universidad Cesar Vallejo).
- Technical blog with both original hand-written posts (2022–2023) and newer AI-assisted posts (audited and rewritten for genuine substance this session).
- No case-study-level breakdowns (problem/solution/results narrative) exist yet for individual projects — the current project detail is whatever the Supabase record + external link provide, not a rich in-site case study.

## Product Principles

1. Every surface exists to move a recruiter or client from "found the site" to "wants to talk" — evidence and clarity beat decoration.
2. AI is a demonstrated capability, not a decoration — where AI shows up in the product (blog generation, mentions in project work), it should be genuinely functional, not cosmetic.
3. Dark-first, bilingual, real-data — these three are load-bearing and not up for silent revision in future work.
4. Content quality is part of the product: thin or templated content undermines the same credibility the site exists to build.
