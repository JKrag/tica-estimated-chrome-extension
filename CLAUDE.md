# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension project to add features to the website: [TICA unofficial estimated standings](https://ticamembers.org/estimated_standings/) website

## Development Setup

Once the extension is implemented, typical Chrome extension development commands would include:

- Load unpacked extension in Chrome via `chrome://extensions/` with Developer mode enabled
- Reload extension after changes via the refresh button in chrome://extensions/

## Architecture

Chrome Manifest V3 extension with content scripts injected on `ticamembers.org/estimated_standings/*`.

**Files:**
- `manifest.json` - Extension configuration
- `content.js` - Main logic: season dropdown and top 25 highlighting
- `styles.css` - Visual styling (gold highlighting, dropdown appearance)
- `breeds.js` - Breed code to coat length mapping (shorthair/longhair sets)

**Features:**
1. **Season Dropdown** - Injected at top of each page. Navigates to same page type in selected season.
2. **Top 25 Highlighting** - Gold background for top 25 all-breed on ranking pages (`est_*.htm`). For championship cats (`est_cat*.htm`), lighter gold for shorthair/longhair runners-up who make top 25 in their coat category.

## Desired features

The main landing page is: https://ticamembers.org/estimated_standings/ and allows users to go to each individual show season page. On each show season page, there are many sub-pages with rankings for kittens, cats, alters, house hold pets, plus sub rankings for each breed and for each TICA region.

One of my annoyances with the site, is navigation between the various show season pages. I would like to have a dropdown menu at the top of each page that allows me to quickly jump to another show season page without having to go back to the main landing page.

Another easy win, is to do some sort of highlighting of the top 25 cats/kittens in each ranking page, so that they stand out more visually. The cats that are in the top 25 at the end of the season get awards, so it would be nice to see them highlighted. The tricky thing is that for adult cats (not alters), there are awards for both the top 25 "all breed" and the top 25 "breed specific" rankings. So for adult cats, we would need to highlight both the top 25 in the all breed ranking, and then, among the runners up, those that still make it into the top 25 for either shorthair or longhair.
The list of all recognised breeds, and whether they are shorthair or longhair, can be found here: https://ticamembers.org/showrep/how2read.htm