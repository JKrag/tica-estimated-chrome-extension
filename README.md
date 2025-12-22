# TICA Estimated Standings Enhancer

A Chrome extension that enhances the [TICA unofficial estimated standings](https://ticamembers.org/estimated_standings/) website with improved navigation and visual highlighting for cat show enthusiasts.

## Features

### Season Navigation
A dropdown menu at the top of each page allows quick navigation between show seasons (2012-13 through current) without returning to the main landing page.

### Top 25 Highlighting
- **Gold highlighting** for top 25 cats in all-breed rankings
- Works on all ranking pages: Kittens, Championship Cats, Alters, and Household Pets

### Championship Cat SH/LH Awards
For championship cats, the extension tracks both Shorthair and Longhair categories:
- **Teal highlighting** for Shorthair runners-up making top 25 SH
- **Pink highlighting** for Longhair runners-up making top 25 LH
- **Color-coded breed codes** (blue for SH, pink for LH)
- **Computed SH/LH ranking columns** on the main championship page

### Regional Page Support
Full functionality on regional standings pages, correctly handling multiple sections within a single page.

## Installation

### From Chrome Web Store
*(Coming soon)*

### Manual Installation (Developer Mode)
1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the repository folder

## Development

### Prerequisites
- Node.js 20+
- npm

### Setup
```bash
npm install
```

### Testing
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run with coverage report
```

### Linting
```bash
npm run lint      # Check for issues
npm run lint:fix  # Auto-fix issues
```

### Packaging for Chrome Web Store
```bash
npm run package   # Creates dist/tica-estimated-standings-enhancer-v{version}.zip
```

## Project Structure

```
├── manifest.json      # Chrome extension manifest (V3)
├── content.js         # Main extension logic
├── breeds.js          # Breed code to coat length mapping
├── styles.css         # Visual styling
├── icons/             # Extension icons
├── lib/               # Extracted utilities for testing
├── tests/             # Jest test files
└── store-assets/      # Chrome Web Store listing assets
```

## Contributing

Feature suggestions and bug reports are welcome! Please [create a GitHub issue](https://github.com/JKrag/tica-estimated-chrome-extension/issues/new) to share your ideas or report problems.

## Privacy

This extension:
- Only runs on `ticamembers.org/estimated_standings/*` pages
- Does not collect, store, or transmit any data
- Operates entirely locally in your browser
- Has no analytics or tracking

## License

MIT
