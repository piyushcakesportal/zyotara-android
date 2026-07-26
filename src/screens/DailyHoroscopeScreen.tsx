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
      `${t(language, 'zodiacSign')}: ${horoscope.zodiacSign}`,
      '',
      horoscope.overview,
      '',
      `${t(language, 'career')}: ${horoscope.career}`,
      `${t(language, 'relationship')}: ${horoscope.relationship}`,
      `${t(language, 'wellbeing')}: ${horoscope.wellbeing}`,
      '',
      `${t(language, 'todayFocus')}: ${horoscope.focusAction}`,
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
      color: '#A63F70',
      background: '#FBE6F0',
    },
    {
      title: t(language, 'wellbeing'),
      text: horoscope.wellbeing,
      icon: 'leaf-outline' as const,
      color: colors.success,
      background: '#E7F6EF',
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
          <Ionicons name="sunny-outline" size={18} color={colors.accent} />
          <Text style={styles.zodiacText}>{horoscope.zodiacSign}</Text>
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
    backgroundColor: '#FFF8E8',
    borderRadius: radius.pill,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  zodiacText: { color: colors.text, fontSize: 13, fontWeight: '800' },
  freeText: { color: colors.textMuted, fontSize: 11, flexShrink: 1 },
  overviewCard: {
    backgroundColor: colors.primary,
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
  focusCard: { backgroundColor: '#FFF8E8', marginTop: 16 },
  focusLabel: { color: colors.accent, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  focusText: { color: colors.text, fontSize: 17, lineHeight: 24, fontWeight: '800', marginTop: 7 },
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
