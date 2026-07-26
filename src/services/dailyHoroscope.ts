import {
  createPersonalityGuide,
  getZodiacName,
  ZodiacKey,
} from './personalityGuide';
import { BirthProfile, DailyHoroscope, Language } from '../types';
import { getGuidanceZodiacKey } from './vedicProfile';

const content = {
  en: {
    overview: [
      'A steady approach will help you notice an opportunity that haste could hide.',
      'Today favours clearing one unfinished matter before beginning something new.',
      'Your strongest results may come from calm communication and realistic expectations.',
      'A small change in routine can improve both clarity and confidence today.',
      'Protect your attention from unnecessary noise and give priority to one meaningful task.',
      'The day supports practical decisions when you check the facts before responding.',
      'Progress may feel quiet today, but consistent effort can create useful momentum.',
    ],
    career: [
      'Complete the most important pending task before taking on additional work.',
      'A direct but respectful conversation can remove confusion at work.',
      'Review details carefully; a small correction may prevent a larger delay.',
      'Use the day for planning, skill practice or following up on an earlier opportunity.',
      'Avoid comparing your progress with others and focus on one measurable improvement.',
      'Keep financial or business decisions practical rather than emotional today.',
      'Someone may notice your reliability when you deliver what you promised.',
    ],
    relationship: [
      'Listen fully before explaining your side; the tone of the conversation matters today.',
      'A simple honest message can be more useful than expecting someone to guess your feelings.',
      'Avoid reacting to assumptions. Ask for clarity before reaching a conclusion.',
      'Give attention to consistent actions rather than one emotional moment.',
      'Healthy space can improve understanding; distance does not always mean rejection.',
      'Appreciation expressed directly may soften a tense or uncertain situation.',
      'Set a clear boundary calmly if a repeated issue is draining your energy.',
    ],
    wellbeing: [
      'Short breaks, water and a lighter evening routine may help maintain your energy.',
      'Mental rest is important today; reduce unnecessary screen time before sleep.',
      'A brief walk or stretching session can help release accumulated tension.',
      'Eat and rest on time rather than waiting until your energy drops.',
      'Slow breathing for a few minutes may help you respond instead of react.',
      'Keep your schedule realistic and leave room for recovery.',
      'Choose consistency over intensity in exercise and daily habits.',
    ],
    focus: [
      'Finish one pending task.',
      'Have one honest conversation.',
      'Write down your top three priorities.',
      'Avoid one unnecessary expense.',
      'Spend 20 minutes learning a useful skill.',
      'Make one decision using facts, not fear.',
      'Create a calmer evening routine.',
    ],
    colors: ['Deep blue', 'Saffron', 'Emerald green', 'White', 'Purple', 'Sky blue', 'Rose pink'],
    times: ['8:00–10:00 AM', '10:30 AM–12:00 PM', '12:30–2:00 PM', '3:00–5:00 PM', '5:30–7:00 PM', '7:00–8:30 PM'],
  },
  hi: {
    overview: [
      'शांत और स्थिर तरीका आपको ऐसा अवसर दिखा सकता है जो जल्दबाजी में छूट जाता।',
      'आज कुछ नया शुरू करने से पहले एक अधूरा काम पूरा करना अधिक लाभदायक रहेगा।',
      'शांत बातचीत और वास्तविक अपेक्षाएं आज बेहतर परिणाम दे सकती हैं।',
      'दिनचर्या में छोटा बदलाव स्पष्टता और आत्मविश्वास बढ़ा सकता है।',
      'अनावश्यक शोर से अपना ध्यान बचाएं और एक महत्वपूर्ण काम को प्राथमिकता दें।',
      'जवाब देने से पहले तथ्य जांचने पर आज व्यावहारिक निर्णय लेना आसान रहेगा।',
      'प्रगति आज धीमी लग सकती है, लेकिन लगातार प्रयास उपयोगी गति बनाएगा।',
    ],
    career: [
      'नया काम लेने से पहले सबसे जरूरी अधूरा काम पूरा करें।',
      'सीधी लेकिन सम्मानजनक बातचीत काम की उलझन दूर कर सकती है।',
      'विवरण ध्यान से देखें; छोटा सुधार बड़ी देरी से बचा सकता है।',
      'आज योजना, कौशल अभ्यास या पुराने अवसर पर फॉलो-अप करना उपयोगी रहेगा।',
      'अपनी तुलना दूसरों से न करें और एक मापने योग्य सुधार पर ध्यान दें।',
      'आर्थिक या व्यापारिक निर्णय भावनाओं के बजाय व्यावहारिकता से लें।',
      'वादा पूरा करने पर कोई आपकी भरोसेमंद कार्यशैली को नोटिस कर सकता है।',
    ],
    relationship: [
      'अपनी बात कहने से पहले पूरी तरह सुनें; आज बातचीत का लहजा महत्वपूर्ण है।',
      'सामने वाले से मन पढ़ने की उम्मीद रखने के बजाय ईमानदारी से बात करें।',
      'अनुमान पर प्रतिक्रिया न दें। निष्कर्ष से पहले स्थिति साफ करें।',
      'एक भावनात्मक पल के बजाय लगातार व्यवहार पर ध्यान दें।',
      'स्वस्थ दूरी समझ बढ़ा सकती है; दूरी हमेशा अस्वीकार करना नहीं होती।',
      'सीधे व्यक्त की गई सराहना तनावपूर्ण स्थिति को नरम कर सकती है।',
      'बार-बार होने वाली समस्या ऊर्जा कम कर रही हो तो शांत तरीके से सीमा तय करें।',
    ],
    wellbeing: [
      'छोटे ब्रेक, पर्याप्त पानी और हल्की शाम की दिनचर्या ऊर्जा बनाए रख सकती है।',
      'आज मानसिक आराम जरूरी है; सोने से पहले अनावश्यक स्क्रीन समय कम करें।',
      'थोड़ी देर टहलने या स्ट्रेचिंग से जमा तनाव कम हो सकता है।',
      'ऊर्जा गिरने का इंतजार किए बिना समय पर भोजन और आराम करें।',
      'कुछ मिनट धीमी सांस लेने से प्रतिक्रिया देने के बजाय समझदारी से जवाब दे पाएंगे।',
      'अपना कार्यक्रम वास्तविक रखें और आराम के लिए जगह छोड़ें।',
      'व्यायाम और आदतों में बहुत अधिक तीव्रता के बजाय निरंतरता चुनें।',
    ],
    focus: [
      'एक अधूरा काम पूरा करें।',
      'एक ईमानदार बातचीत करें।',
      'अपनी तीन मुख्य प्राथमिकताएं लिखें।',
      'एक अनावश्यक खर्च रोकें।',
      '20 मिनट उपयोगी कौशल सीखें।',
      'डर के बजाय तथ्यों से एक निर्णय लें।',
      'शांत शाम की दिनचर्या बनाएं।',
    ],
    colors: ['गहरा नीला', 'केसरिया', 'हरा', 'सफेद', 'बैंगनी', 'आसमानी', 'गुलाबी'],
    times: ['सुबह 8:00–10:00', 'सुबह 10:30–दोपहर 12:00', 'दोपहर 12:30–2:00', 'दोपहर 3:00–5:00', 'शाम 5:30–7:00', 'शाम 7:00–8:30'],
  },
} as const;

const zodiacRemedies: Record<
  ZodiacKey,
  {
    actionEn: string;
    actionHi: string;
    affirmationEn: string;
    affirmationHi: string;
    avoidEn: string;
    avoidHi: string;
  }
> = {
  aries: {
    actionEn: 'Before starting important work, drink water calmly and pause for three slow breaths.',
    actionHi: 'जरूरी काम शुरू करने से पहले शांति से पानी पिएं और तीन धीमी सांस लें।',
    affirmationEn: 'I use my courage with patience.',
    affirmationHi: 'मैं अपने साहस का उपयोग धैर्य के साथ करता/करती हूं।',
    avoidEn: 'An impulsive reply',
    avoidHi: 'जल्दबाजी में जवाब देना',
  },
  taurus: {
    actionEn: 'Share food or another useful item with someone who genuinely needs it.',
    actionHi: 'किसी जरूरतमंद व्यक्ति के साथ भोजन या कोई उपयोगी वस्तु साझा करें।',
    affirmationEn: 'I welcome steady and useful change.',
    affirmationHi: 'मैं स्थिर और उपयोगी बदलाव का स्वागत करता/करती हूं।',
    avoidEn: 'Holding on only because something feels familiar',
    avoidHi: 'सिर्फ पुरानी आदत के कारण किसी बात को पकड़े रखना',
  },
  gemini: {
    actionEn: 'Spend five quiet minutes writing your three most important tasks.',
    actionHi: 'पांच मिनट शांति से बैठकर अपने तीन सबसे जरूरी काम लिखें।',
    affirmationEn: 'My words are clear, calm and useful.',
    affirmationHi: 'मेरे शब्द स्पष्ट, शांत और उपयोगी हैं।',
    avoidEn: 'Sharing information before checking it',
    avoidHi: 'बिना जांचे कोई जानकारी साझा करना',
  },
  cancer: {
    actionEn: 'Express gratitude to a parent, elder, caregiver or someone who supports you.',
    actionHi: 'माता-पिता, बुजुर्ग, देखभाल करने वाले या सहयोग देने वाले व्यक्ति को धन्यवाद दें।',
    affirmationEn: 'I care for others without ignoring my own boundaries.',
    affirmationHi: 'मैं अपनी सीमाओं का ध्यान रखते हुए दूसरों की परवाह करता/करती हूं।',
    avoidEn: 'Taking a neutral comment personally',
    avoidHi: 'सामान्य बात को निजी रूप से लेना',
  },
  leo: {
    actionEn: 'Help one person quietly without expecting attention or praise.',
    actionHi: 'प्रशंसा या ध्यान की उम्मीद किए बिना चुपचाप किसी एक व्यक्ति की मदद करें।',
    affirmationEn: 'My confidence makes space for others.',
    affirmationHi: 'मेरा आत्मविश्वास दूसरों को भी जगह देता है।',
    avoidEn: 'Turning disagreement into a contest',
    avoidHi: 'असहमति को मुकाबला बना देना',
  },
  virgo: {
    actionEn: 'Clean and organise one small area, then stop instead of chasing perfection.',
    actionHi: 'एक छोटी जगह साफ और व्यवस्थित करें, फिर पूर्णता के पीछे भागने के बजाय रुक जाएं।',
    affirmationEn: 'Useful progress is enough for today.',
    affirmationHi: 'आज के लिए उपयोगी प्रगति पर्याप्त है।',
    avoidEn: 'Over-analysing a minor mistake',
    avoidHi: 'छोटी गलती का जरूरत से ज्यादा विश्लेषण करना',
  },
  libra: {
    actionEn: 'Resolve one small misunderstanding with a polite and direct message.',
    actionHi: 'विनम्र और सीधी बातचीत से एक छोटी गलतफहमी दूर करें।',
    affirmationEn: 'I can be kind and still make a clear decision.',
    affirmationHi: 'मैं दयालु रहते हुए भी स्पष्ट निर्णय ले सकता/सकती हूं।',
    avoidEn: 'Agreeing only to avoid discomfort',
    avoidHi: 'सिर्फ असहजता से बचने के लिए सहमत होना',
  },
  scorpio: {
    actionEn: 'Release one old resentment through journaling, prayer or a conscious decision not to repeat it today.',
    actionHi: 'लिखकर, प्रार्थना करके या आज उसे न दोहराने का निर्णय लेकर एक पुरानी नाराजगी छोड़ें।',
    affirmationEn: 'I protect my energy without carrying old anger.',
    affirmationHi: 'मैं पुराना गुस्सा ढोए बिना अपनी ऊर्जा की रक्षा करता/करती हूं।',
    avoidEn: 'Testing someone instead of communicating',
    avoidHi: 'बात करने के बजाय किसी को परखना',
  },
  sagittarius: {
    actionEn: 'Share one useful idea, lesson or resource with someone who can benefit from it.',
    actionHi: 'किसी जरूरतमंद व्यक्ति के साथ एक उपयोगी विचार, सीख या संसाधन साझा करें।',
    affirmationEn: 'My freedom grows with responsibility.',
    affirmationHi: 'मेरी स्वतंत्रता जिम्मेदारी के साथ बढ़ती है।',
    avoidEn: 'Making a promise you may not keep',
    avoidHi: 'ऐसा वादा करना जिसे पूरा करना मुश्किल हो',
  },
  capricorn: {
    actionEn: 'Complete one delayed responsibility and respectfully help an elder or worker if possible.',
    actionHi: 'एक रुकी हुई जिम्मेदारी पूरी करें और संभव हो तो किसी बुजुर्ग या कामगार की सम्मानपूर्वक मदद करें।',
    affirmationEn: 'I build progress without denying myself rest.',
    affirmationHi: 'मैं आराम को नजरअंदाज किए बिना प्रगति बनाता/बनाती हूं।',
    avoidEn: 'Treating rest as laziness',
    avoidHi: 'आराम को आलस मानना',
  },
  aquarius: {
    actionEn: 'Conserve water or electricity today and do one small act that benefits the wider community.',
    actionHi: 'आज पानी या बिजली बचाएं और समाज के लिए एक छोटा उपयोगी काम करें।',
    affirmationEn: 'My ideas become valuable through consistent action.',
    affirmationHi: 'मेरे विचार लगातार काम करने से मूल्यवान बनते हैं।',
    avoidEn: 'Withdrawing without explaining what you need',
    avoidHi: 'अपनी जरूरत बताए बिना दूर हो जाना',
  },
  pisces: {
    actionEn: 'Spend a few quiet minutes in your preferred prayer or meditation, then do one practical act of kindness.',
    actionHi: 'कुछ मिनट अपनी पसंद की प्रार्थना या ध्यान करें, फिर दयालुता का एक व्यावहारिक काम करें।',
    affirmationEn: 'I combine compassion with clear boundaries.',
    affirmationHi: 'मैं करुणा को स्पष्ट सीमाओं के साथ जोड़ता/जोड़ती हूं।',
    avoidEn: 'Escaping a decision that needs a practical answer',
    avoidHi: 'व्यावहारिक जवाब मांगने वाले निर्णय से बचना',
  },
};

const rotatingPractices = {
  en: [
    'Begin the day with two minutes of your preferred prayer, meditation or silent gratitude.',
    'Offer clean drinking water or a simple meal to someone in need, when practical.',
    'Keep your entrance or work desk clean and remove one unnecessary item.',
    'Speak one sincere sentence of appreciation to someone today.',
    'Set aside a small amount of time to help without expecting anything in return.',
    'Before a major response, count slowly to eleven and check your tone.',
    'End the day by writing one thing you learned and one thing you appreciate.',
  ],
  hi: [
    'दिन की शुरुआत दो मिनट अपनी पसंद की प्रार्थना, ध्यान या शांत कृतज्ञता से करें।',
    'व्यावहारिक रूप से संभव हो तो किसी जरूरतमंद को साफ पानी या साधारण भोजन दें।',
    'घर के प्रवेश स्थान या काम की मेज को साफ रखें और एक अनावश्यक वस्तु हटाएं।',
    'आज किसी एक व्यक्ति की सच्ची प्रशंसा करें।',
    'बिना बदले की उम्मीद के किसी की मदद के लिए थोड़ा समय निकालें।',
    'किसी बड़े जवाब से पहले धीरे-धीरे ग्यारह तक गिनें और अपने लहजे की जांच करें।',
    'दिन के अंत में एक सीख और एक आभार की बात लिखें।',
  ],
} as const;

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function pick<T>(values: readonly T[], seed: number, offset: number): T {
  return values[(seed + offset * 17) % values.length];
}

export function createDailyHoroscope(
  profile: BirthProfile,
  language: Language,
  date = new Date(),
): DailyHoroscope {
  const guide = createPersonalityGuide(profile, language);
  const dateKey = localDateKey(date);
  const seed = hash(`${dateKey}|${profile.dateOfBirth}|${profile.name.toLowerCase()}`);
  const selected = content[language];
  const guidanceZodiac = getGuidanceZodiacKey(profile);
  const zodiacKey = guidanceZodiac.key;
  const remedy = zodiacRemedies[zodiacKey];
  const numberPool = guide.luckyNumbers.length ? guide.luckyNumbers : [1, 3, 5, 7, 9];

  return {
    dateLabel: new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date),
    zodiacSign: getZodiacName(zodiacKey, language),
    zodiacBasis:
      guidanceZodiac.basis === 'moon'
        ? language === 'hi'
          ? 'चंद्र राशि पर आधारित'
          : 'Based on Moon Rashi'
        : language === 'hi'
          ? 'जन्म समय न होने के कारण सूर्य राशि पर आधारित'
          : 'Based on Sun sign because birth time is unavailable',
    overview: pick(selected.overview, seed, 0),
    career: pick(selected.career, seed, 1),
    relationship: pick(selected.relationship, seed, 2),
    wellbeing: pick(selected.wellbeing, seed, 3),
    focusAction: pick(selected.focus, seed, 4),
    remedySteps: [
      language === 'hi' ? remedy.actionHi : remedy.actionEn,
      pick(rotatingPractices[language], seed, 7),
    ],
    affirmation: language === 'hi' ? remedy.affirmationHi : remedy.affirmationEn,
    avoidToday: language === 'hi' ? remedy.avoidHi : remedy.avoidEn,
    luckyNumber: numberPool[seed % numberPool.length],
    luckyColor: pick(selected.colors, seed, 5),
    favourableTime: pick(selected.times, seed, 6),
    disclaimer:
      language === 'hi'
        ? `दैनिक गाइड आपकी ${guidanceZodiac.basis === 'moon' ? 'चंद्र राशि' : 'सूर्य राशि'}, अंक और आज की तारीख से तैयार की गई है। लाइव ग्रह गोचर सेवा अभी कनेक्ट नहीं है। इसे निश्चित भविष्यवाणी न मानें।`
        : `This daily guide uses your ${guidanceZodiac.basis === 'moon' ? 'Moon Rashi' : 'Sun sign'}, numerology and today’s date. Live planetary-transit calculations are not connected yet, so do not treat it as a guaranteed forecast.`,
  };
}
