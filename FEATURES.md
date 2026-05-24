# Features

## Season Navigation Dropdown

Dropdown menu injected at the top of each page allowing quick navigation between show seasons (2012-13 through current) without returning to the main landing page.

## Top 25 Highlighting

- **Gold highlighting** for top 25 all-breed rankings on all ranking pages (`est_*.htm`)
- Works on dedicated pages (kittens, cats, alters, HHP) and regional pages with multiple sections

## Championship Cat SH/LH Distinction

For championship cats only (not kittens/alters/HHP):

- **Teal highlighting** for shorthair runners-up who make top 25 SH (ranks 26+)
- **Pink highlighting** for longhair runners-up who make top 25 LH (ranks 26+)
- **Colored breed codes** on all championship pages: blue for SH breeds, pink for LH breeds
- **Computed SH/LH ranking columns** on first championship page (`est_cat1.htm`) showing each cat's rank within their coat category
- Runner-up highlighting only appears on first page or regional sections where counts are accurate

## Sortable Table on Cat Detail Page

On `detail-page.html`, the scoring details table can be sorted by clicking any column header:

- Click a header once to sort ascending (↑), click again to sort descending (↓)
- An ⇅ indicator on all headers shows the active sort column
- Sorting survives dynamic re-renders by the `<detail-table>` custom element
- Implemented via event delegation on the `<table>` element with shadow DOM CSS injection, since the table lives inside nested open shadow roots (`<detail-page>` → `<detail-table>`)

## Regional Page Support

Regional pages contain all categories (Kittens, Championship Cats, Alters, HHP) in a single table. The extension detects section headers and applies appropriate highlighting rules per section, resetting counts for each.
