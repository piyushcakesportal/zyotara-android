import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import {
  AppHeader,
  Card,
  PrimaryButton,
  ScreenContainer,
  sharedStyles,
} from '../components/UI';
import { t } from '../i18n';
import { createVedicProfile } from '../services/vedicProfile';
import { colors, radius } from '../theme';
import { BirthProfile, Language } from '../types';

export function AstroProfileScreen({
  language,
  profile,
  onBack,
  onEditProfile,
}: {
  language: Language;
  profile: BirthProfile;
  onBack: () => void;
  onEditProfile: () => void;
}) {
  const vedic = createVedicProfile(profile, language);

  async function shareProfile() {
    const message = [
      t(language, 'birthBlueprint'),
      '',
      `${t(language, 'moonRashi')}: ${vedic.moonRashi}`,
      `${t(language, 'nakshatra')}: ${vedic.nakshatra}`,
      `${t(language, 'pada')}: ${vedic.nakshatraPada}`,
      `${t(language, 'rulingPlanet')}: ${vedic.rulingPlanet}`,
      `${t(language, 'sunSign')}: ${vedic.sunSign}`,
      '',
      vedic.precisionNote,
      '',
      t(language, 'sharedFromDashaVaani'),
    ].join('\n');
    await Share.share({ message, title: t(language, 'birthBlueprint') });
  }

  return (
    <ScreenContainer>
      <AppHeader
        title={t(language, 'birthBlueprint')}
        onBack={onBack}
        rightLabel={
          vedic.status === 'calculated'
            ? language === 'hi'
              ? 'शेयर'
              : 'Share'
            : undefined
        }
        onRight={vedic.status === 'calculated' ? shareProfile : undefined}
      />

      <Text style={sharedStyles.eyebrow}>{profile.name}</Text>
      <Text style={sharedStyles.title}>{t(language, 'yourCosmicIdentity')}</Text>
      <Text style={sharedStyles.body}>{t(language, 'cosmicIdentityBody')}</Text>

      {vedic.status === 'calculated' ? (
        <>
          <LinearGradient
            colors={[colors.primaryDark, '#4A237C', '#9A5A28']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroGlow} />
            <Text style={styles.symbol}>{vedic.moonRashiSymbol}</Text>
            <Text style={styles.heroLabel}>{t(language, 'moonRashi')}</Text>
            <Text style={styles.rashi}>{vedic.moonRashi}</Text>
            <View style={styles.heroDivider} />
            <View style={styles.heroStats}>
              <HeroStat label={t(language, 'nakshatra')} value={vedic.nakshatra ?? ''} />
              <HeroStat label={t(language, 'pada')} value={String(vedic.nakshatraPada)} />
              <HeroStat label={t(language, 'rulingPlanet')} value={vedic.rulingPlanet ?? ''} />
            </View>
          </LinearGradient>

          <View style={styles.factGrid}>
            <FactCard
              icon="sunny-outline"
              label={t(language, 'sunSign')}
              value={vedic.sunSign}
            />
            <FactCard
              icon="navigate-outline"
              label={t(language, 'moonDegree')}
              value={`${vedic.siderealMoonLongitude?.toFixed(2)}°`}
            />
          </View>
        </>
      ) : (
        <Card style={styles.limitedCard}>
          <View style={styles.limitedIcon}>
            <Ionicons name="moon-outline" size={30} color={colors.accent} />
          </View>
          <Text style={styles.limitedTitle}>{t(language, 'rashiNeedsTime')}</Text>
          <Text style={styles.limitedBody}>{vedic.calculationExplanation}</Text>
          <View style={styles.sunFallback}>
            <Text style={styles.sunFallbackLabel}>{t(language, 'sunSign')}</Text>
            <Text style={styles.sunFallbackValue}>{vedic.sunSign}</Text>
          </View>
          <PrimaryButton
            label={t(language, 'completeBirthDetails')}
            onPress={onEditProfile}
            icon="create-outline"
            style={styles.editButton}
          />
        </Card>
      )}

      <Card style={styles.explanationCard}>
        <View style={styles.cardHeading}>
          <View style={styles.headingIcon}>
            <Ionicons name="calculator-outline" size={20} color={colors.accent} />
          </View>
          <Text style={styles.cardTitle}>{t(language, 'howCalculated')}</Text>
        </View>
        <Text style={styles.explanation}>{vedic.calculationExplanation}</Text>

        <View style={styles.process}>
          {[
            t(language, 'calculationStep1'),
            t(language, 'calculationStep2'),
            t(language, 'calculationStep3'),
          ].map((step, index) => (
            <View key={step} style={styles.processRow}>
              <View style={styles.processNumber}>
                <Text style={styles.processNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.processText}>{step}</Text>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.precisionBox}>
        <Ionicons name="shield-checkmark-outline" size={20} color={colors.success} />
        <Text style={styles.precisionText}>{vedic.precisionNote}</Text>
      </View>

      <Text style={styles.methodNote}>{t(language, 'vedicMethodNote')}</Text>
    </ScreenContainer>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.heroStat}>
      <Text style={styles.heroStatLabel}>{label}</Text>
      <Text style={styles.heroStatValue}>{value}</Text>
    </View>
  );
}

function FactCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <Card style={styles.factCard}>
      <Ionicons name={icon} size={22} color={colors.accent} />
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: {
    minHeight: 330,
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  heroGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 207, 112, 0.12)',
    top: -70,
    right: -55,
  },
  symbol: { color: colors.accent, fontSize: 74, lineHeight: 84 },
  heroLabel: {
    color: colors.textFaint,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 5,
  },
  rashi: { color: colors.white, fontSize: 34, fontWeight: '900', marginTop: 5 },
  heroDivider: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.16)',
    marginVertical: 22,
  },
  heroStats: { flexDirection: 'row', alignSelf: 'stretch' },
  heroStat: { flex: 1, alignItems: 'center', paddingHorizontal: 5 },
  heroStatLabel: { color: colors.textFaint, fontSize: 9, fontWeight: '700' },
  heroStatValue: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 5,
  },
  factGrid: { flexDirection: 'row', gap: 12, marginTop: 12 },
  factCard: { flex: 1, minHeight: 118, padding: 15 },
  factLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '700', marginTop: 10 },
  factValue: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 4 },
  limitedCard: { marginTop: 24, alignItems: 'center', padding: 22 },
  limitedIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  limitedTitle: { color: colors.text, fontSize: 20, fontWeight: '900', marginTop: 15 },
  limitedBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 9,
  },
  sunFallback: {
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.medium,
    padding: 14,
    marginTop: 18,
  },
  sunFallbackLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '700' },
  sunFallbackValue: { color: colors.accent, fontSize: 20, fontWeight: '900', marginTop: 4 },
  editButton: { alignSelf: 'stretch', marginTop: 16 },
  explanationCard: { marginTop: 16 },
  cardHeading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headingIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  explanation: { color: colors.textMuted, fontSize: 13, lineHeight: 21, marginTop: 14 },
  process: { gap: 12, marginTop: 18 },
  processRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
  processNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processNumberText: { color: colors.white, fontSize: 11, fontWeight: '900' },
  processText: { flex: 1, color: colors.text, fontSize: 13, lineHeight: 20 },
  precisionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.greenSoft,
    borderWidth: 1,
    borderColor: colors.greenBorder,
    borderRadius: radius.medium,
    padding: 14,
    marginTop: 14,
  },
  precisionText: { flex: 1, color: colors.text, fontSize: 12, lineHeight: 19 },
  methodNote: {
    color: colors.textMuted,
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});
