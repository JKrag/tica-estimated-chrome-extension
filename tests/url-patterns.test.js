const {
  parseUrl,
  isRankingsPage,
  isChampionshipCatPage,
  isFirstChampionshipCatPage,
  isChampionshipSection
} = require('../lib/url-utils.js');

describe('parseUrl()', () => {
  test('extracts season and page from standard URL', () => {
    const result = parseUrl('/estimated_standings/2026/est_cat1.htm');
    expect(result).toEqual({ season: 2026, page: 'est_cat1.htm' });
  });

  test('extracts season and page from regional URL', () => {
    const result = parseUrl('/estimated_standings/2026/GL_region/');
    expect(result).toEqual({ season: 2026, page: 'GL_region/' });
  });

  test('handles URL without page', () => {
    const result = parseUrl('/estimated_standings/2026/');
    expect(result).toEqual({ season: 2026, page: '' });
  });

  test('handles URL without trailing slash', () => {
    const result = parseUrl('/estimated_standings/2026');
    expect(result).toEqual({ season: 2026, page: '' });
  });

  test('returns null season for non-matching URL', () => {
    const result = parseUrl('/some/other/path');
    expect(result).toEqual({ season: null, page: '' });
  });

  test('handles older seasons', () => {
    const result = parseUrl('/estimated_standings/2013/est_kit1.htm');
    expect(result).toEqual({ season: 2013, page: 'est_kit1.htm' });
  });
});

describe('isRankingsPage()', () => {
  describe('dedicated ranking pages', () => {
    test('matches championship cat pages', () => {
      expect(isRankingsPage('/estimated_standings/2026/est_cat1.htm')).toBe(true);
      expect(isRankingsPage('/estimated_standings/2026/est_cat2.htm')).toBe(true);
      expect(isRankingsPage('/estimated_standings/2026/est_cat10.htm')).toBe(true);
    });

    test('matches kitten pages', () => {
      expect(isRankingsPage('/estimated_standings/2026/est_kit1.htm')).toBe(true);
      expect(isRankingsPage('/estimated_standings/2026/est_kit2.htm')).toBe(true);
    });

    test('matches alter pages', () => {
      expect(isRankingsPage('/estimated_standings/2026/est_alt1.htm')).toBe(true);
    });

    test('matches household pet pages', () => {
      expect(isRankingsPage('/estimated_standings/2026/est_hhp1.htm')).toBe(true);
      expect(isRankingsPage('/estimated_standings/2026/est_hhk1.htm')).toBe(true);
    });

    test('is case insensitive', () => {
      expect(isRankingsPage('/estimated_standings/2026/EST_CAT1.HTM')).toBe(true);
      expect(isRankingsPage('/estimated_standings/2026/Est_Kit1.Htm')).toBe(true);
    });
  });

  describe('regional pages', () => {
    test('matches regional directory paths', () => {
      expect(isRankingsPage('/estimated_standings/2026/GL_region/')).toBe(true);
      expect(isRankingsPage('/estimated_standings/2026/NE_region/')).toBe(true);
      expect(isRankingsPage('/estimated_standings/2026/SW_region')).toBe(true);
    });

    test('is case insensitive for regional', () => {
      expect(isRankingsPage('/estimated_standings/2026/GL_REGION/')).toBe(true);
    });
  });

  describe('non-ranking pages', () => {
    test('does not match index pages', () => {
      expect(isRankingsPage('/estimated_standings/2026/')).toBe(false);
      expect(isRankingsPage('/estimated_standings/2026/index.htm')).toBe(false);
    });

    test('does not match breed-specific pages', () => {
      expect(isRankingsPage('/estimated_standings/2026/est_bg.htm')).toBe(false);
    });
  });
});

describe('isChampionshipCatPage()', () => {
  test('matches championship cat pages', () => {
    expect(isChampionshipCatPage('/estimated_standings/2026/est_cat1.htm')).toBe(true);
    expect(isChampionshipCatPage('/estimated_standings/2026/est_cat2.htm')).toBe(true);
    expect(isChampionshipCatPage('/estimated_standings/2026/est_cat10.htm')).toBe(true);
  });

  test('does not match kitten pages', () => {
    expect(isChampionshipCatPage('/estimated_standings/2026/est_kit1.htm')).toBe(false);
  });

  test('does not match alter pages', () => {
    expect(isChampionshipCatPage('/estimated_standings/2026/est_alt1.htm')).toBe(false);
  });

  test('does not match regional pages', () => {
    expect(isChampionshipCatPage('/estimated_standings/2026/GL_region/')).toBe(false);
  });

  test('is case insensitive', () => {
    expect(isChampionshipCatPage('/estimated_standings/2026/EST_CAT1.HTM')).toBe(true);
  });
});

describe('isFirstChampionshipCatPage()', () => {
  test('matches only est_cat1.htm', () => {
    expect(isFirstChampionshipCatPage('/estimated_standings/2026/est_cat1.htm')).toBe(true);
  });

  test('does not match other cat pages', () => {
    expect(isFirstChampionshipCatPage('/estimated_standings/2026/est_cat2.htm')).toBe(false);
    expect(isFirstChampionshipCatPage('/estimated_standings/2026/est_cat10.htm')).toBe(false);
  });

  test('does not match non-cat pages', () => {
    expect(isFirstChampionshipCatPage('/estimated_standings/2026/est_kit1.htm')).toBe(false);
    expect(isFirstChampionshipCatPage('/estimated_standings/2026/GL_region/')).toBe(false);
  });

  test('is case insensitive', () => {
    expect(isFirstChampionshipCatPage('/estimated_standings/2026/EST_CAT1.HTM')).toBe(true);
  });
});

describe('isChampionshipSection()', () => {
  test('matches "championship cats" section', () => {
    expect(isChampionshipSection('championship cats')).toBe(true);
  });

  test('matches "cats" section', () => {
    expect(isChampionshipSection('cats')).toBe(true);
  });

  test('does not match other sections', () => {
    expect(isChampionshipSection('kittens')).toBe(false);
    expect(isChampionshipSection('alters')).toBe(false);
    expect(isChampionshipSection('household pets')).toBe(false);
  });
});
