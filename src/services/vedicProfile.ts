import { EclipticGeoMoon } from 'astronomy-engine';
import { BirthProfile, Language, VedicProfile } from '../types';
import {
  getZodiacKey,
  getZodiacName,
  ZodiacKey,
} from './personalityGuide';

const rashiOrder: ZodiacKey[] = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
];

const rashiSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

const rashiLords: Record<ZodiacKey, { en: string; hi: string }> = {
  aries: { en: 'Mars', hi: 'मंगल' },
  taurus: { en: 'Venus', hi: 'शुक्र' },
  gemini: { en: 'Mercury', hi: 'बुध' },
  cancer: { en: 'Moon', hi: 'चंद्र' },
  leo: { en: 'Sun', hi: 'सूर्य' },
  virgo: { en: 'Mercury', hi: 'बुध' },
  libra: { en: 'Venus', hi: 'शुक्र' },
  scorpio: { en: 'Mars', hi: 'मंगल' },
  sagittarius: { en: 'Jupiter', hi: 'गुरु' },
  capricorn: { en: 'Saturn', hi: 'शनि' },
  aquarius: { en: 'Saturn', hi: 'शनि' },
  pisces: { en: 'Jupiter', hi: 'गुरु' },
};

const nakshatras = [
  ['Ashwini', 'अश्विनी'],
  ['Bharani', 'भरणी'],
  ['Krittika', 'कृत्तिका'],
  ['Rohini', 'रोहिणी'],
  ['Mrigashira', 'मृगशिरा'],
  ['Ardra', 'आर्द्रा'],
  ['Punarvasu', 'पुनर्वसु'],
  ['Pushya', 'पुष्य'],
  ['Ashlesha', 'आश्लेषा'],
  ['Magha', 'मघा'],
  ['Purva Phalguni', 'पूर्व फाल्गुनी'],
  ['Uttara Phalguni', 'उत्तर फाल्गुनी'],
  ['Hasta', 'हस्त'],
  ['Chitra', 'चित्रा'],
  ['Swati', 'स्वाती'],
  ['Vishakha', 'विशाखा'],
  ['Anuradha', 'अनुराधा'],
  ['Jyeshtha', 'ज्येष्ठा'],
  ['Mula', 'मूल'],
  ['Purva Ashadha', 'पूर्वाषाढ़ा'],
  ['Uttara Ashadha', 'उत्तराषाढ़ा'],
  ['Shravana', 'श्रवण'],
  ['Dhanishta', 'धनिष्ठा'],
  ['Shatabhisha', 'शतभिषा'],
  ['Purva Bhadrapada', 'पूर्व भाद्रपद'],
  ['Uttara Bhadrapada', 'उत्तर भाद्रपद'],
  ['Revati', 'रेवती'],
] as const;

function normaliseDegrees(value: number): number {
  return ((value % 360) + 360) % 360;
}

function timezoneMinutes(value: string): number | undefined {
  const match = /^([+-])(\d{2}):(\d{2})$/.exec(value);
  if (!match) return undefined;
  const hours = Number(match[2]);
  const minutes = Number(match[3]);
  if (hours > 14 || minutes > 59) return undefined;
  const total = hours * 60 + minutes;
  return match[1] === '-' ? -total : total;
}

function birthMoment(profile: BirthProfile): Date | undefined {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(profile.dateOfBirth);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(profile.birthTime);
  const offset = timezoneMinutes(profile.timezoneOffset);
  if (!dateMatch || !timeMatch || offset === undefined) return undefined;

  const localUtcValue = Date.UTC(
    Number(dateMatch[1]),
    Number(dateMatch[2]) - 1,
    Number(dateMatch[3]),
    Number(timeMatch[1]),
    Number(timeMatch[2]),
  );
  return new Date(localUtcValue - offset * 60_000);
}

/**
 * Lahiri/Chitrapaksha ayanamsa approximation.
 * The linear term is the traditional KP/Lahiri rate and the small offset
 * aligns it to Swiss Ephemeris Lahiri values across the supported birth years.
 */
function lahiriAyanamsa(date: Date): number {
  const year = date.getUTCFullYear();
  const april15 = Date.UTC(year, 3, 15, 0, 0, 0);
  const decimalYear =
    year + (date.getTime() - april15) / (365.2425 * 24 * 60 * 60 * 1000);
  return ((decimalYear - 291) * 50.2388475) / 3600 + 0.01175;
}

function sunSignKey(profile: BirthProfile): ZodiacKey {
  const [, month = '1', day = '1'] = profile.dateOfBirth.split('-');
  return getZodiacKey(Number(month), Number(day));
}

export function createVedicProfile(
  profile: BirthProfile,
  language: Language,
): VedicProfile {
  const sunKey = sunSignKey(profile);
  const sunSign = getZodiacName(sunKey, language);
  const moment =
    profile.birthTimePrecision === 'unknown' ? undefined : birthMoment(profile);

  if (!moment) {
    return {
      status: 'limited',
      sunSign,
      calculationExplanation:
        language === 'hi'
          ? 'चंद्र राशि निकालने के लिए जन्म तारीख के साथ जन्म समय और UTC समय-अंतर जरूरी है। ऐप अनुमान लगाकर गलत राशि नहीं दिखाएगा।'
          : 'Moon Rashi needs a birth date, birth time and UTC offset. The app will not guess a Rashi when those details are missing.',
      precisionNote:
        language === 'hi'
          ? 'फिलहाल केवल जन्म तारीख से सूर्य राशि दिखाई जा रही है।'
          : 'Only the date-based Sun sign is available for this profile.',
    };
  }

  const tropicalMoonLongitude = EclipticGeoMoon(moment).lon;
  const siderealMoonLongitude = normaliseDegrees(
    tropicalMoonLongitude - lahiriAyanamsa(moment),
  );
  const rashiIndex = Math.floor(siderealMoonLongitude / 30);
  const moonRashiKey = rashiOrder[rashiIndex];
  const nakshatraSpan = 360 / 27;
  const nakshatraIndex = Math.floor(siderealMoonLongitude / nakshatraSpan);
  const positionWithinNakshatra =
    siderealMoonLongitude - nakshatraIndex * nakshatraSpan;
  const nakshatraPada = Math.min(
    4,
    Math.floor(positionWithinNakshatra / (nakshatraSpan / 4)) + 1,
  );

  return {
    status: 'calculated',
    moonRashi: getZodiacName(moonRashiKey, language),
    moonRashiKey,
    moonRashiSymbol: rashiSymbols[rashiIndex],
    nakshatra: nakshatras[nakshatraIndex][language === 'hi' ? 1 : 0],
    nakshatraPada,
    rulingPlanet: rashiLords[moonRashiKey][language],
    siderealMoonLongitude,
    sunSign,
    calculationExplanation:
      language === 'hi'
        ? `जन्म तारीख, ${profile.birthTime} समय और ${profile.timezoneOffset} UTC अंतर से जन्म क्षण निकाला गया। उस समय चंद्रमा की खगोलीय स्थिति पर Lahiri अयनांश लागू करके 12 राशियों और 27 नक्षत्रों में स्थान तय किया गया।`
        : `The birth moment is created from the date, ${profile.birthTime} time and ${profile.timezoneOffset} UTC offset. The Moon’s astronomical longitude is converted to the Lahiri sidereal zodiac, then mapped across 12 Rashis and 27 Nakshatras.`,
    precisionNote:
      profile.birthTimePrecision === 'approximate'
        ? language === 'hi'
          ? 'जन्म समय लगभग है, इसलिए नक्षत्र पद या सीमा के पास राशि बदल सकती है।'
          : 'The birth time is approximate, so the Nakshatra Pada—or a Rashi close to a boundary—may change.'
        : language === 'hi'
          ? 'सटीक जन्म समय उपयोग किया गया है। सीमा के बहुत पास परिणाम में पेशेवर कुंडली से पुष्टि उपयोगी हो सकती है।'
          : 'An exact birth time was used. A result extremely close to a boundary is still worth confirming with a professional chart.',
  };
}

export function getGuidanceZodiacKey(profile: BirthProfile): {
  key: ZodiacKey;
  basis: 'moon' | 'sun';
} {
  const vedic = createVedicProfile(profile, 'en');
  if (vedic.status === 'calculated' && vedic.moonRashiKey) {
    return { key: vedic.moonRashiKey as ZodiacKey, basis: 'moon' };
  }
  return { key: sunSignKey(profile), basis: 'sun' };
}
