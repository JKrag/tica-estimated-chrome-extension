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

  const REGION_NAMES = {
    'AE': 'Arabian/Eastern Europe',
    'EN': 'Europe North',
    'EW': 'Europe West',
    'GL': 'Great Lakes',
    'HW': 'Hawaii',
    'IN': 'International/At Large',
    'MA': 'Mid-Atlantic',
    'MP': 'Mid-Pacific',
    'NE': 'New England',
    'NW': 'Northwest',
    'SA': 'South America',
    'SC': 'South Central',
    'SE': 'Southeast',
    'SW': 'Southwest',
  };

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

  // Check if current page is the FIRST championship cat page (where SH/LH rankings are accurate)
  function isFirstChampionshipCatPage() {
    const path = window.location.pathname;
    return /est_cat1\.htm$/i.test(path);
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

  // Find a column index by header text. Pass findLast=true to get the last match
  // in the row (needed for "Breed" which appears twice: rank column then code column).
  function findColumnIndex(table, headerText, findLast) {
    for (const row of table.querySelectorAll('tr')) {
      const cells = row.querySelectorAll('th, td');
      let found = -1;
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent.trim().toLowerCase() === headerText) {
          if (!findLast) return i;
          found = i;
        }
      }
      if (found !== -1) return found;
    }
    return -1;
  }

  // Get breed code from a table row using the known breed column index.
  // Pass pre-fetched cells to avoid a redundant querySelectorAll.
  function getBreedCode(row, breedColIndex, cells) {
    if (breedColIndex < 0) return null;

    const tds = cells || row.querySelectorAll('td');
    if (breedColIndex >= tds.length) return null;

    const cell = tds[breedColIndex];
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
    const isFirstCatPage = isFirstChampionshipCatPage();
    // For dedicated championship pages (est_cat*.htm), only track coat ranks on first page
    // For regional pages (detected via section headers), tracking resets per section so it's always accurate
    const canTrackCoatRanks = !isChampionshipPage || isFirstCatPage;

    for (const table of tables) {
      const allRows = Array.from(table.querySelectorAll('tr'));

      // Skip tables without rows
      if (allRows.length === 0) continue;

      // Find the breed column index once for this table
      const breedColIndex = findColumnIndex(table, 'breed', true);
      const regionColIndex = findColumnIndex(table, 'rgn');

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

        const cells = row.querySelectorAll('td');
        const breedCode = getBreedCode(row, breedColIndex, cells);

        // Color breed code for championship cats
        if (isChampionship && breedCode && breedColIndex >= 0) {
          if (breedColIndex < cells.length) {
            const breedCell = cells[breedColIndex];
            if (isShorthair(breedCode)) {
              breedCell.classList.add('tica-breed-sh');
            } else if (isLonghair(breedCode)) {
              breedCell.classList.add('tica-breed-lh');
            }
          }
        }

        // Breed tooltip (all rows)
        if (breedCode && breedColIndex >= 0 && breedColIndex < cells.length) {
          const breedName = getBreedName(breedCode);
          if (breedName) cells[breedColIndex].title = breedName;
        }

        // Region tooltip (all rows)
        if (regionColIndex >= 0 && regionColIndex < cells.length) {
          const regionCode = cells[regionColIndex].textContent.trim().toUpperCase();
          const regionName = REGION_NAMES[regionCode];
          if (regionName) cells[regionColIndex].title = regionName;
        }

        if (rank <= 25) {
          // Top 25 all-breed - gold highlight
          row.classList.add('tica-top25');

          // Track breed counts for championship cats (only when coat ranks are accurate)
          if (isChampionship && canTrackCoatRanks && breedCode) {
            if (isShorthair(breedCode)) shorthairCount++;
            if (isLonghair(breedCode)) longhairCount++;
          }
        } else if (isChampionship && canTrackCoatRanks) {
          // For championship cats ranked 26+, check if they make top 25 for their coat length
          // Only apply on first championship page or regional pages where counts are accurate
          if (breedCode) {
            if (isShorthair(breedCode)) {
              shorthairCount++;
              if (shorthairCount <= 25) {
                row.classList.add('tica-top25-sh');
              }
            } else if (isLonghair(breedCode)) {
              longhairCount++;
              if (longhairCount <= 25) {
                row.classList.add('tica-top25-lh');
              }
            }
          }
        }
      }
    }
  }

  // Add computed SH/LH ranking columns to championship cat pages
  function addCoatRankColumns() {
    // Only run on the FIRST championship cat page (est_cat1.htm)
    // Other pages (est_cat2.htm, etc.) would have incorrect rankings starting from 1
    const path = window.location.pathname;
    if (!/est_cat1\.htm$/i.test(path)) return;

    const tables = document.querySelectorAll('table');

    for (const table of tables) {
      const allRows = Array.from(table.querySelectorAll('tr'));
      if (allRows.length === 0) continue;

      const breedColIndex = findColumnIndex(table, 'breed', true);
      if (breedColIndex < 0) continue;

      // Find the header row (the one with "Breed" in it)
      let headerRowIndex = -1;
      let insertAfterIndex = -1;  // Index to insert new columns after (first "Breed" column)

      for (let i = 0; i < allRows.length; i++) {
        const row = allRows[i];
        const cells = row.querySelectorAll('th, td');
        for (let j = 0; j < cells.length; j++) {
          const text = cells[j].textContent.trim().toLowerCase();
          if (text === 'breed') {
            if (headerRowIndex === -1) {
              headerRowIndex = i;
              insertAfterIndex = j;  // First "Breed" column (the rank column)
            }
            break;  // Only need first occurrence per row
          }
        }
        if (headerRowIndex !== -1) break;
      }

      if (headerRowIndex === -1) continue;

      // Pass 1: Compute SH and LH ranks for all data rows
      const rowRanks = new Map();
      let shCount = 0;
      let lhCount = 0;

      for (let i = headerRowIndex + 1; i < allRows.length; i++) {
        const row = allRows[i];
        if (!row.querySelector('td')) continue;

        const rank = getRank(row);
        if (rank === null) continue;

        const breedCode = getBreedCode(row, breedColIndex);
        if (!breedCode) continue;

        let shRank = null;
        let lhRank = null;

        if (isShorthair(breedCode)) {
          shCount++;
          shRank = shCount;
        } else if (isLonghair(breedCode)) {
          lhCount++;
          lhRank = lhCount;
        }

        rowRanks.set(row, { shRank, lhRank });
      }

      // Pass 2: Adjust colspan in title row (row before header)
      // The title row has "Rank" spanning the ranking columns - increase by 2
      if (headerRowIndex > 0) {
        const titleRow = allRows[headerRowIndex - 1];
        const titleCells = titleRow.querySelectorAll('th, td');
        for (const cell of titleCells) {
          const colspan = cell.getAttribute('colspan');
          if (colspan && cell.textContent.trim().toLowerCase() === 'rank') {
            cell.setAttribute('colspan', parseInt(colspan) + 2);
            break;
          }
        }
      }

      // Pass 3: Insert columns into header row
      const headerRow = allRows[headerRowIndex];
      const headerCells = headerRow.querySelectorAll('th, td');
      if (insertAfterIndex < headerCells.length) {
        const referenceCell = headerCells[insertAfterIndex];

        // Create SH header
        const shHeader = document.createElement('th');
        shHeader.textContent = 'SH';
        shHeader.classList.add('tica-rank-header');
        shHeader.title = 'Shorthair Ranking';

        // Create LH header
        const lhHeader = document.createElement('th');
        lhHeader.textContent = 'LH';
        lhHeader.classList.add('tica-rank-header');
        lhHeader.title = 'Longhair Ranking';

        // Insert after the first "Breed" column
        referenceCell.after(lhHeader);
        referenceCell.after(shHeader);
      }

      // Pass 3: Insert rank cells into data rows
      for (let i = headerRowIndex + 1; i < allRows.length; i++) {
        const row = allRows[i];
        const cells = row.querySelectorAll('td');
        if (cells.length === 0) continue;

        // Find the cell at insertAfterIndex
        if (insertAfterIndex >= cells.length) continue;
        const referenceCell = cells[insertAfterIndex];

        const ranks = rowRanks.get(row) || { shRank: null, lhRank: null };

        // Create SH rank cell
        const shCell = document.createElement('td');
        if (ranks.shRank !== null) {
          shCell.textContent = ranks.shRank;
          shCell.classList.add('tica-rank-sh');
        }

        // Create LH rank cell
        const lhCell = document.createElement('td');
        if (ranks.lhRank !== null) {
          lhCell.textContent = ranks.lhRank;
          lhCell.classList.add('tica-rank-lh');
        }

        // Insert after the first "Breed" column (same position as header)
        referenceCell.after(lhCell);
        referenceCell.after(shCell);
      }
    }
  }

  // ============================================================
  // NEW SITE (estand-page.html) SUPPORT
  // ============================================================

  // Get current compclass from the rendered standTitle text (most reliable post-render)
  function getCompclass() {
    const titleEl = document.querySelector('[id="standTitle"]');
    if (titleEl) {
      const text = titleEl.textContent.toLowerCase();
      if (text.includes('kitten') && text.includes('household')) return 'HHK';
      if (text.includes('household')) return 'HHP';
      if (text.includes('kitten')) return 'KIT';
      if (text.includes('alter')) return 'ALT';
      if (text.includes('cat')) return 'CAT';
    }
    // Fallback: checked radio button, then component property, then URL
    for (const tab of ['KIT', 'CAT', 'ALT', 'HHK', 'HHP']) {
      const btn = document.querySelector(`#btn-${tab}`);
      if (btn && btn.checked) return tab;
    }
    const el = document.querySelector('estand-page');
    if (el && el.compclass) return el.compclass;
    return new URLSearchParams(location.search).get('compclass') || 'KIT';
  }

  // Highlight top 25 on new site and add breed code coloring
  function highlightNewSiteTop25(table, compclass, regionFiltered) {
    const allRows = Array.from(table.querySelectorAll('tr'));
    const isCAT = compclass === 'CAT';

    let shCount = 0;
    let lhCount = 0;

    for (const row of allRows) {
      const irankCell = row.querySelector('td[id="irank"]');
      if (!irankCell) continue;

      const irank = parseInt(irankCell.textContent.trim(), 10);
      if (isNaN(irank)) continue;

      // When region-filtered, use rrank as the primary ranking threshold
      const rrankCell = row.querySelector('td[id="rrank"]');
      const rrank = rrankCell ? parseInt(rrankCell.textContent.trim(), 10) : NaN;
      const primaryRank = (regionFiltered && !isNaN(rrank)) ? rrank : irank;

      const breedCell = row.querySelector('td[id="breed"]');
      const breedCode = breedCell ? breedCell.textContent.trim().toUpperCase() : null;

      // Breed tooltip
      if (breedCell && breedCode) {
        const breedName = getBreedName(breedCode);
        if (breedName) breedCell.title = breedName;
      }

      // Region tooltip
      const regionCell = row.querySelector('td[id="region"]');
      if (regionCell) {
        const regionCode = regionCell.textContent.trim().toUpperCase();
        if (REGION_NAMES[regionCode]) regionCell.title = REGION_NAMES[regionCode];
      }

      // IW badge: when region-filtered, mark irank cell gold if cat is in IW top 25
      if (regionFiltered && irank <= 25) {
        irankCell.classList.add('tica-new-iw-badge');
      }

      if (primaryRank <= 25) {
        row.classList.add('tica-new-top25');
        if (isCAT && breedCode) {
          if (isShorthair(breedCode)) shCount++;
          else if (isLonghair(breedCode)) lhCount++;
        }
      } else if (isCAT && breedCode) {
        if (isShorthair(breedCode)) {
          shCount++;
          if (shCount <= 25) row.classList.add('tica-new-top25-sh');
        } else if (isLonghair(breedCode)) {
          lhCount++;
          if (lhCount <= 25) row.classList.add('tica-new-top25-lh');
        }
      }
    }
  }

  // Add SH/LH rank columns to new site CAT table
  function addNewSiteCoatRankColumns(table) {
    const allRows = Array.from(table.querySelectorAll('tr'));
    if (allRows.length < 2) return;

    // Pass 1: compute SH/LH ranks for data rows
    const rowRanks = new Map();
    let shCount = 0;
    let lhCount = 0;

    for (const row of allRows) {
      const irankCell = row.querySelector('td[id="irank"]');
      if (!irankCell) continue;
      const rank = parseInt(irankCell.textContent.trim(), 10);
      if (isNaN(rank)) continue;

      const breedCell = row.querySelector('td[id="breed"]');
      const breedCode = breedCell ? breedCell.textContent.trim().toUpperCase() : null;
      if (!breedCode) { rowRanks.set(row, { shRank: null, lhRank: null }); continue; }

      let shRank = null, lhRank = null;
      if (isShorthair(breedCode)) { shCount++; shRank = shCount; }
      else if (isLonghair(breedCode)) { lhCount++; lhRank = lhCount; }
      rowRanks.set(row, { shRank, lhRank });
    }

    // Pass 2: adjust title row colspan (row 0) — store original for cleanup
    const titleRow = allRows[0];
    if (titleRow) {
      const firstCell = titleRow.querySelector('td, th');
      if (firstCell) {
        const colspan = parseInt(firstCell.getAttribute('colspan') || '1', 10);
        firstCell.dataset.ticaOrigColspan = colspan;
        firstCell.setAttribute('colspan', colspan + 2);
      }
    }

    // Pass 3: insert headers into header row (row 1), after "Breed rank" cell (index 2)
    const headerRow = allRows[1];
    if (headerRow) {
      const headerCells = headerRow.querySelectorAll('td, th');
      if (headerCells.length > 2) {
        const refCell = headerCells[2]; // "Breed rank" column
        const shHeader = document.createElement('th');
        shHeader.textContent = 'SH';
        shHeader.className = 'tica-new-rank-header';
        shHeader.title = 'Shorthair Ranking';
        const lhHeader = document.createElement('th');
        lhHeader.textContent = 'LH';
        lhHeader.className = 'tica-new-rank-header';
        lhHeader.title = 'Longhair Ranking';
        refCell.after(lhHeader);
        refCell.after(shHeader);
      }
    }

    // Pass 4: insert rank cells into data rows
    for (const row of allRows) {
      const irankCell = row.querySelector('td[id="irank"]');
      if (!irankCell) continue;

      const tds = row.querySelectorAll('td');
      if (tds.length <= 2) continue;
      const refCell = tds[2]; // "Breed rank" column

      const ranks = rowRanks.get(row) || { shRank: null, lhRank: null };

      const shCell = document.createElement('td');
      shCell.className = 'tica-new-rank-sh';
      if (ranks.shRank !== null) shCell.textContent = ranks.shRank;

      const lhCell = document.createElement('td');
      lhCell.className = 'tica-new-rank-lh';
      if (ranks.lhRank !== null) lhCell.textContent = ranks.lhRank;

      refCell.after(lhCell);
      refCell.after(shCell);
    }
  }

  // Remove all previously applied enhancements from the table
  function cleanupNewSite(table) {
    // Remove row highlight classes
    table.querySelectorAll('tr').forEach(r => {
      r.classList.remove('tica-new-top25', 'tica-new-top25-sh', 'tica-new-top25-lh');
    });
    // Remove IW badge class
    table.querySelectorAll('.tica-new-iw-badge').forEach(el => {
      el.classList.remove('tica-new-iw-badge');
    });
    // Remove injected SH/LH rank cells and headers
    table.querySelectorAll('.tica-new-rank-sh, .tica-new-rank-lh, .tica-new-rank-header').forEach(el => el.remove());
    // Restore title row colspan if we changed it
    const firstCell = table.querySelector('tr:first-child td, tr:first-child th');
    if (firstCell && firstCell.dataset.ticaOrigColspan) {
      firstCell.setAttribute('colspan', firstCell.dataset.ticaOrigColspan);
      delete firstCell.dataset.ticaOrigColspan;
    }
  }

  // Enhance the new site table (called on each re-render)
  function enhanceNewSite() {
    const table = document.querySelector('table');
    if (!table) return;

    // Use standTitle text as the sentinel — if it matches what we last processed, skip
    const titleEl = document.querySelector('[id="standTitle"]');
    const currentTitle = titleEl ? titleEl.textContent.trim() : '';
    if (!currentTitle) return; // Table not fully rendered yet

    const region = new URLSearchParams(location.search).get('region');
    const regionFiltered = !!region;
    const sentinel = currentTitle + (region ? '|region:' + region : '');
    if (table.dataset.ticaEnhanced === sentinel) return;

    // Clean up any stale enhancement from a previous render/tab
    cleanupNewSite(table);
    table.dataset.ticaEnhanced = sentinel;

    const compclass = getCompclass();
    highlightNewSiteTop25(table, compclass, regionFiltered);
    if (compclass === 'CAT') {
      addNewSiteCoatRankColumns(table);
    }
  }

  // Initialize for the new TICA estimated standings site
  function initNewSite() {
    function debounce(fn, delay) {
      let timer;
      return function() {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
      };
    }

    enhanceNewSite();

    const target = document.querySelector('estand-page') || document.body;
    const observer = new MutationObserver(debounce(enhanceNewSite, 100));
    observer.observe(target, { childList: true, subtree: true });
  }

  // ============================================================
  // DETAIL PAGE (detail-page.html) SUPPORT — Sortable Table
  // ============================================================

  // Parse a cell value for comparison: numeric when possible, otherwise lowercase string
  function parseCellValue(cell) {
    const text = cell.textContent.trim();
    const num = parseFloat(text.replace(/,/g, ''));
    return isNaN(num) ? text.toLowerCase() : num;
  }

  // Return a lowercase label for a table, checking caption, Bootstrap card-header,
  // and preceding heading elements so we can identify "Details" vs "Reports" tables.
  function getTableLabel(table) {
    // 1. <caption> element inside the table
    if (table.caption) return table.caption.textContent.trim().toLowerCase();

    // 2. Bootstrap card structure: .card > .card-header + .card-body > table
    const card = table.closest('.card');
    if (card) {
      const header = card.querySelector('.card-header, .card-title');
      if (header) return header.textContent.trim().toLowerCase();
    }

    // 3. Traverse previous siblings (and up one parent level) for a heading
    function precedingHeading(el) {
      let prev = el.previousElementSibling;
      while (prev) {
        if (/^H[1-6]$/.test(prev.tagName)) return prev.textContent.trim().toLowerCase();
        if (prev.tagName === 'TABLE') return ''; // hit another table — stop
        prev = prev.previousElementSibling;
      }
      const parent = el.parentElement;
      if (parent && parent !== document.body) return precedingHeading(parent);
      return '';
    }

    return precedingHeading(table);
  }

  // Find the table labeled "Details" on the detail page.
  // Falls back to the first table if no explicitly labeled one is found.
  function findDetailsTable() {
    const tables = Array.from(document.querySelectorAll('table'));
    if (tables.length === 0) return null;
    const labeled = tables.find(t => getTableLabel(t).includes('detail'));
    return labeled || tables[0];
  }

  // Make the "Details" table on the detail page sortable by clicking its headers.
  function makeDetailTableSortable() {
    const table = findDetailsTable();
    if (!table || table.dataset.ticaSortable) return;

    // Prefer <thead> row; fall back to first <tr> anywhere in the table
    const headerRow = table.tHead
      ? table.tHead.rows[0]
      : table.querySelector('tr');
    if (!headerRow) return;

    // Accept <th> elements; fall back to <td> when the table uses no <th>
    let headers = Array.from(headerRow.querySelectorAll('th'));
    if (headers.length === 0) headers = Array.from(headerRow.querySelectorAll('td'));
    if (headers.length === 0) return;

    // The body containing data rows
    const dataBody = table.tBodies[0] || null;
    const getDataRows = () => dataBody
      ? Array.from(dataBody.rows)
      : Array.from(table.querySelectorAll('tr')).filter(r => r !== headerRow);

    if (getDataRows().length === 0) return;

    table.classList.add('tica-sortable');
    table.dataset.ticaSortable = '1';

    let sortColIndex = -1;
    let sortAsc = true;

    headers.forEach((th, colIndex) => {
      th.addEventListener('click', () => {
        if (sortColIndex === colIndex) {
          sortAsc = !sortAsc;
        } else {
          sortColIndex = colIndex;
          sortAsc = true;
        }

        // Update sort-direction indicator classes
        headers.forEach(h => h.classList.remove('tica-sort-asc', 'tica-sort-desc'));
        th.classList.add(sortAsc ? 'tica-sort-asc' : 'tica-sort-desc');

        // Sort and re-insert rows
        const rows = getDataRows();
        rows.sort((a, b) => {
          const aVal = a.cells[colIndex] ? parseCellValue(a.cells[colIndex]) : '';
          const bVal = b.cells[colIndex] ? parseCellValue(b.cells[colIndex]) : '';
          if (aVal < bVal) return sortAsc ? -1 : 1;
          if (aVal > bVal) return sortAsc ? 1 : -1;
          return 0;
        });

        const parent = dataBody || table;
        rows.forEach(r => parent.appendChild(r));
      });
    });
  }

  // Initialize for the detail page
  function initDetailPage() {
    function debounce(fn, delay) {
      let timer;
      return function() {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
      };
    }

    makeDetailTableSortable();

    // Use the <detail-page> custom element as the observer root when available
    const target = document.querySelector('detail-page') || document.body;
    const observer = new MutationObserver(debounce(makeDetailTableSortable, 200));
    observer.observe(target, { childList: true, subtree: true });
  }

  // Initialize the extension
  function init() {
    if (window.location.pathname.includes('estand-page.html')) {
      initNewSite();
      return;
    }
    if (window.location.pathname.includes('detail-page.html')) {
      initDetailPage();
      return;
    }
    createSeasonDropdown();
    highlightTop25();
    addCoatRankColumns();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
