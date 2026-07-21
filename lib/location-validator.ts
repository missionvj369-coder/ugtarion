/**
 * Location Validator - Provides suggestions and auto-correction for location fields
 * Keeps free text input but adds intelligent suggestions
 */

// Common countries with variations
export const COUNTRIES: Record<string, string[]> = {
  'Afghanistan': ['Afghanistan', 'AFG', 'AF'],
  'Albania': ['Albania', 'AL'],
  'Algeria': ['Algeria', 'DZ'],
  'Argentina': ['Argentina', 'AR'],
  'Australia': ['Australia', 'AU'],
  'Austria': ['Austria', 'AT'],
  'Bangladesh': ['Bangladesh', 'BD'],
  'Belgium': ['Belgium', 'BE'],
  'Brazil': ['Brazil', 'BR'],
  'Canada': ['Canada', 'CA'],
  'Chile': ['Chile', 'CL'],
  'China': ['China', 'CN'],
  'Colombia': ['Colombia', 'CO'],
  'Croatia': ['Croatia', 'HR'],
  'Czech Republic': ['Czech Republic', 'Czechia', 'CZ'],
  'Denmark': ['Denmark', 'DK'],
  'Egypt': ['Egypt', 'EG'],
  'Finland': ['Finland', 'FI'],
  'France': ['France', 'FR'],
  'Germany': ['Germany', 'DE'],
  'Ghana': ['Ghana', 'GH'],
  'Greece': ['Greece', 'GR'],
  'Hungary': ['Hungary', 'HU'],
  'India': ['India', 'IN'],
  'Indonesia': ['Indonesia', 'ID'],
  'Iran': ['Iran', 'IR'],
  'Iraq': ['Iraq', 'IQ'],
  'Ireland': ['Ireland', 'IE'],
  'Israel': ['Israel', 'IL'],
  'Italy': ['Italy', 'IT'],
  'Japan': ['Japan', 'JP'],
  'Kenya': ['Kenya', 'KE'],
  'Malaysia': ['Malaysia', 'MY'],
  'Mexico': ['Mexico', 'MX'],
  'Morocco': ['Morocco', 'MA'],
  'Nepal': ['Nepal', 'NP'],
  'Netherlands': ['Netherlands', 'Holland', 'NL'],
  'New Zealand': ['New Zealand', 'NZ'],
  'Nigeria': ['Nigeria', 'NG'],
  'Norway': ['Norway', 'NO'],
  'Pakistan': ['Pakistan', 'PK'],
  'Peru': ['Peru', 'PE'],
  'Philippines': ['Philippines', 'PH'],
  'Poland': ['Poland', 'PL'],
  'Portugal': ['Portugal', 'PT'],
  'Romania': ['Romania', 'RO'],
  'Russia': ['Russia', 'Russian Federation', 'RU'],
  'Saudi Arabia': ['Saudi Arabia', 'SA'],
  'Singapore': ['Singapore', 'SG'],
  'South Africa': ['South Africa', 'ZA'],
  'South Korea': ['South Korea', 'Korea', 'Republic of Korea', 'KR'],
  'Spain': ['Spain', 'ES'],
  'Sri Lanka': ['Sri Lanka', 'LK'],
  'Sweden': ['Sweden', 'SE'],
  'Switzerland': ['Switzerland', 'CH'],
  'Thailand': ['Thailand', 'TH'],
  'Turkey': ['Turkey', 'TR'],
  'Ukraine': ['Ukraine', 'UA'],
  'United Arab Emirates': ['United Arab Emirates', 'UAE', 'AE'],
  'United Kingdom': ['United Kingdom', 'UK', 'Britain', 'England', 'GB'],
  'United States': ['United States', 'USA', 'US', 'America'],
  'Vietnam': ['Vietnam', 'Viet Nam', 'VN'],
};

// Common states/regions by country
export const STATES_BY_COUNTRY: Record<string, string[]> = {
  'India': [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
  ],
  'United States': [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
    'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
    'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
    'District of Columbia'
  ],
  'Australia': [
    'New South Wales', 'Victoria', 'Queensland', 'South Australia',
    'Western Australia', 'Tasmania', 'Northern Territory', 'Australian Capital Territory'
  ],
  'Canada': [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
    'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
  ],
};

// Common typos and corrections
const TYPO_CORRECTIONS: Record<string, string> = {
  'united sates': 'United States',
  'united stares': 'United States',
  'united stated': 'United States',
  'united kindom': 'United Kingdom',
  'united kingdon': 'United Kingdom',
  'great britain': 'United Kingdom',
  'england uk': 'United Kingdom',
  'indiaa': 'India',
  'indai': 'India',
  'indian': 'India',
  'austrlia': 'Australia',
  'austraila': 'Australia',
  'cananda': 'Canada',
  'canda': 'Canada',
  'germany': 'Germany',
  'france': 'France',
  'spain': 'Spain',
  'italy': 'Italy',
  'japan': 'Japan',
  'china': 'China',
  'brazill': 'Brazil',
  'mexico': 'Mexico',
  'russia': 'Russia',
  'poland': 'Poland',
  'netherlands': 'Netherlands',
  'holland': 'Netherlands',
  'sweden': 'Sweden',
  'norway': 'Norway',
  'denmark': 'Denmark',
  'finland': 'Finland',
  'switzerland': 'Switzerland',
  'belgium': 'Belgium',
  'austria': 'Austria',
  'ireland': 'Ireland',
  'new zealand': 'New Zealand',
  'singapore': 'Singapore',
  'malaysia': 'Malaysia',
  'indonesia': 'Indonesia',
  'thailand': 'Thailand',
  'vietnam': 'Vietnam',
  'philippines': 'Philippines',
  'pakistan': 'Pakistan',
  'bangladesh': 'Bangladesh',
  'sri lanka': 'Sri Lanka',
  'nepal': 'Nepal',
  'south africa': 'South Africa',
  'nigeria': 'Nigeria',
  'kenya': 'Kenya',
  'egypt': 'Egypt',
  'uae': 'United Arab Emirates',
  'dubai': 'United Arab Emirates',
  'korea': 'South Korea',
};

/**
 * Normalize a location string (trim, proper case)
 */
export function normalizeLocation(input: string): string {
  if (!input) return '';
  
  // Trim and normalize whitespace
  let normalized = input.trim().replace(/\s+/g, ' ');
  
  // Check for typo corrections first
  const lowerInput = normalized.toLowerCase();
  if (TYPO_CORRECTIONS[lowerInput]) {
    return TYPO_CORRECTIONS[lowerInput];
  }
  
  // Check if it's a known country variation
  for (const [canonical, variations] of Object.entries(COUNTRIES)) {
    if (variations.map(v => v.toLowerCase()).includes(lowerInput)) {
      return canonical;
    }
  }
  
  // Title case for other inputs
  return normalized.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get suggestions for a given input
 */
export function getSuggestions(input: string, options: string[], maxResults: number = 5): string[] {
  if (!input || input.length < 2) return [];
  
  const lowerInput = input.toLowerCase();
  
  // Exact match first
  const exactMatches = options.filter(opt => opt.toLowerCase() === lowerInput);
  if (exactMatches.length > 0) return exactMatches;
  
  // Starts with matches
  const startsWithMatches = options.filter(opt => 
    opt.toLowerCase().startsWith(lowerInput) && opt.toLowerCase() !== lowerInput
  );
  
  // Contains matches
  const containsMatches = options.filter(opt => 
    opt.toLowerCase().includes(lowerInput) && !opt.toLowerCase().startsWith(lowerInput)
  );
  
  // Fuzzy matches (simple Levenshtein for short distances)
  const fuzzyMatches = options.filter(opt => {
    const lowerOpt = opt.toLowerCase();
    if (lowerOpt.startsWith(lowerInput) || lowerOpt.includes(lowerInput)) return false;
    return levenshteinDistance(lowerInput, lowerOpt) <= Math.max(2, Math.floor(lowerInput.length / 3));
  });
  
  // Combine and limit results
  const allMatches = [...exactMatches, ...startsWithMatches, ...containsMatches, ...fuzzyMatches];
  return [...new Set(allMatches)].slice(0, maxResults);
}

/**
 * Get country suggestions
 */
export function getCountrySuggestions(input: string, maxResults: number = 5): string[] {
  const allCountries = Object.keys(COUNTRIES);
  return getSuggestions(input, allCountries, maxResults);
}

/**
 * Get state suggestions based on country
 */
export function getStateSuggestions(input: string, country: string, maxResults: number = 5): string[] {
  const normalizedCountry = normalizeLocation(country);
  const states = STATES_BY_COUNTRY[normalizedCountry] || [];
  return getSuggestions(input, states, maxResults);
}

/**
 * Simple Levenshtein distance calculation
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

/**
 * Check if input needs correction/suggestion
 */
export function needsCorrection(input: string): boolean {
  if (!input || input.length < 3) return false;
  
  const lowerInput = input.toLowerCase();
  
  // Check typo corrections
  if (TYPO_CORRECTIONS[lowerInput]) return true;
  
  // Check if it's a known variation
  for (const [canonical, variations] of Object.entries(COUNTRIES)) {
    if (variations.map(v => v.toLowerCase()).includes(lowerInput) && canonical.toLowerCase() !== lowerInput) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get correction for input
 */
export function getCorrection(input: string): string | null {
  if (!input) return null;
  
  const lowerInput = input.toLowerCase();
  
  // Check typo corrections
  if (TYPO_CORRECTIONS[lowerInput]) {
    return TYPO_CORRECTIONS[lowerInput];
  }
  
  // Check if it's a known variation
  for (const [canonical, variations] of Object.entries(COUNTRIES)) {
    if (variations.map(v => v.toLowerCase()).includes(lowerInput) && canonical.toLowerCase() !== lowerInput) {
      return canonical;
    }
  }
  
  return null;
}