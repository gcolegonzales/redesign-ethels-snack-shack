# Ethel's Snack Shack — Website Redesign Concept

A polished, static single-page website concept for **Ethel's Snack Shack**, one of Baton Rouge's
oldest soul food kitchens, located at 1553 Fairchild St in the Scotlandville neighborhood
(near Southern University). Ethel's was named a **2024 Baton Rouge Soul Food Festival "Soul Food
Pioneer."**

This is an **unsolicited redesign concept** — a "this could be your site" pitch piece. The business
currently has no website, only a Facebook page and directory listings.

## Why a new site

- **No website today** — customers can't easily find the menu, hours, or a click-to-call number.
- Menu and prices live scattered across third-party listing sites (Yelp, Zmenu, etc.), not
  anywhere the owners control.
- No mobile-friendly "call to order," directions, or catering path.

## What this concept delivers

- A warm, proud, soul-food art direction (deep reds/browns/mustard/cream, hand-painted-sign
  character) that fits a legacy neighborhood institution.
- The **full real menu** (plate lunches, baskets, sandwiches, Saturday crawfish, sides, desserts,
  drinks) with real prices, organized by section.
- The real story: founded in the mid-1950s, carried on by owner Paulette Thomas (since 2012) and
  her son Roderick Brown (since 2021), plus the 2024 Soul Food Pioneer award.
- Real photos (food, storefront, owners) sourced from press coverage.
- Click-to-call, hours, directions, and a styled (non-wired) catering inquiry form.
- Responsive, accessible, and fast — no build step, no frameworks.

## View it

Open `index.html` directly in any browser, or serve the folder statically. No dependencies.

## Tech

Plain `index.html` + `styles.css` + `script.js` with a single Google Fonts link and local images in
`assets/`. Scroll-reveal via `IntersectionObserver`; all motion respects
`prefers-reduced-motion`.

## SEO / deploy note

On-page SEO is in place: a `Restaurant` JSON-LD block (name, telephone, address, hours,
`priceRange`, `servesCuisine`, image, url, menu, `sameAs`), complete Open Graph + Twitter Card
tags, a canonical link, plus `robots.txt` and `sitemap.xml` at the repo root.

**Base URL placeholder:** the canonical link, `og:url`, `twitter:image`, the JSON-LD `url`/`image`/`menu`,
and the `robots.txt` / `sitemap.xml` URLs all use the literal placeholder
`https://ethelssnackshack.com/`. At deploy time, run one find-and-replace of
`https://ethelssnackshack.com/` → the real domain across `index.html`, `robots.txt`, and
`sitemap.xml`.

## Data notes

All facts (address, hours, phone, story, award, menu, prices) are drawn from public sources
(225 Magazine, Visit Baton Rouge, festival announcements, and a public online menu listing).
Menu prices reflect a public listing and daily specials rotate — a note in the source flags that
the full current menu should be confirmed with the restaurant.

---

*Redesign concept — unaffiliated pitch piece. Not an official site of Ethel's Snack Shack.*
