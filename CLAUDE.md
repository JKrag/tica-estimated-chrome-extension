# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension project to add features to the website: [TICA unofficial estimated standings](https://ticamembers.org/estimated_standings/) website

## Development Setup

- Load unpacked extension in Chrome via `chrome://extensions/` with Developer mode enabled
- Reload extension after changes via the refresh button in chrome://extensions/ or by calling http://reload.extensions in Chrome (exposed by the Extensions Reloader 2.0 extension)

## Architecture

Chrome Manifest V3 extension with content scripts injected on `ticamembers.org/estimated_standings/*`.

**Files:**

- `manifest.json` - Extension configuration
- `content.js` - Main logic: season dropdown, top 25 highlighting, and SH/LH ranking columns
- `styles.css` - Visual styling (highlighting colors, dropdown appearance, breed code colors)
- `breeds.js` - Breed code to coat length mapping (shorthair/longhair sets from TICA Standing Rules)

## Living documents — keep these up to date

When you make changes, update the relevant files before committing:

| File                | Update when                                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| @ROADMAP.md         | An issue is completed (mark ✅) or a new one is scoped                                                                |
| @FEATURES.md        | A new feature is implemented or an existing one is updated                                                            |
| @CHANGELOG.md       | A PR is ready — add a section summarizing what changed and why                                                        |
| @WORLD-KNOWLEDGE.md | You discover or correct a fact about an external system (URL format, auth requirements, field structure, dom details) |

Remember to consult these documents as needed before starting work on new features, to ensure your changes align with the overall project direction and to avoid duplicating efforts.