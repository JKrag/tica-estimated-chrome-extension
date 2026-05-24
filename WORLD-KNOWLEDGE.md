# World Knowledge — TICA Estimated Standings Site

Facts discovered by observing the live site DOM. Update this file whenever a new fact is confirmed or an existing one is corrected.

---

## detail-page.html — DOM Structure

The detail page is a fully client-side SPA. The server returns only a navigation shell; all content is rendered by JavaScript.

### Shadow DOM nesting (confirmed 2026-05-24)

```
document
└─ <detail-page>          — custom element with open shadow root
   └─ (shadow root)
      ├─ <h3 id="pageTitle">Estimated Scoring</h3>
      └─ <div>
         ├─ <detail-table season="YYYY" compclass="CAT|KIT|ALT|HHP">
         │   └─ (shadow root)           ← table lives here
         │      └─ <table> ...
         ├─ <detail-reports season="YYYY"> ... </detail-reports>
         ├─ <detail-regions> ... </detail-regions>
         └─ <div class="pageFooter"> ... </div>
```

**Consequence:** `document.querySelector('table')` returns `null`.  
Content script must pierce both shadow roots to reach the table:
```js
document.querySelector('detail-page')
  ?.shadowRoot
  ?.querySelector('detail-table')
  ?.shadowRoot
  ?.querySelector('table')
```

**MutationObserver:** Must observe the shadow roots themselves — a regular observer on `document.body` or on `<detail-page>` (the host element) cannot see mutations inside either shadow root.

**CSS injection:** `styles.css` injected by the content script only applies to the main document. Sort styles must be injected as a `<style>` element directly into `detail-table`'s shadow root.

### Table structure inside detail-table shadow root (confirmed 2026-05-24)

The table uses `<th>` elements for column headers. The first few rows contain `<th>` elements with **empty text** (likely colspan/spacing rows) — the actual header row is the first `<tr>` whose `<th>` cells have non-empty text content.

Header columns observed (via `th.cellIndex`): indices 2, 3, 4 for "Count", "Report", "Judge" — meaning indices 0 and 1 hold earlier columns (rank/cat info). Data rows use `<td>` cells at matching indices.

The custom element **re-renders its shadow DOM** after the initial paint (e.g. after data fetch completes). This means:
- Any captured DOM references (e.g. `headerRow`) become stale
- Click listeners attached to specific `<th>` elements are lost
- Safe approach: use event delegation on the `<table>` element, and re-query live DOM on each click using `th.cellIndex` for column position

---

## estand-page.html — DOM Structure

Not yet inspected in detail. Appears to also be a SPA. Known to use a `<estand-page>` custom element (inferred from content.js `initNewSite` function).
