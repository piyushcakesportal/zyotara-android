import {
  BirthTimePrecision,
  Prediction,
  PredictionRequest,
  PredictionSections,
} from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function formatMonth(date: Date, language: 'en' | 'hi'): string {
  return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function precisionLabel(precision: BirthTimePrecision, language: 'en' | 'hi'): string {
  if (language === 'hi') {
    if (precision === 'exact') return 'सटीक';
    if (precision === 'approximate') return 'लगभग';
    return 'सीमित';
  }
  if (precision === 'exact') return 'Exact';
  if (precision === 'approximate') return 'Approximate';
  return 'Limited';
}

function demoSections(request: PredictionRequest): PredictionSections {
  const { language, profile, question } = request;
  const seed = [...profile.dateOfBirth, ...question.questionType].reduce(
    (sum, value) => sum + value.charCodeAt(0),
    0,
  );
  const startOffset = (seed % 4) + 2;
  const duration = (seed % 3) + 3;
  const now = new Date();
  const favourableStart = addMonths(now, startOffset);
  const favourableEnd = addMonths(favourableStart, duration);
  const cautionEnd = addMonths(now, Math.max(1, startOffset - 1));

  if (language === 'hi') {
    const isCareer = question.category === 'career';
    return {
      shortAnswer: isCareer
        ? 'डेमो संकेत बताता है कि तुरंत बड़ा निर्णय लेने के बजाय तैयारी और कौशल सुधार पर ध्यान देना बेहतर रहेगा। आगे का समय धीरे-धीरे अधिक सहायक दिखाया गया है।'
        : 'डेमो संकेत बताता है कि इस समय स्पष्ट बातचीत और भावनात्मक संतुलन जल्दबाजी से अधिक उपयोगी रहेगा। आगे स्थिरता का बेहतर अवसर दिखाया गया है।',
      currentPhase: isCareer
        ? 'यह चरण पुराने काम के तरीके की समीक्षा, कौशल मजबूत करने और सही अवसर पहचानने पर केंद्रित है।'
        : 'यह चरण अपेक्षाओं को स्पष्ट करने और रिश्ते में वास्तविक जरूरतों को समझने पर केंद्रित है।',
      favourablePeriod: `${formatMonth(favourableStart, 'hi')} से ${formatMonth(favourableEnd, 'hi')}`,
      cautionPeriod: `अभी से ${formatMonth(cautionEnd, 'hi')} तक जल्दबाजी वाले निर्णयों से बचें।`,
      whyThisMatters:
        'यह केवल डेमो सामग्री है। वास्तविक संस्करण में यहां दशा, अंतर्दशा, संबंधित भाव और मुख्य गोचर के संरचित कारण दिखाए जाएंगे।',
      practicalActions: isCareer
        ? ['एक मुख्य कौशल चुनकर साप्ताहिक योजना बनाएं।', 'बदलाव से पहले आर्थिक सुरक्षा तैयार करें।', 'हर सप्ताह उपयुक्त अवसरों के लिए आवेदन या संपर्क करें।']
        : ['अपनी जरूरत साफ लेकिन शांत भाषा में बताएं।', 'अनुमान के बजाय व्यवहार और तथ्य देखें।', 'बड़े निर्णय से पहले कुछ समय लगातार स्थिति को समझें।'],
      traditionalGuidance:
        'शांत मन के लिए रोज कुछ मिनट ध्यान या प्रार्थना कर सकते हैं। किसी महंगे रत्न या उपाय की जरूरत नहीं बताई जा रही है।',
      disclaimer: `डेमो उत्तर — जन्म विवरण सटीकता: ${precisionLabel(profile.birthTimePrecision, 'hi')}। ज्योतिष मार्गदर्शन है, गारंटी नहीं।`,
    };
  }

  const isCareer = question.category === 'career';
  return {
    shortAnswer: isCareer
      ? 'This demo suggests focusing on preparation and skill-building before making a major move. The following period is presented as gradually more supportive.'
      : 'This demo suggests that clear communication and emotional balance will be more useful than rushing. A more stable period is presented ahead.',
    currentPhase: isCareer
      ? 'This phase is framed around reviewing old work patterns, strengthening skills and identifying suitable opportunities.'
      : 'This phase is framed around clarifying expectations and understanding what you genuinely need from a relationship.',
    favourablePeriod: `${formatMonth(favourableStart, 'en')} to ${formatMonth(favourableEnd, 'en')}`,
    cautionPeriod: `Avoid rushed decisions between now and ${formatMonth(cautionEnd, 'en')}.`,
    whyThisMatters:
      'This is demo content. The live version will show structured reasons from dasha, antardasha, relevant houses and major transits.',
    practicalActions: isCareer
      ? ['Choose one high-value skill and follow a weekly plan.', 'Build a financial buffer before changing direction.', 'Apply or network for suitable opportunities every week.']
      : ['Communicate your needs calmly and directly.', 'Judge patterns and actions instead of assumptions.', 'Observe the situation consistently before a major decision.'],
    traditionalGuidance:
      'A few minutes of daily meditation or prayer may help you stay calm. No expensive gemstone or remedy is being recommended.',
    disclaimer: `Demo reading — birth-data precision: ${precisionLabel(profile.birthTimePrecision, 'en')}. Astrology offers guidance, not guaranteed outcomes.`,
  };
}

function validateLivePrediction(value: unknown): Prediction {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid prediction response');
  }
  const prediction = value as Prediction;
  if (!prediction.id || !prediction.sections?.shortAnswer || !prediction.sections?.practicalActions) {
    throw new Error('Incomplete prediction response');
  }
  return { ...prediction, source: 'live' };
}

export async function generatePrediction(request: PredictionRequest): Promise<Prediction> {
  if (API_BASE_URL) {
    const response = await fetch(`${API_BASE_URL}/v1/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Prediction service returned ${response.status}`);
    }

    return validateLivePrediction(await response.json());
  }

  await new Promise((resolve) => setTimeout(resolve, 2600));
  return {
    id: `demo-${Date.now()}`,
    createdAt: new Date().toISOString(),
    language: request.language,
    category: request.question.category,
    questionType: request.question.questionType,
    questionLabel: request.question.questionLabel,
    context: request.question.context,
    birthDataPrecision: request.profile.birthTimePrecision,
    sections: demoSections(request),
    source: 'demo',
  };
}

