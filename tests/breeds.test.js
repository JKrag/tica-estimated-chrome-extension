const {
  BREEDS,
  LONGHAIR_BREEDS,
  SHORTHAIR_BREEDS,
  isLonghair,
  isShorthair,
  getBreedName
} = require('../breeds.js');

describe('Breed Data Integrity', () => {
  test('longhair breeds set is not empty', () => {
    expect(LONGHAIR_BREEDS.size).toBeGreaterThan(0);
  });

  test('shorthair breeds set is not empty', () => {
    expect(SHORTHAIR_BREEDS.size).toBeGreaterThan(0);
  });

  test('no breed appears in both longhair and shorthair sets', () => {
    const overlap = [...LONGHAIR_BREEDS].filter(breed => SHORTHAIR_BREEDS.has(breed));
    expect(overlap).toEqual([]);
  });

  test('all breed codes are 2-3 uppercase letters', () => {
    const allBreeds = [...LONGHAIR_BREEDS, ...SHORTHAIR_BREEDS];
    allBreeds.forEach(breed => {
      expect(breed).toMatch(/^[A-Z]{2,3}$/);
    });
  });
});

describe('isLonghair()', () => {
  test('returns true for all longhair breed codes', () => {
    LONGHAIR_BREEDS.forEach(breed => {
      expect(isLonghair(breed)).toBe(true);
    });
  });

  test('returns false for shorthair breed codes', () => {
    SHORTHAIR_BREEDS.forEach(breed => {
      expect(isLonghair(breed)).toBe(false);
    });
  });

  test('returns false for unknown breed codes', () => {
    expect(isLonghair('XXX')).toBe(false);
    expect(isLonghair('ZZ')).toBe(false);
    expect(isLonghair('')).toBe(false);
  });

  test('is case insensitive', () => {
    expect(isLonghair('ps')).toBe(true);  // Persian
    expect(isLonghair('PS')).toBe(true);
    expect(isLonghair('Ps')).toBe(true);
    expect(isLonghair('mc')).toBe(true);  // Maine Coon
    expect(isLonghair('MC')).toBe(true);
  });
});

describe('isShorthair()', () => {
  test('returns true for all shorthair breed codes', () => {
    SHORTHAIR_BREEDS.forEach(breed => {
      expect(isShorthair(breed)).toBe(true);
    });
  });

  test('returns false for longhair breed codes', () => {
    LONGHAIR_BREEDS.forEach(breed => {
      expect(isShorthair(breed)).toBe(false);
    });
  });

  test('returns false for unknown breed codes', () => {
    expect(isShorthair('XXX')).toBe(false);
    expect(isShorthair('ZZ')).toBe(false);
    expect(isShorthair('')).toBe(false);
  });

  test('is case insensitive', () => {
    expect(isShorthair('bg')).toBe(true);  // Bengal
    expect(isShorthair('BG')).toBe(true);
    expect(isShorthair('Bg')).toBe(true);
    expect(isShorthair('si')).toBe(true);  // Siamese
    expect(isShorthair('SI')).toBe(true);
  });
});

describe('BREEDS / getBreedName', () => {
  test('every breed has coat (LH or SH) and name', () => {
    Object.values(BREEDS).forEach(data => {
      expect(['LH', 'SH']).toContain(data.coat);
      expect(typeof data.name).toBe('string');
      expect(data.name.length).toBeGreaterThan(0);
    });
  });

  test('getBreedName returns correct name for known code', () => {
    expect(getBreedName('OL')).toBe('Oriental Longhair');
  });

  test('getBreedName is case insensitive', () => {
    expect(getBreedName('ol')).toBe('Oriental Longhair');
    expect(getBreedName('Ol')).toBe('Oriental Longhair');
  });

  test('getBreedName returns null for unknown code', () => {
    expect(getBreedName('XX')).toBeNull();
  });
});

describe('Specific Breed Codes', () => {
  // Test some specific breeds to catch data entry errors
  const expectedLonghair = ['PS', 'MC', 'RD', 'NF', 'BI', 'SB', 'TA', 'TV', 'HI', 'BA'];
  const expectedShorthair = ['BG', 'SI', 'AB', 'BS', 'RB', 'BO', 'BU', 'SX', 'DR', 'CR'];

  test.each(expectedLonghair)('%s is classified as longhair', (breed) => {
    expect(isLonghair(breed)).toBe(true);
    expect(isShorthair(breed)).toBe(false);
  });

  test.each(expectedShorthair)('%s is classified as shorthair', (breed) => {
    expect(isShorthair(breed)).toBe(true);
    expect(isLonghair(breed)).toBe(false);
  });
});
