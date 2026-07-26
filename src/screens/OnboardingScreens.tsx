import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BirthProfile, BirthTimePrecision, Language } from '../types';
import { colors, radius } from '../theme';
import {
  AppHeader,
  Card,
  Chip,
  Field,
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
  sharedStyles,
} from '../components/UI';
import { t } from '../i18n';

export function LanguageScreen({
  language,
  onLanguage,
  onContinue,
}: {
  language: Language;
  onLanguage: (language: Language) => void;
  onContinue: () => void;
}) {
  return (
    <LinearGradient
      colors={[colors.background, colors.primarySoft, colors.background]}
      style={styles.gradient}
    >
      <ScreenContainer scroll={false}>
        <View style={styles.languageScreen}>
          <View style={styles.orbit}>
            <View style={styles.orbitRing} />
            <View style={styles.orbitCore}>
              <Ionicons name="sparkles" size={56} color={colors.accent} />
            </View>
            <View style={styles.orbitDotOne} />
            <View style={styles.orbitDotTwo} />
          </View>

          <View style={styles.centerCopy}>
            <Text style={styles.brand}>{t(language, 'appName')}</Text>
            <Text style={styles.tagline}>{t(language, 'tagline')}</Text>
          </View>

          <View style={styles.languageBottom}>
            <Text style={styles.languageQuestion}>{t(language, 'chooseLanguage')}</Text>
            <View style={styles.twoButtons}>
              <View style={styles.flex}>
                <SecondaryButton
                  label="English"
                  selected={language === 'en'}
                  onPress={() => onLanguage('en')}
                />
              </View>
              <View style={styles.flex}>
                <SecondaryButton
                  label="हिन्दी"
                  selected={language === 'hi'}
                  onPress={() => onLanguage('hi')}
                />
              </View>
            </View>
            <PrimaryButton label={t(language, 'continue')} onPress={onContinue} />
            <Text style={styles.smallCenter}>{t(language, 'changeLater')}</Text>
          </View>
        </View>
      </ScreenContainer>
    </LinearGradient>
  );
}

export function WelcomeScreen({
  language,
  onBack,
  onContinue,
}: {
  language: Language;
  onBack: () => void;
  onContinue: () => void;
}) {
  const points = [
    { icon: 'person-outline' as const, text: t(language, 'welcomePoint1') },
    { icon: 'calendar-outline' as const, text: t(language, 'welcomePoint2') },
    { icon: 'checkmark-circle-outline' as const, text: t(language, 'welcomePoint3') },
  ];

  return (
    <ScreenContainer>
      <AppHeader title={t(language, 'appName')} onBack={onBack} />
      <Text style={sharedStyles.eyebrow}>DASHAVAANI</Text>
      <Text style={sharedStyles.title}>{t(language, 'welcomeTitle')}</Text>
      <Text style={sharedStyles.body}>{t(language, 'welcomeBody')}</Text>

      <View style={styles.pointList}>
        {points.map((point) => (
          <Card key={point.text} style={styles.pointCard}>
            <View style={styles.pointIcon}>
              <Ionicons name={point.icon} size={22} color={colors.primary} />
            </View>
            <Text style={styles.pointText}>{point.text}</Text>
          </Card>
        ))}
      </View>

      <Card style={styles.disclaimerCard}>
        <Ionicons name="information-circle-outline" size={22} color={colors.accent} />
        <Text style={styles.disclaimerText}>{t(language, 'disclaimerShort')}</Text>
      </Card>

      <View style={styles.bottomPush}>
        <PrimaryButton label={t(language, 'agreeContinue')} onPress={onContinue} />
      </View>
    </ScreenContainer>
  );
}

const emptyProfile: BirthProfile = {
  name: '',
  dateOfBirth: '',
  birthTime: '',
  birthTimePrecision: 'exact',
  birthPlace: '',
};

export function BirthProfileScreen({
  language,
  existing,
  onBack,
  onSave,
}: {
  language: Language;
  existing?: BirthProfile;
  onBack: () => void;
  onSave: (profile: BirthProfile) => void;
}) {
  const [profile, setProfile] = useState<BirthProfile>(existing ?? emptyProfile);
  const [confirmed, setConfirmed] = useState(Boolean(existing));
  const [error, setError] = useState('');

  const dateValid = useMemo(
    () => /^\d{4}-\d{2}-\d{2}$/.test(profile.dateOfBirth),
    [profile.dateOfBirth],
  );
  const timeNeeded = profile.birthTimePrecision !== 'unknown';
  const timeValid = !timeNeeded || /^\d{2}:\d{2}$/.test(profile.birthTime);

  function update<K extends keyof BirthProfile>(key: K, value: BirthProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
    setError('');
  }

  function save() {
    if (
      !profile.name.trim() ||
      !dateValid ||
      !timeValid ||
      !profile.birthPlace.trim() ||
      !confirmed
    ) {
      setError(t(language, 'requiredFields'));
      return;
    }
    onSave({
      ...profile,
      name: profile.name.trim(),
      birthPlace: profile.birthPlace.trim(),
      birthTime: profile.birthTimePrecision === 'unknown' ? '' : profile.birthTime,
    });
  }

  const precisionOptions: Array<{ value: BirthTimePrecision; label: string }> = [
    { value: 'exact', label: t(language, 'exact') },
    { value: 'approximate', label: t(language, 'approximate') },
    { value: 'unknown', label: t(language, 'unknown') },
  ];

  return (
    <ScreenContainer>
      <AppHeader title={t(language, 'appName')} onBack={onBack} />
      <Text style={sharedStyles.eyebrow}>1 / 2</Text>
      <Text style={sharedStyles.title}>{t(language, 'birthTitle')}</Text>
      <Text style={sharedStyles.body}>{t(language, 'birthBody')}</Text>

      <View style={styles.form}>
        <Field
          label={t(language, 'name')}
          placeholder={t(language, 'namePlaceholder')}
          autoCapitalize="words"
          value={profile.name}
          onChangeText={(value) => update('name', value)}
        />
        <Field
          label={t(language, 'dateOfBirth')}
          placeholder={t(language, 'datePlaceholder')}
          keyboardType="numbers-and-punctuation"
          maxLength={10}
          value={profile.dateOfBirth}
          onChangeText={(value) => update('dateOfBirth', value)}
        />

        {timeNeeded ? (
          <Field
            label={t(language, 'birthTime')}
            placeholder={t(language, 'timePlaceholder')}
            keyboardType="numbers-and-punctuation"
            maxLength={5}
            value={profile.birthTime}
            onChangeText={(value) => update('birthTime', value)}
          />
        ) : null}

        <View>
          <Text style={styles.fieldLabel}>{t(language, 'timeAccuracy')}</Text>
          <View style={styles.chipWrap}>
            {precisionOptions.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                selected={profile.birthTimePrecision === option.value}
                onPress={() => update('birthTimePrecision', option.value)}
              />
            ))}
          </View>
          {profile.birthTimePrecision === 'unknown' ? (
            <Text style={styles.precisionWarning}>
              {language === 'hi'
                ? 'आप आगे बढ़ सकते हैं, लेकिन समय और भाव आधारित उत्तर सीमित रहेगा।'
                : 'You can continue, but timing and house-based details will be limited.'}
            </Text>
          ) : null}
        </View>

        <Field
          label={t(language, 'birthPlace')}
          placeholder={t(language, 'placePlaceholder')}
          help={t(language, 'placeHelp')}
          autoCapitalize="words"
          value={profile.birthPlace}
          onChangeText={(value) => update('birthPlace', value)}
        />

        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: confirmed }}
          onPress={() => {
            setConfirmed((value) => !value);
            setError('');
          }}
          style={styles.confirmRow}
        >
          <Ionicons
            name={confirmed ? 'checkbox' : 'square-outline'}
            size={24}
            color={confirmed ? colors.primary : colors.textMuted}
          />
          <Text style={styles.confirmText}>{t(language, 'confirmDetails')}</Text>
        </Pressable>

        {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
        <PrimaryButton label={t(language, 'saveProfile')} onPress={save} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  languageScreen: { flex: 1 },
  orbit: {
    width: 190,
    height: 190,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 42,
  },
  orbitRing: {
    position: 'absolute',
    width: 174,
    height: 174,
    borderRadius: 87,
    borderWidth: 1,
    borderColor: colors.primary,
    opacity: 0.32,
    transform: [{ scaleY: 0.55 }, { rotate: '-18deg' }],
  },
  orbitCore: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitDotOne: {
    position: 'absolute',
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: colors.accent,
    top: 65,
    left: 6,
  },
  orbitDotTwo: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.primary,
    right: 14,
    bottom: 52,
  },
  centerCopy: { alignItems: 'center', paddingHorizontal: 18 },
  brand: { color: colors.text, fontSize: 32, fontWeight: '800' },
  tagline: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
  },
  languageBottom: { marginTop: 'auto', gap: 14, paddingBottom: 8 },
  languageQuestion: {
    textAlign: 'center',
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
  },
  twoButtons: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
  smallCenter: { textAlign: 'center', color: colors.textMuted, fontSize: 12 },
  pointList: { gap: 12, marginTop: 26 },
  pointCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 15 },
  pointIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointText: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '700' },
  disclaimerCard: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF8E8',
    borderColor: '#F1D79C',
  },
  disclaimerText: { flex: 1, color: colors.text, fontSize: 13, lineHeight: 19 },
  bottomPush: { marginTop: 'auto', paddingTop: 22 },
  form: { gap: 18, marginTop: 24 },
  fieldLabel: { color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 9 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  precisionWarning: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: 8 },
  confirmRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  confirmText: { flex: 1, color: colors.text, fontSize: 14, lineHeight: 21 },
});

