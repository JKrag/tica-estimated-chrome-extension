// TICA breed codes mapped to coat length category
// Source: TICA Standing Rules Version D 2-Dec-2025, pages 52-53
// Used for determining top 25 shorthair/longhair awards for championship cats

const LONGHAIR_BREEDS = new Set([
  'ABT',  // American Bobtail
  'ACL',  // American Curl Longhair
  'BA',   // Balinese
  'BGL',  // Bengal Longhair
  'BI',   // Birman
  'BL',   // British Longhair
  'BML',  // Burmilla Longhair
  'CY',   // Cymric
  'HG',   // Highlander
  'HI',   // Himalayan
  'JBL',  // Japanese Bobtail Longhair
  'KBL',  // Kurilian Bobtail Longhair
  'LP',   // LaPerm
  'MC',   // Maine Coon
  'MCP',  // Maine Coon Polydactyl
  'MNL',  // Minuet Longhair
  'MKL',  // Munchkin Longhair
  'NB',   // Nebelung
  'NF',   // Norwegian Forest Cat
  'OL',   // Oriental Longhair
  'PBL',  // Pixiebob Longhair
  'PS',   // Persian
  'RD',   // Ragdoll
  'SB',   // Siberian
  'SC',   // Scottish Straight Longhair
  'SFL',  // Scottish Fold Longhair
  'SO',   // Somali
  'SRL',  // Selkirk Rex Longhair
  'TR',   // Tennessee Rex LH
  'TA',   // Turkish Angora
  'TV',   // Turkish Van
]);

const SHORTHAIR_BREEDS = new Set([
  'AB',   // Abyssinian
  'ABS',  // American Bobtail Shorthair
  'AC',   // American Curl
  'AS',   // American Shorthair
  'AW',   // American Wirehair
  'AUM',  // Australian Mist
  'BG',   // Bengal
  'BO',   // Bombay
  'BS',   // British Shorthair
  'BU',   // Burmese
  'BM',   // Burmilla
  'CB',   // Cherubim
  'CR',   // Cornish Rex
  'CU',   // Chausie
  'CX',   // Chartreux
  'DR',   // Devon Rex
  'DSK',  // Donskoy
  'EM',   // Egyptian Mau
  'ES',   // Exotic Shorthair
  'HB',   // Havana
  'HGS',  // Highlander SH
  'JB',   // Japanese Bobtail
  'KB',   // Kurilian Bobtail
  'KM',   // Khaomanee
  'KT',   // Korat
  'LPS',  // LaPerm Shorthair
  'LY',   // Lykoi
  'MK',   // Munchkin
  'MNT',  // Minuet
  'MX',   // Manx
  'OC',   // Ocicat
  'OS',   // Oriental Shorthair
  'PD',   // Peterbald
  'PB',   // Pixiebob
  'RB',   // Russian Blue
  'SCS',  // Scottish Straight
  'SF',   // Scottish Fold
  'SG',   // Singapura
  'SI',   // Siamese
  'SN',   // Snowshoe
  'SR',   // Selkirk Rex
  'SV',   // Savannah
  'SX',   // Sphynx
  'TG',   // Toyger
  'TH',   // Thai
  'TO',   // Tonkinese
  'TRS',  // Tennessee Rex SH
]);

function isLonghair(breedCode) {
  return LONGHAIR_BREEDS.has(breedCode.toUpperCase());
}

function isShorthair(breedCode) {
  return SHORTHAIR_BREEDS.has(breedCode.toUpperCase());
}

const BREED_NAMES = {
  // Longhair
  'ABT': 'American Bobtail',
  'ACL': 'American Curl Longhair',
  'BA':  'Balinese',
  'BGL': 'Bengal Longhair',
  'BI':  'Birman',
  'BL':  'British Longhair',
  'BML': 'Burmilla Longhair',
  'CY':  'Cymric',
  'HG':  'Highlander',
  'HI':  'Himalayan',
  'JBL': 'Japanese Bobtail Longhair',
  'KBL': 'Kurilian Bobtail Longhair',
  'LP':  'LaPerm',
  'MC':  'Maine Coon',
  'MCP': 'Maine Coon Polydactyl',
  'MNL': 'Minuet Longhair',
  'MKL': 'Munchkin Longhair',
  'NB':  'Nebelung',
  'NF':  'Norwegian Forest Cat',
  'OL':  'Oriental Longhair',
  'PBL': 'Pixiebob Longhair',
  'PS':  'Persian',
  'RD':  'Ragdoll',
  'SB':  'Siberian',
  'SC':  'Scottish Straight Longhair',
  'SFL': 'Scottish Fold Longhair',
  'SO':  'Somali',
  'SRL': 'Selkirk Rex Longhair',
  'TR':  'Tennessee Rex Longhair',
  'TA':  'Turkish Angora',
  'TV':  'Turkish Van',
  // Shorthair
  'AB':  'Abyssinian',
  'ABS': 'American Bobtail Shorthair',
  'AC':  'American Curl',
  'AS':  'American Shorthair',
  'AW':  'American Wirehair',
  'AUM': 'Australian Mist',
  'BG':  'Bengal',
  'BO':  'Bombay',
  'BS':  'British Shorthair',
  'BU':  'Burmese',
  'BM':  'Burmilla',
  'CB':  'Cherubim',
  'CR':  'Cornish Rex',
  'CU':  'Chausie',
  'CX':  'Chartreux',
  'DR':  'Devon Rex',
  'DSK': 'Donskoy',
  'EM':  'Egyptian Mau',
  'ES':  'Exotic Shorthair',
  'HB':  'Havana',
  'HGS': 'Highlander Shorthair',
  'JB':  'Japanese Bobtail',
  'KB':  'Kurilian Bobtail',
  'KM':  'Khaomanee',
  'KT':  'Korat',
  'LPS': 'LaPerm Shorthair',
  'LY':  'Lykoi',
  'MK':  'Munchkin',
  'MNT': 'Minuet',
  'MX':  'Manx',
  'OC':  'Ocicat',
  'OS':  'Oriental Shorthair',
  'PD':  'Peterbald',
  'PB':  'Pixiebob',
  'RB':  'Russian Blue',
  'SCS': 'Scottish Straight',
  'SF':  'Scottish Fold',
  'SG':  'Singapura',
  'SI':  'Siamese',
  'SN':  'Snowshoe',
  'SR':  'Selkirk Rex',
  'SV':  'Savannah',
  'SX':  'Sphynx',
  'TG':  'Toyger',
  'TH':  'Thai',
  'TO':  'Tonkinese',
  'TRS': 'Tennessee Rex Shorthair',
};

function getBreedName(code) {
  return code ? (BREED_NAMES[code.toUpperCase()] || null) : null;
}

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LONGHAIR_BREEDS,
    SHORTHAIR_BREEDS,
    isLonghair,
    isShorthair,
    BREED_NAMES,
    getBreedName
  };
}
