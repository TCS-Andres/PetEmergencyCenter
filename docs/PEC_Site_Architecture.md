# Pet Emergency Center — Site Architecture

> **What this is:** Information Architecture (IA) document defining every page on the Pet Emergency Center website, navigation hierarchy, URL slugs, and implementation requirements.
>
> **What this is NOT:** A `sitemap.xml` file (generated automatically by the CMS) or a visual sitemap diagram.
>
> **Tagline:** Compassionate Care. Always Here.

---

## Status Legend

- **[EXISTING]** — Page exists on current site. Will be redesigned, not rebuilt. URL slug must be preserved.
- **[NEW]** — Page does not exist. Build during redesign.
- **[PHASE 2]** — Strategic addition. Build after launch.

---

## 1. Primary Navigation

### Utility Bar (above primary nav, sticky on scroll)
- Phone: `(954) 772-0420` — click-to-call enabled
- "Book Telehealth" CTA button (red, sticky, persists on scroll)

### Main Nav

- **Home** → `/` — [EXISTING]
- **About** (dropdown)
  - Our Team → `/our-team/` — [EXISTING]
  - Our Story → `/our-story/` — [NEW]
- **Services** (dropdown)
  - Emergency & Critical Care → `/emergency-critical-care/` — [EXISTING]
  - Emergency Surgery → `/emergency-surgery/` — [EXISTING]
  - Telemedicine → `/telemedicine/` — [EXISTING]
  - Pain Management → `/pain-management/` — [EXISTING]
  - Diagnostics → `/diagnostics/` — [EXISTING]
  - Pharmacy Services → `/pharmacy-services/` — [EXISTING]
- **Resources** (dropdown)
  - Common Emergencies → `/common-emergencies/` — [EXISTING]
  - Pet Emergency Tips → `/pet-emergency-tips/` — [EXISTING]
  - Seasonal Health Tip → `/seasonal-tip/` — [EXISTING]
  - Payment Plans → `/payment-plans/` — [EXISTING]
  - Blog → `/blog/` — [NEW]
- **Contact Us** → `/contact-us/` — [EXISTING]

---

## 2. Footer Structure

### Column 1 — For Pet Owners
- Review Us → `/review-us/` — [EXISTING] *(moved from primary nav)*
- Pet Rescue Groups → `/pet-rescue-groups/` — [EXISTING]
- Educational Links → `/educational-links/` — [EXISTING]
- Pet Insurance (Trupanion) → external link — [EXISTING]

### Column 2 — For Veterinarians
- Referring Hospitals → `/referring-hospitals/` — [EXISTING]
- Career Opportunities → `/career-opportunities/` — [EXISTING]

### Column 3 — Contact & Hours
- NAP block (Name, Address, Phone)
- Embedded map link
- Operating hours (weeknights 5 PM – 8 AM; 24/7 weekends & holidays)
- Social media icons (Facebook, Instagram)

### Bottom Bar
- Privacy Policy → `/privacy-policy/` — [NEW]
- Terms of Service → `/terms/` — [NEW]
- Accessibility Feedback → `/accessibility-feedback/` — [EXISTING]
- Copyright line

---

## 3. Hidden & Conversion-Flow Pages (not in nav)

- Telehealth Booking Thank You → `/telemedicine/thank-you/` — [NEW]
- Contact Form Thank You → `/contact-us/thank-you/` — [NEW]
- Email Unsubscribe → `/unsubscribe/` — [NEW]
- Custom 404 Page → `/404/` — [NEW]

---

## 4. Phase 2 Strategic Additions

### Local SEO — City Pages
- Areas We Serve Hub → `/areas-we-serve/` — [PHASE 2]
- Emergency Vet Fort Lauderdale → `/emergency-vet-fort-lauderdale/` — [PHASE 2]
- Emergency Vet Pompano Beach → `/emergency-vet-pompano-beach/` — [PHASE 2]
- Emergency Vet Coral Springs → `/emergency-vet-coral-springs/` — [PHASE 2]
- Emergency Vet Boca Raton → `/emergency-vet-boca-raton/` — [PHASE 2]
- Emergency Vet Hollywood FL → `/emergency-vet-hollywood-fl/` — [PHASE 2]
- Emergency Vet Weston → `/emergency-vet-weston/` — [PHASE 2]

### Species-Specific Pages
- Dog Emergency Care → `/dog-emergency-care/` — [PHASE 2]
- Cat Emergency Care → `/cat-emergency-care/` — [PHASE 2]
- Exotic Pet Emergency Care → `/exotic-pet-emergency/` — [PHASE 2]
- Bird Emergency Care → `/bird-emergency-care/` — [PHASE 2]

### Blog Categories (for 16 planned SEO posts)
- Toxins & Poisoning → `/blog/category/toxins/` — [PHASE 2]
- Seasonal Emergencies → `/blog/category/seasonal/` — [PHASE 2]
- Symptoms & When to Come In → `/blog/category/symptoms/` — [PHASE 2]
- Recovery Stories → `/blog/category/recovery-stories/` — [PHASE 2]

---

## 5. Complete URL Map (Flat List)

### Existing Pages (redesign) — 19 total
```
/
/our-team/
/emergency-critical-care/
/emergency-surgery/
/telemedicine/
/pain-management/
/diagnostics/
/pharmacy-services/
/common-emergencies/
/pet-emergency-tips/
/seasonal-tip/
/payment-plans/
/review-us/
/pet-rescue-groups/
/educational-links/
/referring-hospitals/
/career-opportunities/
/contact-us/
/accessibility-feedback/
```

### New Pages (launch scope) — 8 total
```
/our-story/
/blog/
/telemedicine/thank-you/
/contact-us/thank-you/
/unsubscribe/
/404/
/privacy-policy/
/terms/
```

### Phase 2 Pages — 15 total
```
/areas-we-serve/
/emergency-vet-fort-lauderdale/
/emergency-vet-pompano-beach/
/emergency-vet-coral-springs/
/emergency-vet-boca-raton/
/emergency-vet-hollywood-fl/
/emergency-vet-weston/
/dog-emergency-care/
/cat-emergency-care/
/exotic-pet-emergency/
/bird-emergency-care/
/blog/category/toxins/
/blog/category/seasonal/
/blog/category/symptoms/
/blog/category/recovery-stories/
```

**Page count totals:**
- Launch scope: 27 pages (19 existing + 8 new)
- Full build-out: 42 pages

---

## 6. Navigation Change Rationale

### Change 1: "Review Us" removed from primary nav
Current site has Review Us as a top-level nav item. A first-time visitor in crisis does not need to be asked for a review before they call. Moved to footer, post-discharge email flow, and post-visit text automation — where it converts better anyway.

### Change 2: "About" group added
Dr. Kiser's credentials and the independent/locally-owned story currently have no dedicated home. "Our Team" alone carries all the authority weight. Grouping "Our Story" + "Our Team" under "About" gives the StoryBrand guide positioning a proper container.

### Change 3: "Resources" dropdown trimmed
Career Opportunities, Pet Rescue Groups, Referring Hospitals, and Pet Insurance are legitimate pages but don't serve the primary user. Moved to footer. SEO value preserved.

### Change 4: Blog added
The existing site has no blog. With 16 SEO posts planned, there needs to be a blog hub and category structure.

---

## 7. Implementation Requirements

### SEO & URL Preservation
- **All EXISTING slugs must be preserved exactly.** No slug changes, no trailing-slash inconsistencies.
- If any existing URL must change, implement 301 redirects from old → new.
- Generate `sitemap.xml` automatically on build.
- Generate `robots.txt` with sitemap.xml reference.
- Every page needs unique meta title (55–60 chars) and meta description (150–160 chars).
- Open Graph tags on every page.
- Every image needs descriptive alt text.

### Global Elements (every page)
- Utility bar with click-to-call phone + "Book Telehealth" CTA (sticky on scroll)
- Primary nav per structure above
- Footer per structure above
- NAP consistent on every page
- Schema markup per specification below

### Schema Markup
- **Every page:** `LocalBusiness` + `VeterinaryCare` + `EmergencyService`
- **FAQ sections:** `FAQPage`
- **Homepage + service pages:** `AggregateRating` (pull from Google Business Profile)
- **Organization schema:** logo, `sameAs` to social profiles

### Brand System
- **Primary color:** `#C41E2A` (red) — CTAs, accents, H1s only. Never as large saturated backgrounds.
- **Black:** `#1A1A1A` — body copy
- **White** — dominant background
- **Headlines:** Montserrat ExtraBold
- **Body:** DM Sans
- **Minimum body size on mobile:** 16px
- **Line height:** 1.6

### Mobile-First
- Emergency traffic is overwhelmingly mobile.
- Phone CTA and telehealth CTA must be thumb-reachable without scrolling on every page.
- Mobile performance target: LCP < 2.5s, CLS < 0.1.

### Accessibility
- WCAG 2.1 AA compliance minimum.
- Color contrast ratio 4.5:1 for body text.
- All interactive elements keyboard-navigable.
- Skip-to-content link in header.

---

## 8. Page Priority for Development Sequencing

**Week 1–2 (critical path):**
1. Home → `/`
2. Telemedicine → `/telemedicine/` (primary conversion page)
3. Our Team → `/our-team/`
4. Contact Us → `/contact-us/`

**Week 2–3:**
5. All service pages (Emergency & Critical Care, Emergency Surgery, Pain Management, Diagnostics, Pharmacy Services)
6. Our Story → `/our-story/` [NEW]

**Week 3–4:**
7. Resources pages (Common Emergencies, Pet Emergency Tips, Seasonal Tip, Payment Plans)
8. Blog hub → `/blog/` [NEW]
9. Thank-you pages, 404, privacy, terms

**Post-launch (Phase 2):**
10. City pages (start with Fort Lauderdale, Boca Raton, Coral Springs)
11. Species-specific pages
12. Blog categories + individual posts
