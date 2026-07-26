import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import { AppHeader, Card, ScreenContainer, sharedStyles } from '../components/UI';
import { t } from '../i18n';
import { createDailyHoroscope } from '../services/dailyHoroscope';
import { colors, radius } from '../theme';
import { BirthProfile, Language } from '../types';

export function DailyHoroscopeScreen({
  language,
  profile,
  onBack,
}: {
  language: Language;
  profile: BirthProfile;
  onBack: () => void;
}) {
  const horoscope = createDailyHoroscope(profile, language);

  async function share() {
    const message = [
      t(language, 'dailyHoroscope'),
      horoscope.dateLabel,
      `${horoscope.zodiacBasis}: ${horoscope.zodiacSign}`,
      '',
      horoscope.overview,
      '',
      `${t(language, 'career')}: ${horoscope.career}`,
      `${t(language, 'relationship')}: ${horoscope.relationship}`,
      `${t(language, 'wellbeing')}: ${horoscope.wellbeing}`,
      '',
      `${t(language, 'todayFocus')}: ${horoscope.focusAction}`,
      '',
      t(language, 'simpleUpay'),
      ...horoscope.remedySteps.map((step, index) => `${index + 1}. ${step}`),
      `${t(language, 'affirmation')}: ${horoscope.affirmation}`,
      `${t(language, 'avoidToday')}: ${horoscope.avoidToday}`,
      `${t(language, 'luckyNumber')}: ${horoscope.luckyNumber}`,
      `${t(language, 'luckyColor')}: ${horoscope.luckyColor}`,
      `${t(language, 'favourableTime')}: ${horoscope.favourableTime}`,
      '',
      horoscope.disclaimer,
    ].join('\n');
    await Share.share({ message, title: t(language, 'dailyHoroscope') });
  }

  const sections = [
    {
      title: t(language, 'career'),
      text: horoscope.career,
      icon: 'briefcase-outline' as const,
      color: colors.primary,
      background: colors.primarySoft,
    },
    {
      title: t(language, 'relationship'),
      text: horoscope.relationship,
      icon: 'heart-outline' as const,
      color: '#F08BC0',
      background: colors.roseSoft,
    },
    {
      title: t(language, 'wellbeing'),
      text: horoscope.wellbeing,
      icon: 'leaf-outline' as const,
      color: colors.success,
      background: colors.greenSoft,
    },
  ];

  return (
    <ScreenContainer>
      <AppHeader
        title={t(language, 'dailyHoroscope')}
        onBack={onBack}
        rightLabel={language === 'hi' ? 'शेयर' : 'Share'}
        onRight={share}
      />

      <Text style={sharedStyles.eyebrow}>{horoscope.dateLabel}</Text>
      <Text style={sharedStyles.title}>{t(language, 'todayGuidance')}</Text>

      <View style={styles.zodiacLine}>
        <View style={styles.zodiacBadge}>
          <Ionicons name="moon-outline" size={18} color={colors.accent} />
          <View>
            <Text style={styles.zodiacText}>{horoscope.zodiacSign}</Text>
            <Text style={styles.zodiacBasis}>{horoscope.zodiacBasis}</Text>
          </View>
        </View>
        <Text style={styles.freeText}>{t(language, 'doesNotUseQuestion')}</Text>
      </View>

      <Card style={styles.overviewCard}>
        <View style={styles.overviewIcon}>
          <Ionicons name="sparkles" size={24} color={colors.accent} />
        </View>
        <Text style={styles.overviewTitle}>{t(language, 'todayOverview')}</Text>
        <Text style={styles.overviewText}>{horoscope.overview}</Text>
      </Card>

      <View style={styles.sectionList}>
        {sections.map((section) => (
          <Card key={section.title}>
            <View style={styles.sectionHeading}>
              <View style={[styles.sectionIcon, { backgroundColor: section.background }]}>
                <Ionicons name={section.icon} size={21} color={section.color} />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.sectionText}>{section.text}</Text>
          </Card>
        ))}
      </View>

      <Card style={styles.focusCard}>
        <Text style={styles.focusLabel}>{t(language, 'todayFocus')}</Text>
        <Text style={styles.focusText}>{horoscope.focusAction}</Text>
      </Card>

      <Card style={styles.upayCard}>
        <View style={styles.upayHeading}>
          <View style={styles.upayIcon}>
            <Ionicons name="hand-left-outline" size={22} color={colors.success} />
          </View>
          <View style={styles.upayHeadingCopy}>
            <Text style={styles.upayTitle}>{t(language, 'simpleUpay')}</Text>
            <Text style={styles.upayOptional}>{t(language, 'upayOptional')}</Text>
          </View>
        </View>

        {horoscope.remedySteps.map((step, index) => (
          <View key={step} style={styles.upayStep}>
            <View style={styles.upayNumber}>
              <Text style={styles.upayNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.upayStepText}>{step}</Text>
          </View>
        ))}

        <View style={styles.affirmationBox}>
          <Text style={styles.affirmationLabel}>{t(language, 'affirmation')}</Text>
          <Text style={styles.affirmationText}>“{horoscope.affirmation}”</Text>
        </View>

        <View style={styles.avoidRow}>
          <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
          <Text style={styles.avoidText}>
            <Text style={styles.avoidLabel}>{t(language, 'avoidToday')}: </Text>
            {horoscope.avoidToday}
          </Text>
        </View>
      </Card>

      <View style={styles.luckyGrid}>
        <LuckyItem
          icon="keypad-outline"
          label={t(language, 'luckyNumber')}
          value={String(horoscope.luckyNumber)}
        />
        <LuckyItem
          icon="color-palette-outline"
          label={t(language, 'luckyColor')}
          value={horoscope.luckyColor}
        />
        <LuckyItem
          icon="time-outline"
          label={t(language, 'favourableTime')}
          value={horoscope.favourableTime}
          wide
        />
      </View>

      <Text style={styles.disclaimer}>{horoscope.disclaimer}</Text>
    </ScreenContainer>
  );
}

function LuckyItem({
  icon,
  label,
  value,
  wide,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <View style={[styles.luckyItem, wide && styles.luckyWide]}>
      <Ionicons name={icon} size={19} color={colors.primary} />
      <Text style={styles.luckyLabel}>{label}</Text>
      <Text style={styles.luckyValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  zodiacLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  zodiacBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.goldSoft,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radius.pill,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  zodiacText: { color: colors.text, fontSize: 13, fontWeight: '800' },
  zodiacBasis: { color: colors.textMuted, fontSize: 9, fontWeight: '600', marginTop: 2 },
  freeText: { color: colors.textMuted, fontSize: 11, flexShrink: 1 },
  overviewCard: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.goldBorder,
    marginTop: 18,
  },
  overviewIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewTitle: { color: colors.white, fontSize: 14, fontWeight: '800', marginTop: 14 },
  overviewText: { color: '#F4F0FF', fontSize: 17, lineHeight: 26, fontWeight: '600', marginTop: 8 },
  sectionList: { gap: 12, marginTop: 16 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  sectionText: { color: colors.textMuted, fontSize: 14, lineHeight: 22, marginTop: 12 },
  focusCard: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.goldBorder,
    marginTop: 16,
  },
  focusLabel: { color: colors.accent, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  focusText: { color: colors.text, fontSize: 17, lineHeight: 24, fontWeight: '800', marginTop: 7 },
  upayCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.greenBorder,
    backgroundColor: colors.greenSoft,
  },
  upayHeading: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  upayIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upayHeadingCopy: { flex: 1 },
  upayTitle: { color: colors.text, fontSize: 17, fontWeight: '800' },
  upayOptional: { color: colors.success, fontSize: 10, fontWeight: '700', marginTop: 3 },
  upayStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 14 },
  upayNumber: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upayNumberText: { color: colors.white, fontSize: 11, fontWeight: '900' },
  upayStepText: { flex: 1, color: colors.text, fontSize: 13, lineHeight: 20 },
  affirmationBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.medium,
    padding: 13,
    marginTop: 15,
  },
  affirmationLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '700' },
  affirmationText: { color: colors.primary, fontSize: 14, lineHeight: 21, fontWeight: '800', marginTop: 5 },
  avoidRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 13 },
  avoidText: { flex: 1, color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  avoidLabel: { color: colors.danger, fontWeight: '800' },
  luckyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  luckyItem: {
    width: '48%',
    minHeight: 112,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.medium,
    padding: 14,
  },
  luckyWide: { width: '100%', minHeight: 96 },
  luckyLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', marginTop: 8 },
  luckyValue: { color: colors.primary, fontSize: 17, lineHeight: 23, fontWeight: '900', marginTop: 4 },
  disclaimer: { color: colors.textMuted, fontSize: 10, lineHeight: 16, textAlign: 'center', marginTop: 18 },
});
