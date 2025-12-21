// TICA Estimated Standings Enhancer
// Content script for ticamembers.org/estimated_standings/

(function() {
  'use strict';

  // Available show seasons (ending year)
  const SEASONS = [
    { year: 2026, label: '2025-26 (Current)' },
    { year: 2025, label: '2024-25' },
    { year: 2024, label: '2023-24' },
    { year: 2023, label: '2022-23' },
    { year: 2022, label: '2021-22' },
    { year: 2021, label: '2020-21' },
    { year: 2020, label: '2019-20' },
    { year: 2019, label: '2018-19' },
    { year: 2018, label: '2017-18' },
    { year: 2017, label: '2016-17' },
    { year: 2016, label: '2015-16' },
    { year: 2015, label: '2014-15' },
    { year: 2014, label: '2013-14' },
    { year: 2013, label: '2012-13' },
  ];

  // Parse the current URL to extract season and page
  function parseUrl() {
    const path = window.location.pathname;
    const match = path.match(/\/estimated_standings\/(\d{4})\/?(.*)$/);
    if (match) {
      return {
        season: parseInt(match[1], 10),
        page: match[2] || ''
      };
    }
    return { season: null, page: '' };
  }

  // Create and inject the season dropdown
  function createSeasonDropdown() {
    const { season: currentSeason, page: currentPage } = parseUrl();

    // Create container
    const container = document.createElement('div');
    container.id = 'tica-season-nav';
    container.className = 'tica-enhancer-dropdown';

    // Create label
    const label = document.createElement('label');
    label.htmlFor = 'tica-season-select';
    label.textContent = 'Jump to Season: ';

    // Create select element
    const select = document.createElement('select');
    select.id = 'tica-season-select';

    // Add options
    SEASONS.forEach(({ year, label: seasonLabel }) => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = seasonLabel;
      if (year === currentSeason) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    // Handle selection change
    select.addEventListener('change', function() {
      const newSeason = this.value;
      const newUrl = `/estimated_standings/${newSeason}/${currentPage}`;
      window.location.href = newUrl;
    });

    container.appendChild(label);
    container.appendChild(select);

    // Find insertion point - after the header/navigation area
    const body = document.body;
    const firstElement = body.querySelector('center, table, h1, h2, p');
    if (firstElement) {
      firstElement.parentNode.insertBefore(container, firstElement);
    } else {
      body.insertBefore(container, body.firstChild);
    }
  }

  // Check if current page is a rankings page (including regional pages)
  function isRankingsPage() {
    const path = window.location.pathname;
    // Match est_*.htm files OR regional directory pages
    return /est_(cat|kit|alt|hhp|hhk)\d*\.htm$/i.test(path) ||
           /_region\/?$/i.test(path);
  }

  // Check if current page has championship cat rankings
  function isChampionshipCatPage() {
    const path = window.location.pathname;
    return /est_cat\d*\.htm$/i.test(path);
  }

  // Check if a row is a section header (has colspan and contains section name)
  function isSectionHeader(row) {
    const firstCell = row.querySelector('th, td');
    if (!firstCell) return false;
    const colspan = firstCell.getAttribute('colspan');
    if (!colspan || parseInt(colspan) < 2) return false;

    const text = firstCell.textContent.trim().toLowerCase();
    // Check for known section names
    return text === 'kittens' || text === 'championship cats' || text === 'cats' ||
           text === 'alters' || text.includes('household');
  }

  // Get section name from a header row
  function getSectionName(row) {
    const firstCell = row.querySelector('th, td');
    return firstCell ? firstCell.textContent.trim().toLowerCase() : '';
  }

  // Check if a section is for championship cats
  function isChampionshipSection(sectionName) {
    return sectionName === 'championship cats' || sectionName === 'cats';
  }

  // Find the breed code column index by looking for the "Breed" header
  // Note: There are often two "Breed" columns - one for breed rank and one for breed code
  // We want the LAST one (the breed code column, typically index 5)
  function findBreedColumnIndex(table) {
    const rows = table.querySelectorAll('tr');

    // Search through rows to find the header row with "Breed"
    for (const row of rows) {
      const cells = row.querySelectorAll('th, td');
      let lastBreedIndex = -1;

      for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent.trim().toLowerCase() === 'breed') {
          lastBreedIndex = i;  // Keep updating to get the LAST "Breed" column
        }
      }

      if (lastBreedIndex !== -1) {
        return lastBreedIndex;
      }
    }
    return -1;
  }

  // Get breed code from a table row using the known breed column index
  function getBreedCode(row, breedColIndex) {
    if (breedColIndex < 0) return null;

    const cells = row.querySelectorAll('td');
    if (breedColIndex >= cells.length) return null;

    const cell = cells[breedColIndex];
    const text = cell.textContent.trim().toUpperCase();

    // TICA breed codes are 2-3 uppercase letters
    if (/^[A-Z]{2,3}$/.test(text)) {
      return text;
    }

    return null;
  }

  // Get rank from a table row
  function getRank(row) {
    const firstCell = row.querySelector('td');
    if (firstCell) {
      const text = firstCell.textContent.trim();
      const rank = parseInt(text, 10);
      if (!isNaN(rank)) {
        return rank;
      }
    }
    return null;
  }

  // Apply highlighting to rankings table
  function highlightTop25() {
    if (!isRankingsPage()) return;

    const tables = document.querySelectorAll('table');
    const isChampionshipPage = isChampionshipCatPage();

    for (const table of tables) {
      const allRows = Array.from(table.querySelectorAll('tr'));

      // Skip tables without rows
      if (allRows.length === 0) continue;

      // Find the breed column index once for this table
      const breedColIndex = findBreedColumnIndex(table);

      // Track current section state
      let currentSection = isChampionshipPage ? 'cats' : '';  // Default for dedicated cat pages
      let isChampionship = isChampionshipPage;
      let shorthairCount = 0;
      let longhairCount = 0;

      for (const row of allRows) {
        // Check if this row is a section header
        if (isSectionHeader(row)) {
          currentSection = getSectionName(row);
          isChampionship = isChampionshipSection(currentSection);
          // Reset counts for new section
          shorthairCount = 0;
          longhairCount = 0;
          continue;
        }

        // Skip rows without data cells
        if (!row.querySelector('td')) continue;

        const rank = getRank(row);
        if (rank === null) continue;

        const breedCode = getBreedCode(row, breedColIndex);

        if (rank <= 25) {
          // Top 25 all-breed - gold highlight
          row.classList.add('tica-top25');

          // Track breed counts for championship cats
          if (isChampionship && breedCode) {
            if (isShorthair(breedCode)) shorthairCount++;
            if (isLonghair(breedCode)) longhairCount++;
          }
        } else if (isChampionship) {
          // For championship cats ranked 26+, check if they make top 25 for their coat length
          if (breedCode) {
            if (isShorthair(breedCode)) {
              shorthairCount++;
              if (shorthairCount <= 25) {
                row.classList.add('tica-top25-coat');
              }
            } else if (isLonghair(breedCode)) {
              longhairCount++;
              if (longhairCount <= 25) {
                row.classList.add('tica-top25-coat');
              }
            }
          }
        }
      }
    }
  }

  // Initialize the extension
  function init() {
    createSeasonDropdown();
    highlightTop25();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
