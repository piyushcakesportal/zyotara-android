import { BirthProfile, Language, PersonalityGuide } from '../types';

type ZodiacKey =
  | 'capricorn'
  | 'aquarius'
  | 'pisces'
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius';

interface ZodiacProfile {
  en: string;
  hi: string;
  strengthsEn: string[];
  strengthsHi: string[];
  growthEn: string[];
  growthHi: string[];
  luckyNumbers: number[];
  daysEn: string[];
  daysHi: string[];
  monthNumbers: number[];
}

const zodiacs: Record<ZodiacKey, ZodiacProfile> = {
  aries: {
    en: 'Aries',
    hi: 'मेष',
    strengthsEn: ['Initiative', 'Courage', 'Direct communication'],
    strengthsHi: ['पहल करने की क्षमता', 'साहस', 'सीधी बातचीत'],
    growthEn: ['Patience before acting', 'Listening without rushing'],
    growthHi: ['कदम उठाने से पहले धैर्य', 'जल्दबाजी के बिना सुनना'],
    luckyNumbers: [1, 9],
    daysEn: ['Tuesday', 'Sunday'],
    daysHi: ['मंगलवार', 'रविवार'],
    monthNumbers: [3, 4],
  },
  taurus: {
    en: 'Taurus',
    hi: 'वृषभ',
    strengthsEn: ['Reliability', 'Practical thinking', 'Persistence'],
    strengthsHi: ['भरोसेमंद स्वभाव', 'व्यावहारिक सोच', 'लगातार प्रयास'],
    growthEn: ['Adapting to change', 'Releasing stubborn patterns'],
    growthHi: ['बदलाव अपनाना', 'जिद्दी आदतों को छोड़ना'],
    luckyNumbers: [2, 6],
    daysEn: ['Friday', 'Monday'],
    daysHi: ['शुक्रवार', 'सोमवार'],
    monthNumbers: [4, 5],
  },
  gemini: {
    en: 'Gemini',
    hi: 'मिथुन',
    strengthsEn: ['Curiosity', 'Communication', 'Adaptability'],
    strengthsHi: ['जिज्ञासा', 'बातचीत की क्षमता', 'परिस्थिति के अनुसार ढलना'],
    growthEn: ['Following through', 'Reducing mental restlessness'],
    growthHi: ['काम पूरा करना', 'मानसिक बेचैनी कम करना'],
    luckyNumbers: [3, 5],
    daysEn: ['Wednesday', 'Friday'],
    daysHi: ['बुधवार', 'शुक्रवार'],
    monthNumbers: [5, 6],
  },
  cancer: {
    en: 'Cancer',
    hi: 'कर्क',
    strengthsEn: ['Empathy', 'Loyalty', 'Strong intuition'],
    strengthsHi: ['सहानुभूति', 'वफादारी', 'मजबूत अंतर्ज्ञान'],
    growthEn: ['Healthy boundaries', 'Not taking everything personally'],
    growthHi: ['स्वस्थ सीमाएं बनाना', 'हर बात को निजी न लेना'],
    luckyNumbers: [2, 7],
    daysEn: ['Monday', 'Thursday'],
    daysHi: ['सोमवार', 'गुरुवार'],
    monthNumbers: [6, 7],
  },
  leo: {
    en: 'Leo',
    hi: 'सिंह',
    strengthsEn: ['Confidence', 'Creativity', 'Warm leadership'],
    strengthsHi: ['आत्मविश्वास', 'रचनात्मकता', 'उत्साहपूर्ण नेतृत्व'],
    growthEn: ['Sharing attention', 'Accepting constructive feedback'],
    growthHi: ['दूसरों को भी महत्व देना', 'सुधार वाली प्रतिक्रिया स्वीकार करना'],
    luckyNumbers: [1, 4],
    daysEn: ['Sunday', 'Tuesday'],
    daysHi: ['रविवार', 'मंगलवार'],
    monthNumbers: [7, 8],
  },
  virgo: {
    en: 'Virgo',
    hi: 'कन्या',
    strengthsEn: ['Analysis', 'Responsibility', 'Attention to detail'],
    strengthsHi: ['विश्लेषण क्षमता', 'जिम्मेदारी', 'बारीकियों पर ध्यान'],
    growthEn: ['Avoiding overthinking', 'Accepting imperfect progress'],
    growthHi: ['ज्यादा सोचना कम करना', 'अपूर्ण प्रगति को स्वीकार करना'],
    luckyNumbers: [5, 6],
    daysEn: ['Wednesday', 'Friday'],
    daysHi: ['बुधवार', 'शुक्रवार'],
    monthNumbers: [8, 9],
  },
  libra: {
    en: 'Libra',
    hi: 'तुला',
    strengthsEn: ['Diplomacy', 'Fairness', 'Relationship awareness'],
    strengthsHi: ['कूटनीति', 'निष्पक्षता', 'रिश्तों की समझ'],
    growthEn: ['Making timely decisions', 'Avoiding people-pleasing'],
    growthHi: ['समय पर निर्णय लेना', 'सबको खुश करने की आदत कम करना'],
    luckyNumbers: [6, 9],
    daysEn: ['Friday', 'Monday'],
    daysHi: ['शुक्रवार', 'सोमवार'],
    monthNumbers: [9, 10],
  },
  scorpio: {
    en: 'Scorpio',
    hi: 'वृश्चिक',
    strengthsEn: ['Depth', 'Determination', 'Emotional insight'],
    strengthsHi: ['गहराई', 'दृढ़ निश्चय', 'भावनात्मक समझ'],
    growthEn: ['Trusting gradually', 'Letting go of old resentment'],
    growthHi: ['धीरे-धीरे भरोसा करना', 'पुरानी नाराजगी छोड़ना'],
    luckyNumbers: [8, 9],
    daysEn: ['Tuesday', 'Thursday'],
    daysHi: ['मंगलवार', 'गुरुवार'],
    monthNumbers: [10, 11],
  },
  sagittarius: {
    en: 'Sagittarius',
    hi: 'धनु',
    strengthsEn: ['Optimism', 'Learning', 'Big-picture thinking'],
    strengthsHi: ['आशावाद', 'सीखने की इच्छा', 'बड़ी तस्वीर देखना'],
    growthEn: ['Consistency', 'Being tactful with honesty'],
    growthHi: ['निरंतरता', 'सच बोलते समय संवेदनशीलता'],
    luckyNumbers: [3, 9],
    daysEn: ['Thursday', 'Sunday'],
    daysHi: ['गुरुवार', 'रविवार'],
    monthNumbers: [11, 12],
  },
  capricorn: {
    en: 'Capricorn',
    hi: 'मकर',
    strengthsEn: ['Discipline', 'Planning', 'Long-term commitment'],
    strengthsHi: ['अनुशासन', 'योजना बनाना', 'लंबे समय की प्रतिबद्धता'],
    growthEn: ['Allowing rest', 'Expressing feelings more openly'],
    growthHi: ['आराम के लिए समय देना', 'भावनाएं खुलकर व्यक्त करना'],
    luckyNumbers: [4, 8],
    daysEn: ['Saturday', 'Wednesday'],
    daysHi: ['शनिवार', 'बुधवार'],
    monthNumbers: [12, 1],
  },
  aquarius: {
    en: 'Aquarius',
    hi: 'कुंभ',
    strengthsEn: ['Independent ideas', 'Originality', 'Social awareness'],
    strengthsHi: ['स्वतंत्र विचार', 'मौलिकता', 'सामाजिक समझ'],
    growthEn: ['Emotional availability', 'Turning ideas into routines'],
    growthHi: ['भावनात्मक रूप से उपलब्ध रहना', 'विचारों को नियमित काम में बदलना'],
    luckyNumbers: [4, 7],
    daysEn: ['Saturday', 'Wednesday'],
    daysHi: ['शनिवार', 'बुधवार'],
    monthNumbers: [1, 2],
  },
  pisces: {
    en: 'Pisces',
    hi: 'मीन',
    strengthsEn: ['Compassion', 'Imagination', 'Sensitivity'],
    strengthsHi: ['करुणा', 'कल्पनाशक्ति', 'संवेदनशीलता'],
    growthEn: ['Practical boundaries', 'Separating intuition from worry'],
    growthHi: ['व्यावहारिक सीमाएं', 'अंतर्ज्ञान और चिंता में अंतर करना'],
    luckyNumbers: [3, 7],
    daysEn: ['Thursday', 'Monday'],
    daysHi: ['गुरुवार', 'सोमवार'],
    monthNumbers: [2, 3],
  },
};

const monthNames = {
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  hi: [
    'जनवरी',
    'फरवरी',
    'मार्च',
    'अप्रैल',
    'मई',
    'जून',
    'जुलाई',
    'अगस्त',
    'सितंबर',
    'अक्टूबर',
    'नवंबर',
    'दिसंबर',
  ],
};

const lifePathDescriptions: Record<number, { en: string; hi: string }> = {
  1: { en: 'You tend to value independence and initiative.', hi: 'आप स्वतंत्रता और पहल को महत्व देते हैं।' },
  2: { en: 'You tend to value cooperation, sensitivity and balance.', hi: 'आप सहयोग, संवेदनशीलता और संतुलन को महत्व देते हैं।' },
  3: { en: 'You tend to express yourself through creativity and communication.', hi: 'आप रचनात्मकता और बातचीत से खुद को व्यक्त करते हैं।' },
  4: { en: 'You tend to prefer structure, reliability and steady progress.', hi: 'आप व्यवस्था, भरोसे और लगातार प्रगति को पसंद करते हैं।' },
  5: { en: 'You tend to seek variety, movement and personal freedom.', hi: 'आप विविधता, बदलाव और व्यक्तिगत स्वतंत्रता चाहते हैं।' },
  6: { en: 'You tend to feel responsible for people and relationships around you.', hi: 'आप अपने आसपास के लोगों और रिश्तों के प्रति जिम्मेदारी महसूस करते हैं।' },
  7: { en: 'You tend to be reflective, analytical and privately spiritual.', hi: 'आप चिंतनशील, विश्लेषणात्मक और निजी रूप से आध्यात्मिक हो सकते हैं।' },
  8: { en: 'You tend to focus on achievement, management and material stability.', hi: 'आप उपलब्धि, प्रबंधन और आर्थिक स्थिरता पर ध्यान देते हैं।' },
  9: { en: 'You tend to think compassionately and see the wider human picture.', hi: 'आप करुणा के साथ सोचते हैं और बड़ी मानवीय तस्वीर देखते हैं।' },
  11: { en: 'You may combine strong intuition with inspiring communication.', hi: 'आप मजबूत अंतर्ज्ञान और प्रेरक बातचीत को जोड़ सकते हैं।' },
  22: { en: 'You may be drawn to turning ambitious ideas into practical results.', hi: 'आप बड़े विचारों को व्यावहारिक परिणाम में बदलने की ओर आकर्षित हो सकते हैं।' },
  33: { en: 'You may feel a strong pull toward care, teaching and service.', hi: 'आप देखभाल, शिक्षा और सेवा की ओर मजबूत खिंचाव महसूस कर सकते हैं।' },
};

function zodiacFor(month: number, day: number): ZodiacKey {
  const boundary: Array<[number, ZodiacKey]> = [
    [20, 'aquarius'],
    [19, 'pisces'],
    [21, 'aries'],
    [20, 'taurus'],
    [21, 'gemini'],
    [21, 'cancer'],
    [23, 'leo'],
    [23, 'virgo'],
    [23, 'libra'],
    [23, 'scorpio'],
    [22, 'sagittarius'],
    [22, 'capricorn'],
  ];
  const previous: ZodiacKey[] = [
    'capricorn',
    'aquarius',
    'pisces',
    'aries',
    'taurus',
    'gemini',
    'cancer',
    'leo',
    'virgo',
    'libra',
    'scorpio',
    'sagittarius',
  ];
  return day >= boundary[month - 1][0] ? boundary[month - 1][1] : previous[month - 1];
}

function reduceNumber(value: number, preserveMaster = true): number {
  let current = value;
  while (current > 9 && !(preserveMaster && [11, 22, 33].includes(current))) {
    current = String(current)
      .split('')
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return current;
}

function lifePath(dateOfBirth: string): number {
  const total = dateOfBirth
    .replace(/\D/g, '')
    .split('')
    .reduce((sum, digit) => sum + Number(digit), 0);
  return reduceNumber(total);
}

function nameNumber(name: string): number | undefined {
  const letters = name.toUpperCase().match(/[A-Z]/g);
  if (!letters?.length) return undefined;
  const total = letters.reduce(
    (sum, letter) => sum + ((letter.charCodeAt(0) - 65) % 9) + 1,
    0,
  );
  return reduceNumber(total);
}

function digitRoot(value: number): number {
  return reduceNumber(value, false);
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function luckyDates(numbers: number[]): number[] {
  const roots = unique(numbers.map(digitRoot));
  const dates: number[] = [];
  roots.forEach((root) => {
    for (let value = root; value <= 31; value += 9) dates.push(value);
  });
  return unique(dates).sort((a, b) => a - b).slice(0, 8);
}

export function createPersonalityGuide(
  profile: BirthProfile,
  language: Language,
): PersonalityGuide {
  const [, monthValue = '1', dayValue = '1'] = profile.dateOfBirth.split('-');
  const month = Math.min(12, Math.max(1, Number(monthValue) || 1));
  const day = Math.min(31, Math.max(1, Number(dayValue) || 1));
  const zodiacKey = zodiacFor(month, day);
  const zodiac = zodiacs[zodiacKey];
  const pathNumber = lifePath(profile.dateOfBirth);
  const calculatedNameNumber = nameNumber(profile.name);
  const luckyNumbers = unique([
    ...zodiac.luckyNumbers,
    digitRoot(pathNumber),
    ...(calculatedNameNumber ? [digitRoot(calculatedNameNumber)] : []),
  ]).slice(0, 5);
  const luckyMonthNumbers = unique([...zodiac.monthNumbers, month]).slice(0, 3);
  const nameSentence =
    calculatedNameNumber === undefined
      ? language === 'hi'
        ? 'नामांक के लिए सेटिंग्स में अपने नाम की सामान्य English spelling लिखें।'
        : 'Add the English spelling you commonly use to calculate a name number.'
      : language === 'hi'
        ? `आपका नामांक ${calculatedNameNumber} है।`
        : `Your name number is ${calculatedNameNumber}.`;

  return {
    zodiacSign: language === 'hi' ? zodiac.hi : zodiac.en,
    zodiacBasis:
      language === 'hi'
        ? `यह सूर्य राशि ${day} ${monthNames.hi[month - 1]} की जन्म तारीख से निकाली गई है।`
        : `This Sun sign is calculated from the birth date: ${day} ${monthNames.en[month - 1]}.`,
    lifePathNumber: pathNumber,
    nameNumber: calculatedNameNumber,
    personalitySummary:
      language === 'hi'
        ? `${zodiac.hi} राशि के कारण आपमें ${zodiac.strengthsHi.slice(0, 2).join(' और ')} की प्रवृत्ति हो सकती है। ${lifePathDescriptions[pathNumber]?.hi ?? lifePathDescriptions[digitRoot(pathNumber)].hi} ${nameSentence}`
        : `As a ${zodiac.en}, you may naturally show ${zodiac.strengthsEn.slice(0, 2).join(' and ').toLowerCase()}. ${lifePathDescriptions[pathNumber]?.en ?? lifePathDescriptions[digitRoot(pathNumber)].en} ${nameSentence}`,
    strengths: language === 'hi' ? zodiac.strengthsHi : zodiac.strengthsEn,
    growthAreas: language === 'hi' ? zodiac.growthHi : zodiac.growthEn,
    luckyNumbers,
    luckyDates: luckyDates(luckyNumbers),
    luckyDays: language === 'hi' ? zodiac.daysHi : zodiac.daysEn,
    luckyMonths: luckyMonthNumbers.map(
      (value) => monthNames[language][value - 1],
    ),
    calculationNote:
      language === 'hi'
        ? 'लकी जानकारी सूर्य राशि, जन्मांक और नामांक के पारंपरिक संबंधों का मिश्रण है। इसे मनोरंजन और आत्म-चिंतन के लिए लें, निश्चित भविष्यवाणी न मानें।'
        : 'Lucky guidance combines traditional Sun-sign, birth-number and name-number associations. Use it for entertainment and reflection, not as a guaranteed forecast.',
  };
}
