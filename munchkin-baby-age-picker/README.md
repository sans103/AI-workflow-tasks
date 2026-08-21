# Munchkin Formula v2 : Baby's age month picker

Replaces the `0 months ... 11 months` dropdown in the Subscription buy box with a
month grid picker (the pattern in the reference screenshot), plus a second mode for
parents who are still expecting.

Control page: `https://www.munchkin.com/infant-formula-organic-v2?Quantity=Trial+1+Cans&Milk+Type=Organic+Milk`
Downloaded 2026-08-21 to `live-page.html`. Everything outside the age field is untouched.

## Files

| File | What it is |
|------|-----------|
| `live-page.html` | Control. Rendered HTML of the live page, unmodified. |
| `munchkin-formula-v2-baby-age-picker.html` | Variant. Control with the picker injected. Open in a browser to click through. |
| `snippet.html` | The markup that replaces the old `<select>` block. |
| `snippet.css` | Picker styles. Goes in the stylesheet or a `<style>` block. |
| `snippet.js` | Picker behavior. Vanilla, no dependencies. |
| `inject.py` | Rebuilds the variant from control plus snippets. Re-run after editing a snippet. |
| `preview.js` | Playwright script that produces the preview screenshots. |
| `preview-*.png` | Desktop and mobile states. |

## How it behaves

**Already born** (default). Selectable window is the last 12 months, so today (Aug 2026)
that is Sep 2025 through Aug 2026. Anything outside is greyed out, which keeps the field
inside the 0 to 11 month range the product is for. Pick `Jun 2026` and the field reads
`Born June 2026` with the line `2 months old. Your Surprise Box is matched to this stage.`

**Expecting.** Selectable window is this month through 9 months out (Aug 2026 through
May 2027). Pick `Nov 2026` and the field reads `Due November 2026` with
`Expecting, due in 3 months. Your Surprise Box is matched to the newborn stage.`

Year arrows move between years and disable at the edges of the window. `This month`
(labelled `Due this month` in expecting mode) picks the current month. `Clear` resets.
Escape, click outside, and arrow key navigation inside the grid all work. The panel
flips above the field if there is no room below.

## Integration notes for the dev

1. **The original `<select>` is still there**, visually hidden, `aria-hidden`, `tabindex="-1"`,
   as `#mkap-native`. The picker writes to it through the native value setter and dispatches
   `input` and `change`, so existing React state, field validation, and the cart line
   attribute keep working with no other change. The visible picker is the accessible
   control, the select is the data carrier.
2. **One new option was added to that select:** `<option value="Expecting">`. Anything
   consuming `Baby's age` (Surprise Box fulfilment, Klaviyo, reporting) needs to accept
   that value. This is the only contract change.
3. **The exact month is available but not submitted.** After a selection the wrapper carries
   `data-mode` (`born` or `expecting`) and `data-month` (`2026-11`), and fires a
   `mkap:change` event with `{ mode, month, year, monthIndex, value }`. If you want the
   due month or birth month on the order, add it as a cart attribute in the app. It is not
   wired up here because Hydrogen builds cart lines from `cartFormInput` JSON, not from
   stray hidden inputs.
4. **The CTA sync in `snippet.js` is a fallback only.** It runs 150ms after the select
   change and does nothing if the app has already enabled the button. It exists so the
   variant file behaves like the live page when opened as a static file. Safe to delete
   in production if the app handles the button, which it does today.
5. Colors and metrics were measured off the live control, not guessed: green-800 `#325420`,
   border `rgba(50,84,32,.6)`, radius 8px, control height 40px, Matter 14px w500, and the
   site's own `arrowDown` SVG for the caret. Selected month uses green-800, hover uses
   green-100 `#e3f3d4`. The mode pills reuse the page's secondary pill pattern.
6. The picker stops click and mousedown propagation so it cannot re-trigger the plan card's
   click handler that wraps it.

## Two things worth a decision

- **Placeholder copy** now reads `Select birth month or due date` instead of `Select age`.
  That is what makes the Expecting mode discoverable before the panel is opened. The label
  above it is still `Baby's age`, unchanged.
- **Born window is capped at 12 months.** A parent whose baby is 14 months old cannot
  submit an age. That matches the old dropdown, which also stopped at 11 months. Say the
  word if you want older months selectable and mapped to a `12+ months` value instead.
