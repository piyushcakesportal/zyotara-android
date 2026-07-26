import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  AppHeader,
  Card,
  Field,
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
  SectionTitle,
  sharedStyles,
} from '../components/UI';
import { questionOptions, t } from '../i18n';
import { colors, radius } from '../theme';
import {
  AppState,
  Category,
  Language,
  Prediction,
  QuestionDraft,
} from '../types';

export function HomeScreen({
  language,
  state,
  onCategory,
  onHistory,
  onSettings,
  onOpenPrediction,
}: {
  language: Language;
  state: AppState;
  onCategory: (category: Category) => void;
  onHistory: () => void;
  onSettings: () => void;
  onOpenPrediction: (prediction: Prediction) => void;
}) {
  const remaining = Math.max(0, 2 - state.usage.count);
  const recent = state.history[0];

  return (
    <ScreenContainer>
      <AppHeader
        title={t(language, 'appName')}
        rightLabel={t(language, 'settings')}
        onRight={onSettings}
      />
      <Text style={sharedStyles.eyebrow}>{t(language, 'hello')}, {state.profile?.name}</Text>
      <Text style={sharedStyles.title}>{t(language, 'homeTitle')}</Text>

      <View style={styles.remaining}>
        <Ionicons name="sparkles" size={18} color={colors.accent} />
        <Text style={styles.remainingValue}>{remaining}</Text>
        <Text style={styles.remainingText}>{t(language, 'remaining')}</Text>
      </View>

      <View style={styles.categoryGrid}>
        <Pressable onPress={() => onCategory('career')} style={styles.categoryCard}>
          <View style={styles.categoryIcon}>
            <Ionicons name="briefcase-outline" size={30} color={colors.primary} />
          </View>
          <Text style={styles.categoryTitle}>{t(language, 'career')}</Text>
          <Text style={styles.categoryBody}>{t(language, 'careerBody')}</Text>
          <Ionicons name="arrow-forward-circle" size={25} color={colors.primary} />
        </Pressable>

        <Pressable onPress={() => onCategory('relationship')} style={styles.categoryCard}>
          <View style={[styles.categoryIcon, styles.relationshipIcon]}>
            <Ionicons name="heart-outline" size={30} color="#A63F70" />
          </View>
          <Text style={styles.categoryTitle}>{t(language, 'relationship')}</Text>
          <Text style={styles.categoryBody}>{t(language, 'relationshipBody')}</Text>
          <Ionicons name="arrow-forward-circle" size={25} color="#A63F70" />
        </Pressable>
      </View>

      <View style={styles.sectionGap}>
        <SectionTitle>{t(language, 'recentReading')}</SectionTitle>
        {recent ? (
          <Pressable onPress={() => onOpenPrediction(recent)}>
            <Card>
              <View style={styles.recentTop}>
                <Text style={styles.recentCategory}>
                  {recent.category === 'career' ? t(language, 'career') : t(language, 'relationship')}
                </Text>
                <Text style={styles.recentDate}>
                  {new Date(recent.createdAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}
                </Text>
              </View>
              <Text style={styles.recentQuestion}>{recent.questionLabel}</Text>
              <Text style={styles.recentAnswer} numberOfLines={3}>
                {recent.sections.shortAnswer}
              </Text>
            </Card>
          </Pressable>
        ) : (
          <Card>
            <Text style={styles.emptyText}>{t(language, 'noHistory')}</Text>
          </Card>
        )}
      </View>

      <View style={styles.historyButton}>
        <SecondaryButton
          label={t(language, 'viewHistory')}
          icon="time-outline"
          onPress={onHistory}
        />
      </View>
    </ScreenContainer>
  );
}

export function QuestionScreen({
  language,
  category,
  existing,
  onBack,
  onContinue,
}: {
  language: Language;
  category: Category;
  existing?: QuestionDraft;
  onBack: () => void;
  onContinue: (question: QuestionDraft) => void;
}) {
  const options = questionOptions[category];
  const [selected, setSelected] = useState(existing?.questionType ?? options[0].id);
  const [context, setContext] = useState(existing?.context ?? '');
  const selectedOption = options.find((option) => option.id === selected) ?? options[0];

  return (
    <ScreenContainer>
      <AppHeader title={t(language, 'askQuestion')} onBack={onBack} />
      <Text style={sharedStyles.eyebrow}>
        {category === 'career' ? t(language, 'career') : t(language, 'relationship')}
      </Text>
      <Text style={sharedStyles.title}>{t(language, 'selectQuestion')}</Text>

      <View style={styles.optionList}>
        {options.map((option) => {
          const isSelected = option.id === selected;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setSelected(option.id)}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected ? <View style={styles.radioDot} /> : null}
              </View>
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option[language]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.context}>
        <Field
          label={t(language, 'addContext')}
          placeholder={t(language, 'contextPlaceholder')}
          multiline
          maxLength={500}
          value={context}
          onChangeText={setContext}
        />
        <Text style={styles.characterCount}>{context.length}/500</Text>
      </View>

      <View style={styles.bottomPush}>
        <PrimaryButton
          label={t(language, 'continue')}
          onPress={() =>
            onContinue({
              category,
              questionType: selectedOption.id,
              questionLabel: selectedOption[language],
              context: context.trim(),
            })
          }
        />
      </View>
    </ScreenContainer>
  );
}

export function ReviewScreen({
  language,
  profile,
  question,
  onBack,
  onEditProfile,
  onGenerate,
}: {
  language: Language;
  profile: AppState['profile'];
  question: QuestionDraft;
  onBack: () => void;
  onEditProfile: () => void;
  onGenerate: () => void;
}) {
  return (
    <ScreenContainer>
      <AppHeader title={t(language, 'reviewTitle')} onBack={onBack} />
      <Text style={sharedStyles.title}>{t(language, 'reviewTitle')}</Text>
      <Text style={sharedStyles.body}>{t(language, 'reviewBody')}</Text>

      <View style={styles.reviewList}>
        <Card>
          <View style={styles.reviewHeading}>
            <Text style={styles.reviewTitle}>{t(language, 'birthDetails')}</Text>
            <Pressable onPress={onEditProfile}>
              <Text style={styles.editText}>{t(language, 'edit')}</Text>
            </Pressable>
          </View>
          <Text style={styles.reviewValue}>{profile?.dateOfBirth}</Text>
          <Text style={styles.reviewValue}>
            {profile?.birthTimePrecision === 'unknown'
              ? t(language, 'unknown')
              : `${profile?.birthTime} · ${
                  profile?.birthTimePrecision === 'exact'
                    ? t(language, 'exact')
                    : t(language, 'approximate')
                }`}
          </Text>
          <Text style={styles.reviewValue}>{profile?.birthPlace}</Text>
        </Card>

        <Card>
          <Text style={styles.reviewTitle}>{t(language, 'question')}</Text>
          <Text style={styles.questionReview}>{question.questionLabel}</Text>
          {question.context ? <Text style={styles.contextReview}>{question.context}</Text> : null}
        </Card>
      </View>

      <View style={styles.bottomPush}>
        <PrimaryButton label={t(language, 'generate')} onPress={onGenerate} icon="sparkles" />
      </View>
    </ScreenContainer>
  );
}

export function GeneratingScreen({
  language,
  onGenerate,
}: {
  language: Language;
  onGenerate: () => void;
}) {
  const messages = [
    t(language, 'generating1'),
    t(language, 'generating2'),
    t(language, 'generating3'),
    t(language, 'generating4'),
  ];
  const [step, setStep] = useState(0);
  const called = useRef(false);

  useEffect(() => {
    if (!called.current) {
      called.current = true;
      onGenerate();
    }
    const timer = setInterval(() => {
      setStep((current) => Math.min(messages.length - 1, current + 1));
    }, 650);
    return () => clearInterval(timer);
  }, [messages.length, onGenerate]);

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.generating}>
        <View style={styles.generatingOrbit}>
          <Ionicons name="sparkles" size={54} color={colors.accent} />
        </View>
        <Text style={styles.generatingTitle}>{messages[step]}</Text>
        <View style={styles.steps}>
          {messages.map((message, index) => (
            <View key={message} style={styles.stepRow}>
              <Ionicons
                name={index <= step ? 'checkmark-circle' : 'ellipse-outline'}
                size={21}
                color={index <= step ? colors.primary : colors.border}
              />
              <Text style={[styles.stepText, index <= step && styles.stepTextActive]}>{message}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  remaining: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: '#FFF8E8',
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 18,
  },
  remainingValue: { color: colors.text, fontWeight: '800', fontSize: 16 },
  remainingText: { color: colors.textMuted, fontSize: 13 },
  categoryGrid: { flexDirection: 'row', gap: 12, marginTop: 20 },
  categoryCard: {
    flex: 1,
    minHeight: 220,
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  categoryIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  relationshipIcon: { backgroundColor: '#FBE6F0' },
  categoryTitle: { color: colors.text, fontSize: 19, fontWeight: '800', marginBottom: 7 },
  categoryBody: { flex: 1, color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  sectionGap: { marginTop: 28 },
  recentTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  recentCategory: { color: colors.primary, fontWeight: '800', fontSize: 13 },
  recentDate: { color: colors.textMuted, fontSize: 12 },
  recentQuestion: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: 12 },
  recentAnswer: { color: colors.textMuted, fontSize: 13, lineHeight: 20, marginTop: 8 },
  emptyText: { color: colors.textMuted, textAlign: 'center', lineHeight: 21 },
  historyButton: { marginTop: 14 },
  optionList: { gap: 10, marginTop: 22 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 15,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  optionText: { flex: 1, color: colors.text, fontSize: 14, lineHeight: 20 },
  optionTextSelected: { fontWeight: '700' },
  context: { marginTop: 22 },
  characterCount: { color: colors.textMuted, fontSize: 11, textAlign: 'right', marginTop: 5 },
  bottomPush: { marginTop: 'auto', paddingTop: 24 },
  reviewList: { gap: 14, marginTop: 24 },
  reviewHeading: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  reviewTitle: { color: colors.text, fontSize: 15, fontWeight: '800' },
  editText: { color: colors.primary, fontSize: 13, fontWeight: '800' },
  reviewValue: { color: colors.textMuted, fontSize: 14, lineHeight: 21 },
  questionReview: { color: colors.text, fontSize: 16, fontWeight: '700', lineHeight: 23, marginTop: 12 },
  contextReview: { color: colors.textMuted, fontSize: 13, lineHeight: 20, marginTop: 8 },
  generating: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  generatingOrbit: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  generatingTitle: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '800',
    textAlign: 'center',
    minHeight: 62,
  },
  steps: { alignSelf: 'stretch', gap: 13, marginTop: 22 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepText: { flex: 1, color: colors.textMuted, fontSize: 13 },
  stepTextActive: { color: colors.text, fontWeight: '700' },
});

