import { createPersonalityGuide } from './personalityGuide';
import { BirthProfile, DailyHoroscope, Language } from '../types';

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
  const numberPool = guide.luckyNumbers.length ? guide.luckyNumbers : [1, 3, 5, 7, 9];

  return {
    dateLabel: new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date),
    zodiacSign: guide.zodiacSign,
    overview: pick(selected.overview, seed, 0),
    career: pick(selected.career, seed, 1),
    relationship: pick(selected.relationship, seed, 2),
    wellbeing: pick(selected.wellbeing, seed, 3),
    focusAction: pick(selected.focus, seed, 4),
    luckyNumber: numberPool[seed % numberPool.length],
    luckyColor: pick(selected.colors, seed, 5),
    favourableTime: pick(selected.times, seed, 6),
    disclaimer:
      language === 'hi'
        ? 'दैनिक गाइड आपकी सूर्य राशि, अंक और आज की तारीख से तैयार की गई है। लाइव ग्रह गोचर सेवा अभी कनेक्ट नहीं है। इसे निश्चित भविष्यवाणी न मानें।'
        : 'This daily guide uses your Sun sign, numerology and today’s date. Live planetary-transit calculations are not connected yet, so do not treat it as a guaranteed forecast.',
  };
}
