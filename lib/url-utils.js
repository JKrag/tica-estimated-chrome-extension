// URL parsing utilities for TICA Estimated Standings Enhancer
// Extracted for testability

/**
 * Parse a pathname to extract season and page info
 * @param {string} pathname - The URL pathname (e.g., '/estimated_standings/2026/est_cat1.htm')
 * @returns {{season: number|null, page: string}} Parsed URL info
 */
function parseUrl(pathname) {
  const match = pathname.match(/\/estimated_standings\/(\d{4})\/?(.*)$/);
  if (match) {
    return {
      season: parseInt(match[1], 10),
      page: match[2] || ''
    };
  }
  return { season: null, page: '' };
}

/**
 * Check if pathname is a rankings page (dedicated or regional)
 * @param {string} pathname - The URL pathname
 * @returns {boolean}
 */
function isRankingsPage(pathname) {
  // Match est_*.htm files OR regional directory pages
  return /est_(cat|kit|alt|hhp|hhk)\d*\.htm$/i.test(pathname) ||
         /_region\/?$/i.test(pathname);
}

/**
 * Check if pathname is a championship cat page
 * @param {string} pathname - The URL pathname
 * @returns {boolean}
 */
function isChampionshipCatPage(pathname) {
  return /est_cat\d*\.htm$/i.test(pathname);
}

/**
 * Check if pathname is the FIRST championship cat page (est_cat1.htm)
 * @param {string} pathname - The URL pathname
 * @returns {boolean}
 */
function isFirstChampionshipCatPage(pathname) {
  return /est_cat1\.htm$/i.test(pathname);
}

/**
 * Check if a section name is for championship cats
 * @param {string} sectionName - The section name (lowercase)
 * @returns {boolean}
 */
function isChampionshipSection(sectionName) {
  return sectionName === 'championship cats' || sectionName === 'cats';
}

module.exports = {
  parseUrl,
  isRankingsPage,
  isChampionshipCatPage,
  isFirstChampionshipCatPage,
  isChampionshipSection
};
