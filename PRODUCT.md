# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two primary audiences, both evaluating whether to bring Jaime Tarazona Rodriguez onto a project or team:

- **Recruiters and companies** assessing him for a hiring process: they land here to validate real technical experience before or during an interview.
- **Freelance/agency clients** deciding whether to hire him for a project: they want to see real, shipped work, the technologies involved, and evidence he can deliver.

Developers reading the technical blog are a secondary audience.

## Product Purpose

A professional portfolio + technical blog that gets Jaime hired, either into a role or onto a freelance/agency project. The home is centred on his **professional experience** (roles, companies, dates, skills); projects are a secondary strip and live on their own pages. Success means a recruiter or prospective client leaves convinced he can do the work and moves to a conversation.

## Positioning

Practical AI applied to real development work, not AI as a blog topic or a buzzword: AI actually used in his workflow and shipped in client products.

## Operating Context

- Bilingual site (ES default, EN available) via `src/middleware.js` locale routing; every surface works in both languages.
- **All content comes from the DEVMARK ERP** (admin.devmarkpe.com, view JaimeTR) through its public API: profile, experience, skills, portfolio projects and blog articles. Nothing is hardcoded and there is no admin in this repo. Edits are made in the ERP and reach the site within ~10 minutes (ISR).
- Blog articles are HTML stored in the ERP (29 ES, 19 with an EN pair); they can be shared with devmarkpe.com through the ERP's "mostrar en" setting.
- Deployed on Vercel from `main`; SEO matters directly (often the first thing a recruiter or client finds).

## Capabilities and Constraints

- Dark is the site's identity (deep navy). There is no light theme; the theme switch was removed.
- Bilingual ES/EN end to end (content, UI strings, metadata); no feature ships ES-only.
- Required environment variables: `ERP_API_URL`, `SITIO_SIGNING_SECRET`, `SUPABASE_URL_ERP_IMAGENES`.
- Scroll effects use Lenis + GSAP ScrollTrigger on the home; all content stays visible without JS and with `prefers-reduced-motion`.

## Brand Commitments

- Name: Jaime Tarazona Rodriguez. Roles used in copy: Systems Engineer, Full-Stack Developer, Web Developer.
- Colour: Jaime's celeste (`#00a8e8`, soft `#75dbff`) on a deep navy base. Visual language follows devmarkpe.com (floating windows, serif-italic emphasis words, rounded buttons) in Jaime's palette, not DEVMARK's indigo.
- Social presence: LinkedIn, GitHub, TikTok, direct email, all linked from the header/footer.

## Evidence on Hand

- Real, shipped client projects (46 visible in the ERP): WordPress sites, e-commerce, SaaS dashboards, real-estate CRMs, clinic and business sites.
- Real work history since April 2019: freelance, Devmark, Universidad Cesar Vallejo, Impulso Digital - Taklab, MeM Tecnologia.
- Technical blog with original and AI-assisted posts. No claims, clients or metrics are invented anywhere: figures shown come from the data.

## Product Principles

1. Every surface exists to move a recruiter or client from "found the site" to "wants to talk": evidence and clarity beat decoration.
2. AI is a demonstrated capability, not a decoration.
3. Dark, bilingual, real-data: these three are load-bearing.
4. Content quality is part of the product: thin or templated content undermines the credibility the site exists to build.
