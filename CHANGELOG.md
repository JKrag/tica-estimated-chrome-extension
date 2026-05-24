# Changelog

## [Unreleased] — Sortable detail-page table

### Fixed
- Sortable column headers on `detail-page.html` now work correctly after multiple rounds of debugging revealed the root cause: the table lives inside **nested open shadow DOM** (`<detail-page>` → `<detail-table>`) meaning `document.querySelector('table')` returned `null`, `styles.css` had no effect inside the shadow roots, and `MutationObserver` on `document.body` was blind to shadow DOM mutations.

### How it was fixed
- **Shadow DOM piercing**: `findSortableTable()` now traverses both shadow roots explicitly to reach the `<table>`
- **CSS injection**: sort styles are injected as a `<style>` element directly into `detail-table`'s shadow root (using `table.getRootNode()`)
- **Observer targets**: `MutationObserver` now observes the shadow roots themselves, not the host elements
- **Re-render resilience**: the `<detail-table>` custom element re-renders its shadow DOM after the initial data fetch, invalidating captured DOM references. Fixed by using event delegation on the `<table>` element and `th.cellIndex` for column position (avoids stale `headerRow` references)
