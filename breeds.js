// TICA breed codes mapped to coat length category and display name
// Source: TICA Standing Rules Version D 2-Dec-2025, pages 52-53
// Used for determining top 25 shorthair/longhair awards for championship cats

const BREEDS = {
  // Longhair
  'ABT': { coat: 'LH', name: 'American Bobtail' },
  'ACL': { coat: 'LH', name: 'American Curl Longhair' },
  'BA':  { coat: 'LH', name: 'Balinese' },
  'BGL': { coat: 'LH', name: 'Bengal Longhair' },
  'BI':  { coat: 'LH', name: 'Birman' },
  'BL':  { coat: 'LH', name: 'British Longhair' },
  'BML': { coat: 'LH', name: 'Burmilla Longhair' },
  'CY':  { coat: 'LH', name: 'Cymric' },
  'HG':  { coat: 'LH', name: 'Highlander' },
  'HI':  { coat: 'LH', name: 'Himalayan' },
  'JBL': { coat: 'LH', name: 'Japanese Bobtail Longhair' },
  'KBL': { coat: 'LH', name: 'Kurilian Bobtail Longhair' },
  'LP':  { coat: 'LH', name: 'LaPerm' },
  'MC':  { coat: 'LH', name: 'Maine Coon' },
  'MCP': { coat: 'LH', name: 'Maine Coon Polydactyl' },
  'MNL': { coat: 'LH', name: 'Minuet Longhair' },
  'MKL': { coat: 'LH', name: 'Munchkin Longhair' },
  'NB':  { coat: 'LH', name: 'Nebelung' },
  'NF':  { coat: 'LH', name: 'Norwegian Forest Cat' },
  'OL':  { coat: 'LH', name: 'Oriental Longhair' },
  'PBL': { coat: 'LH', name: 'Pixiebob Longhair' },
  'PS':  { coat: 'LH', name: 'Persian' },
  'RD':  { coat: 'LH', name: 'Ragdoll' },
  'SB':  { coat: 'LH', name: 'Siberian' },
  'SC':  { coat: 'LH', name: 'Scottish Straight Longhair' },
  'SFL': { coat: 'LH', name: 'Scottish Fold Longhair' },
  'SO':  { coat: 'LH', name: 'Somali' },
  'SRL': { coat: 'LH', name: 'Selkirk Rex Longhair' },
  'TR':  { coat: 'LH', name: 'Tennessee Rex Longhair' },
  'TA':  { coat: 'LH', name: 'Turkish Angora' },
  'TV':  { coat: 'LH', name: 'Turkish Van' },
  // Shorthair
  'AB':  { coat: 'SH', name: 'Abyssinian' },
  'ABS': { coat: 'SH', name: 'American Bobtail Shorthair' },
  'AC':  { coat: 'SH', name: 'American Curl' },
  'AS':  { coat: 'SH', name: 'American Shorthair' },
  'AW':  { coat: 'SH', name: 'American Wirehair' },
  'AUM': { coat: 'SH', name: 'Australian Mist' },
  'BG':  { coat: 'SH', name: 'Bengal' },
  'BO':  { coat: 'SH', name: 'Bombay' },
  'BS':  { coat: 'SH', name: 'British Shorthair' },
  'BU':  { coat: 'SH', name: 'Burmese' },
  'BM':  { coat: 'SH', name: 'Burmilla' },
  'CB':  { coat: 'SH', name: 'Cherubim' },
  'CR':  { coat: 'SH', name: 'Cornish Rex' },
  'CU':  { coat: 'SH', name: 'Chausie' },
  'CX':  { coat: 'SH', name: 'Chartreux' },
  'DR':  { coat: 'SH', name: 'Devon Rex' },
  'DSK': { coat: 'SH', name: 'Donskoy' },
  'EM':  { coat: 'SH', name: 'Egyptian Mau' },
  'ES':  { coat: 'SH', name: 'Exotic Shorthair' },
  'HB':  { coat: 'SH', name: 'Havana' },
  'HGS': { coat: 'SH', name: 'Highlander Shorthair' },
  'JB':  { coat: 'SH', name: 'Japanese Bobtail' },
  'KB':  { coat: 'SH', name: 'Kurilian Bobtail' },
  'KM':  { coat: 'SH', name: 'Khaomanee' },
  'KT':  { coat: 'SH', name: 'Korat' },
  'LPS': { coat: 'SH', name: 'LaPerm Shorthair' },
  'LY':  { coat: 'SH', name: 'Lykoi' },
  'MK':  { coat: 'SH', name: 'Munchkin' },
  'MNT': { coat: 'SH', name: 'Minuet' },
  'MX':  { coat: 'SH', name: 'Manx' },
  'OC':  { coat: 'SH', name: 'Ocicat' },
  'OS':  { coat: 'SH', name: 'Oriental Shorthair' },
  'PD':  { coat: 'SH', name: 'Peterbald' },
  'PB':  { coat: 'SH', name: 'Pixiebob' },
  'RB':  { coat: 'SH', name: 'Russian Blue' },
  'SCS': { coat: 'SH', name: 'Scottish Straight' },
  'SF':  { coat: 'SH', name: 'Scottish Fold' },
  'SG':  { coat: 'SH', name: 'Singapura' },
  'SI':  { coat: 'SH', name: 'Siamese' },
  'SN':  { coat: 'SH', name: 'Snowshoe' },
  'SR':  { coat: 'SH', name: 'Selkirk Rex' },
  'SV':  { coat: 'SH', name: 'Savannah' },
  'SX':  { coat: 'SH', name: 'Sphynx' },
  'TG':  { coat: 'SH', name: 'Toyger' },
  'TH':  { coat: 'SH', name: 'Thai' },
  'TO':  { coat: 'SH', name: 'Tonkinese' },
  'TRS': { coat: 'SH', name: 'Tennessee Rex Shorthair' },
};

// Derived Sets for backwards-compatible iteration in tests
const LONGHAIR_BREEDS  = new Set(Object.keys(BREEDS).filter(k => BREEDS[k].coat === 'LH'));
const SHORTHAIR_BREEDS = new Set(Object.keys(BREEDS).filter(k => BREEDS[k].coat === 'SH'));

function isLonghair(breedCode) {
  return !!breedCode && BREEDS[breedCode.toUpperCase()]?.coat === 'LH';
}

function isShorthair(breedCode) {
  return !!breedCode && BREEDS[breedCode.toUpperCase()]?.coat === 'SH';
}

function getBreedName(code) {
  return code ? (BREEDS[code.toUpperCase()]?.name || null) : null;
}

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BREEDS,
    LONGHAIR_BREEDS,
    SHORTHAIR_BREEDS,
    isLonghair,
    isShorthair,
    getBreedName
  };
}
