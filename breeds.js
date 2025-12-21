// TICA breed codes mapped to coat length category
// Source: https://ticamembers.org/showrep/how2read.htm
// Used for determining top 25 shorthair/longhair awards for championship cats

const LONGHAIR_BREEDS = new Set([
  'ABT',  // American Bobtail
  'ACL',  // American Curl Longhair
  'BA',   // Balinese
  'BI',   // Birman
  'BL',   // British Longhair
  'CY',   // Cymric
  'HI',   // Himalayan
  'JBL',  // Japanese Bobtail Longhair
  'KBL',  // Kurilian Bobtail Longhair
  'LP',   // La Perm
  'MC',   // Maine Coon
  'MKL',  // Munchkin Longhair
  'NB',   // Nebelung
  'NF',   // Norwegian Forest Cat
  'NPL',  // Napoleon Longhair
  'OAL',  // Ojos Azules Longhair
  'OL',   // Oriental Longhair
  'PBL',  // Pixiebob Longhair
  'PS',   // Persian
  'RD',   // Ragdoll
  'SB',   // Siberian
  'SFL',  // Scottish Fold Longhair
  'SO',   // Somali
  'SRL',  // Selkirk Rex Longhair
  'TA',   // Turkish Angora
  'TV',   // Turkish Van
]);

const SHORTHAIR_BREEDS = new Set([
  'AB',   // Abyssinian
  'ABS',  // American Bobtail Shorthair
  'AC',   // American Curl
  'AS',   // American Shorthair
  'AW',   // American Wirehair
  'BG',   // Bengal
  'BO',   // Bombay
  'BS',   // British Shorthair
  'BU',   // Burmese
  'CU',   // Chausie
  'CX',   // Chartreux
  'CR',   // Cornish Rex
  'DR',   // Devon Rex
  'DSK',  // Donskoy
  'EM',   // Egyptian Mau
  'ES',   // Exotic Shorthair
  'HB',   // Havana
  'HGS',  // Highlander Shorthair
  'JB',   // Japanese Bobtail
  'KB',   // Kurilian Bobtail
  'KM',   // Khao Manee
  'KT',   // Korat
  'LPS',  // La Perm Shorthair
  'MK',   // Munchkin
  'MS',   // Minskin
  'MX',   // Manx
  'NA',   // Napoleon
  'OA',   // Ojos Azules
  'OC',   // Ocicat
  'OS',   // Oriental Shorthair
  'PB',   // Pixiebob
  'PD',   // Peterbald
  'RB',   // Russian Blue
  'SE',   // Serengeti
  'SF',   // Scottish Fold
  'SG',   // Singapura
  'SI',   // Siamese
  'SK',   // Sokoke
  'SN',   // Snowshoe
  'SR',   // Selkirk Rex
  'SV',   // Savannah
  'SX',   // Sphynx
  'TG',   // Toyger
  'TH',   // Thai
  'TO',   // Tonkinese
]);

function isLonghair(breedCode) {
  return LONGHAIR_BREEDS.has(breedCode.toUpperCase());
}

function isShorthair(breedCode) {
  return SHORTHAIR_BREEDS.has(breedCode.toUpperCase());
}
