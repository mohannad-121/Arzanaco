# Engineering Design & Calculations implementation audit

## Integration

- Public route: `/engineering-design-calculations`.
- Header/mobile menu: Engineering Design, immediately after Testing & Commissioning. Arabic label: التصميم الهندسي. Footer quick link added.
- Homepage: sixth Business Areas card; balanced four-column, two-row desktop grid, retaining the existing card style.
- Full English and Arabic content, RTL compositions, LTR software badges, sticky/horizontally scrollable service navigation, accessible four-image lightboxes, and reduced-motion support.
- Existing RequestQuoteButton links to `/request-quote`. No service query parameter or invented catalog product IDs; the existing form requires catalog selections.
- Existing floating assistant reads the same approved service content and provides engineering-page/quote actions. Its internal action allow-list was extended narrowly. The launcher is hidden while the mobile panel is open so it cannot cover Send.
- Route-level title, description, canonical, OG, Twitter and BreadcrumbList metadata; static engineering HTML for direct visits/social crawlers, using the existing Vite/Vercel deployment. No new Service schema. Sitemap and robots updated.
- Illustrative stock photography only. No completed-project, certification, price, license, guarantee or software-partnership claims.

## Exact production photo mapping

All paths below are relative to `Engineering Design & Calculations photos/`. Each service uses exactly its four category images. The structural first image is also the decorative hero duplicate.

| Service / software | JPG files |
| --- | --- |
| Structural Analysis & Design — SAP2000 or STAAD.Pro | `structural/01-steel-truss-framework.jpg`, `structural/02-steel-building-frame.jpg`, `structural/03-commercial-building.jpg`, `structural/04-concrete-frame-construction.jpg` |
| HVAC Load Calculations & Equipment Sizing — Carrier HAP or Elite CHVAC | `hvac/01-commercial-ductwork.jpg`, `hvac/02-ventilation-louvre.jpg`, `hvac/03-air-conditioning-unit.jpg`, `hvac/04-ceiling-air-distribution.jpg` |
| Foundation & Anchorage Design — SAFE; IDEA StatiCa for applicable connection/anchorage checks | `foundations/01-foundation-excavation.jpg`, `foundations/02-reinforcement-mat.jpg`, `foundations/03-raft-foundation-construction.jpg`, `foundations/04-concrete-foundation-placement.jpg` |
| Lighting Calculations & Design — DIALux evo or AGi32 | `lighting/01-office-lighting.jpg`, `lighting/02-warehouse-lighting.jpg`, `lighting/03-exterior-wall-lighting.jpg`, `lighting/04-architectural-lighting.jpg` |

Mapping and intrinsic dimensions come from `image-metadata.json`, keyed by its exact file field (candidate IDs are not sequential). English alt text is the supplied `alt_text`; Arabic alt text is a faithful translation. The repeated decorative hero has empty alt. Below-fold images are lazy-loaded; the hero is prioritized. Galleries frame images with object-fit, and lightboxes show their complete aspect ratio.

`engineering-photo-preview.jpg` and `lighting-photo-preview.jpg` are retained as repository references but are not imported or emitted into the production bundle. `photo-credits.md`, metadata and drafting copy are preserved unchanged.

## Validation

- Entire workspace typecheck and production build pass. Existing non-blocking select sourcemap / large main-chunk warnings remain.
- Nine Node tests cover all 16 actual JPG paths and metadata mappings, all ten required assistant questions, Arabic, unsupported claims, safe actions, sitemap/rewrite, existing AI input validation and other services, and existing quote validation/Resend payload/WhatsApp completion with mocked delivery only.
- Browser checks cover EN/AR at 1600, 1440, 1280, 1024, 834, 820, 768, 430, 390 and 360 px: one H1, four service regions, 16 resolving gallery images, body type >=16 px, LTR badges, RTL, canonical metadata and no horizontal overflow. Mobile/tablet menu open/Escape/body-scroll restoration, four anchors and lightbox arrows/Escape/focus return checked.
- Existing homepage, About, Products, live product detail, Testing, Safety, Clients, Contact, Request Quote, AI landing page, Privacy and admin authentication checked. Engineering CTA/SPA scroll-to-top/SEO cleanup and actual floating assistant API replies/actions checked in both languages.
- Read-only live Supabase catalog returned 42 products and eight categories. The existing quote UI keeps its required p43 fallback, totaling 43 selectable products. No catalog IDs/slugs/content or database records were changed.
- Real quote emails and authenticated admin saves were intentionally not executed. Resend was verified with mocked delivery; admin authentication remains present, and admin/backend/contact configuration was left unchanged.

Re-run feature tests with `node --test scripts/engineering.test.mjs`. Browser audit requires the installed agent-browser CLI path in `AGENT_BROWSER_CLI`; defaults to `http://localhost:5173`, or use `AUDIT_BASE_URL`. Screenshots go to ignored `tmp/`.

## Sources and environment notes

- The supplied `Descriptions.pdf` contains one page and the approved four services. Its filename differs from the prompt's `Descriptions(2).pdf`; content agrees. PDF content takes precedence over drafting copy.
- Source image dimensions agree with metadata, but stored byte-size fields describe earlier downloads. No source files/metadata were rewritten to hide that discrepancy.
- Existing OriginKit-derived coverflow/orbit resources were inspected; their continuous movement was not forced into this page. UI/UX Pro Max informed spacing, accessibility, responsive compositions and restrained interaction; existing Arzana tokens take precedence over generic skill design suggestions.
- Windows dependency installation required a short local virtual-store path, `D:\az-eng-deps`, with pnpm 10.30.3. No deployment install command, lockfile, dependency version or tracked npm configuration was changed for this workaround.
- Latest main (`f889436`) was fast-forward merged. Fetch downloaded its valid objects but reported an unrelated stale Codex checkpoint ref; the remote-tracking main ref was updated to the exact `git ls-remote` hash without deleting internal refs or project changes.
- Unrelated pre-existing `.npmrc`, `.agents`, package-lock, hero/video files are excluded from the feature commit.

## Changed file groups

- Shared data/API: `lib/arzana-catalog/src/engineering.ts`, its package subpath export, and `api/arzana-ai.ts`.
- New frontend: engineering page/CSS, image data, EngineeringServiceSection, EngineeringImageGallery and EngineeringSeo.
- Integration: App router, Header, Footer, homepage, EN/AR translations, floating ArzanaAssistant and optional backward-compatible DialogContent props.
- SEO/build: engineering-seo-plugin, Vite alias/plugin, sitemap, robots and one exact Vercel route rewrite.
- Tests/documentation: engineering.test.mjs, engineering-browser-audit.mjs and this audit.
- Assets: supplied 16 JPGs and five supporting/reference files.
