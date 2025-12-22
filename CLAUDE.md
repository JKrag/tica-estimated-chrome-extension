# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension project to add features to the website: [TICA unofficial estimated standings](https://ticamembers.org/estimated_standings/) website

## Development Setup

- Load unpacked extension in Chrome via `chrome://extensions/` with Developer mode enabled
- Reload extension after changes via the refresh button in chrome://extensions/

## Architecture

Chrome Manifest V3 extension with content scripts injected on `ticamembers.org/estimated_standings/*`.

**Files:**
- `manifest.json` - Extension configuration
- `content.js` - Main logic: season dropdown, top 25 highlighting, and SH/LH ranking columns
- `styles.css` - Visual styling (highlighting colors, dropdown appearance, breed code colors)
- `breeds.js` - Breed code to coat length mapping (shorthair/longhair sets from TICA Standing Rules)

## Features

### Season Navigation Dropdown
Dropdown menu injected at the top of each page allowing quick navigation between show seasons (2012-13 through current) without returning to the main landing page.

### Top 25 Highlighting
- **Gold highlighting** for top 25 all-breed rankings on all ranking pages (`est_*.htm`)
- Works on dedicated pages (kittens, cats, alters, HHP) and regional pages with multiple sections

### Championship Cat SH/LH Distinction
For championship cats only (not kittens/alters/HHP):
- **Teal highlighting** for shorthair runners-up who make top 25 SH (ranks 26+)
- **Pink highlighting** for longhair runners-up who make top 25 LH (ranks 26+)
- **Colored breed codes** on all championship pages: blue for SH breeds, pink for LH breeds
- **Computed SH/LH ranking columns** on first championship page (`est_cat1.htm`) showing each cat's rank within their coat category
- Runner-up highlighting only appears on first page or regional sections where counts are accurate

### Regional Page Support
Regional pages contain all categories (Kittens, Championship Cats, Alters, HHP) in a single table. The extension detects section headers and applies appropriate highlighting rules per section, resetting counts for each.

## Desired Features

### Section Navigation on Regional Pages
Regional pages have multiple sections (Kittens, Cats, Alters, HHP Kittens, HHP) in one long page. Add a navigation element (dropdown or buttons) to quickly jump to each section within the page.
