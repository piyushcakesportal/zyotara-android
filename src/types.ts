export type Language = 'en' | 'hi';

export type Screen =
  | 'language'
  | 'welcome'
  | 'birthProfile'
  | 'home'
  | 'dailyHoroscope'
  | 'question'
  | 'review'
  | 'generating'
  | 'result'
  | 'history'
  | 'settings';

export type BirthTimePrecision = 'exact' | 'approximate' | 'unknown';
export type Category = 'career' | 'relationship';
export type Feedback = 'relevant' | 'not_relevant';

export interface BirthProfile {
  name: string;
  dateOfBirth: string;
  birthTime: string;
  birthTimePrecision: BirthTimePrecision;
  birthPlace: string;
}

export interface QuestionDraft {
  category: Category;
  questionType: string;
  questionLabel: string;
  context: string;
}

export interface PredictionRequest {
  language: Language;
  profile: BirthProfile;
  question: QuestionDraft;
}

export interface PredictionSections {
  shortAnswer: string;
  currentPhase: string;
  favourablePeriod: string;
  cautionPeriod: string;
  whyThisMatters: string;
  practicalActions: string[];
  traditionalGuidance: string;
  disclaimer: string;
}

export interface PersonalityGuide {
  zodiacSign: string;
  zodiacBasis: string;
  lifePathNumber: number;
  nameNumber?: number;
  personalitySummary: string;
  strengths: string[];
  growthAreas: string[];
  luckyNumbers: number[];
  luckyDates: number[];
  luckyDays: string[];
  luckyMonths: string[];
  calculationNote: string;
}

export interface DailyHoroscope {
  dateLabel: string;
  zodiacSign: string;
  overview: string;
  career: string;
  relationship: string;
  wellbeing: string;
  focusAction: string;
  remedySteps: string[];
  affirmation: string;
  avoidToday: string;
  luckyNumber: number;
  luckyColor: string;
  favourableTime: string;
  disclaimer: string;
}

export interface Prediction {
  id: string;
  createdAt: string;
  language: Language;
  category: Category;
  questionType: string;
  questionLabel: string;
  context: string;
  birthDataPrecision: BirthTimePrecision;
  sections: PredictionSections;
  source: 'demo' | 'live';
  feedback?: Feedback;
}

export interface UsageState {
  day: string;
  count: number;
}

export interface AppState {
  language: Language;
  onboardingComplete: boolean;
  profile?: BirthProfile;
  history: Prediction[];
  usage: UsageState;
}
