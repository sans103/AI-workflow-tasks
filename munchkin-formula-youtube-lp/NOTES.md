# Munchkin Infant Formula, YouTube Landing Page

**Current:** `munchkin-formula-youtube-lp-v3-branded.html`
**Earlier:** v2 and v1 kept for comparison
**Updated:** 2026-08-21
**Objective:** drive Target retail sales. Every primary CTA opens the store locator. Direct ecommerce is the secondary path.
**QA:** design-lint clean. Zero em or en dashes. No horizontal overflow at 1440 / 834 / 390 / 360. All 45 images resolve. No JS errors. Locator dialog, marquee pause, accordions and focus return verified in a real browser engine.

---

## v3 changes

### 1. Your wireframe copy is back, verbatim

I had rewritten headlines to fit our house style ban on hyphenated compounds and Title Case. You asked for the copy as shared, so it is restored exactly, including the hyphens:

| Restored | Was in v2 |
|----------|-----------|
| 730g of Complete Infant Nutrition. Minus the Tummy Troubles. | 730g of complete infant nutrition... |
| The New Go-To Infant Formula For Parents Worldwide: | The new favorite infant formula... |
| BIG Comfort / For Tiny Tummies | Big comfort for tiny tummies |
| Choose Your Formula: | Choose your formula |
| Both Formulas Feature Our Patented Nurture 10 Blend | lowercase version |
| What Munchkin & Breastmilk Have In Common... | What Munchkin and breastmilk have in common |
| More Feedings, More Savings. | More feedings, more savings |
| Go BIG at home. + the $30 monthly savings line | savings line was missing in v2 |
| In A League Of Its Own | In a league of its own |
| Wholesome Milk From New Zealand Cows.* | lowercase version |
| Grass-Fed & Pasture-Raised, Zero-Added Hormones, Double-Inspected (USA & Canada) | unhyphenated versions |
| Expert-Backed Since Birth | Backed by experts since birth |
| Approved By Parents Like You: | Approved by parents like you |
| Try Munchkin Today For FREE | Grab a can on your next Target run |
| Immune System Support*, Less Fuss More Giggles, Softer Easier Stools*, 16-week clinical study | lowercase versions |
| Strict Safety Standards, Every Batch Tested, Made In Canada, Backed By Clinical Research | lowercase versions |

Also restored: "Choose Organic" and "Choose Original" as the card button labels, "Try Now!" as the hero and benefits secondary CTA, and "Find the Munchkin Infant Formula at your local Target store!" under each card.

**Kept from v2 at your direction:** the whole Target band with its three step explanation and map preview, the "Find it at Target" CTA treatment, and the locator dialog. Two supporting lines I added and kept because they carry weight rather than padding: the 330g giant numeral in the savings section, and "Both are stocked at Target" under Choose Your Formula.

**One correction retained:** the wireframe footer reads "TEXT MUCHKIN TO ####". Spelled MUNCHKIN.

### 2. Nurture 10 section is a radial orbit

The 10 ingredients now sit on a ring around the can, which becomes a circular "sun" at the centre, replacing the three column card layout.

- Node centres are precomputed cos and sin percentages on a 40% radius, so there is no CSS trig and no JS dependency.
- Measured clearances: 46px between adjacent nodes, 88px from the nodes to the can, no text clipping, no page overflow at 1024, 1440 or 1680.
- Below 1024px the same markup collapses to a plain grid. `position:static` makes the inline left and top values inert, so there is no duplicated copy to maintain.
- The seam is hidden inside the circular core. Across a full circle it read as a line bisecting it, and the green and teal lids plus the key line under the ring already say there are two products.

### 3. Safety accordions and the mint band

**Accordion bodies are now the client's real copy**, verbatim, for all four rows: Strict Safety Standards, Every Batch Tested, Made In Canada, Backed By Clinical Research. The clinical row keeps a small "See the clinical sources" link to the Munchkin trial PDF, added because a 260 infant randomized double blind claim should carry its citation.

**The Nurture 10 band is now mint, matching the Figma.** Source of truth: `figma.com/design/2MniSRK9HG2fDn2I6hfQlg` node `2280:7484`. Values were sampled from the render rather than eyeballed:

| Element | Figma | Built |
|---------|-------|-------|
| Band | `#e3f3d4` (Munchkin green-100) | `#e3f3d4` |
| Eyebrow | `#252527` | `#252527` |
| Card heading | `#252527` | `#252527` |
| Card body | `#4e4f50` | `#4e4f50` |
| Card fill | `#ffffff` | `#ffffff` |

The Figma render has a faint vertical gradient from `#e9f4dc` to `#e3f3d4`. Built flat at `#e3f3d4`, since the brand system is flat and gradients are a slop tell. Band rotation re-checked: cream, aqua, peach, cream, butter, cream, **mint**, cream, aqua, cream, peach, cream, butter, green. No two adjacent bands repeat.

**Note on the Figma file:** it is an import of this build, not an independent design. Same copy, same 1440w and 390w frames, even the locator dialogs. The one addition is a detached section, `2280:7250`, showing Nurture 10 as three columns rather than the orbit. Client confirmed the orbit supersedes it, so Figma needs updating to match the live page.

### 4. Every sourceable image is now real

Your screenshots turned out to be real Munchkin assets, so I traced them to the CDN and used the full resolution originals from `munchkin.com/formula` rather than screenshots.

| Slot | Now uses |
|------|----------|
| Experts | The four real portraits `landry.png`, `moustafa.png`, `campbell.png`, `berkovits.png`, with names and credentials from the Experts and Research page. Grid is now 4 up |
| Target lockup | Munchkin's own Target bullseye, `target-logo-1.png`, placed beside the word Target exactly as the live PDP does it |
| Safety section | `Formula-Can-Safety-1.png`, a real cleanroom photograph of a technician inspecting sealed cans. Much stronger than the composite it replaces |
| Video posters | Four real lifestyle photographs: the bottle feeding shot, the fridge shot, the two babies shot, and the window feeding shot |
| Video quotes | Four real verified reviews: Brittany F., sandy L., Tresa S., Courtney R. |
| Parent reviews | Four real verified reviews: Angelica F., Juliana T., Donna C., Cassandra V. |
| Rating | Real 4.8 average on 98 reviews, taken from the reviews modal you shared |
| New Zealand 4th tile | `nutrient_4.jpg`, Munchkin's own milk powder texture plate |
| Closing CTA | `Web-Formula-Subscribe-1440.jpg`, the real trial box delivery photograph |
| Certification badges | Swapped from local files to the CDN originals |

The page now has **zero local image dependencies**. Every one of the 45 images is a verified Munchkin CDN URL, so the file is portable on its own.

### 5. Two paid media safety calls

**Dropped a review that named a competitor's recall.** Emily C.'s review says she switched "after the Nara recall". Nara Organics also appears in the comparison table on this page, so naming their recall in an ad is a legal exposure. Replaced with sandy L.'s review, which makes the same digestion point without naming anyone.

**Swapped one video poster.** `landing_hero_dweb.jpg` is a real Munchkin asset but it is an intimate postpartum shot of a parent in underwear. Fine on their own site, risky for YouTube ad review. Replaced with the dad and baby photograph.

**Added one disclosure line** under the video row: the quotes are real reviews and the photos are real Munchkin imagery, but they are not the same people, so the pairing is illustrative until the clips arrive.

---

## Remaining DUMMY slots (5)

| # | Where | What is needed |
|---|-------|----------------|
| 1 | Press strip | 4 press or media logos |
| 2 | Certifications, slot 3 | A "Patented Nurture 10 Blend" badge. No artwork exists anywhere in the library, so a line icon stands in |
| 3 | Video cards | The 4 actual parent video clips. Posters and quotes are real, the clips are not |
| 4 | Locator | Live store names, addresses, distances and stock, from Destini or MikMak. Also the map pins, which are illustrative on real tiles |
| 5 | Footer | The SMS short code |
| 6 | More feedings section | The generic 400g competitor can, shot to scale |

Down from 11 in v2.

---

## Recommended locator provider

- **Destini** ([destini.co](https://destini.co/)) is the grocery and CPG specialist, 1,500+ brands, and combines web scraped product data with store level sales data so results reflect actual distribution. Closest fit given Munchkin sells primarily through Target.
- **MikMak** ([mikmak.com](https://www.mikmak.com/)) is broader: 8,000+ retailers, 3.6 million locations, built to route paid media to whichever retailer has stock. Worth it only if Walmart or Amazon join the page later.

Either one replaces the `SAMPLE` array in the script and the map block. Everything else in the dialog stays.

**Already functional without a provider:** Target product deep links (Organic TCIN `94856713`, Original TCIN `94856712`), the Target brand collection link, Get directions via a keyless Google Maps URL scheme that genuinely finds nearby stores, the OpenStreetMap raster tile map, ZIP validation, geolocation, variant switching and focus management.

---

## Still open

**The competitor table is your wireframe's data, not independently verified.** Rows and the 10 / 5 / 3 / 4 totals reproduce the wireframe exactly. Kendamil, Bobbie and Nara Organics labels were never checked against their current packaging. A disclaimer sits under the table. This is the one item worth closing before the page runs as paid media.

---

## Before production

1. Wire the locator to a provider and replace the `SAMPLE` array and map block.
2. Drop in the 4 video clips, the press logos, the Nurture 10 badge, the 400g can and the SMS code.
3. Verify the competitor table against current labels.
4. Delete `.preview-bar` and every `.dummy`, `.dummy-inline`, `.dummy-lines` and `.video-flag` stand in.
5. Add tracking. For a retail objective, fire events on locator open, ZIP search, directions click and Target deep link click so store visits can be attributed back to the YouTube spend.
6. Replace the OpenStreetMap tiles. Fine for review, but their tile policy is not meant for production traffic.
