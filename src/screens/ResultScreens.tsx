import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  AppHeader,
  Card,
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
  SectionTitle,
  sharedStyles,
} from '../components/UI';
import { t } from '../i18n';
import { colors, radius } from '../theme';
import { Feedback, Language, Prediction } from '../types';

function predictionToText(prediction: Prediction): string {
  const { sections } = prediction;
  return [
    prediction.questionLabel,
    '',
    sections.shortAnswer,
    '',
    sections.currentPhase,
    '',
    sections.favourablePeriod,
    '',
    sections.practicalActions.map((action, index) => `${index + 1}. ${action}`).join('\n'),
    '',
    sections.disclaimer,
  ].join('\n');
}

export function ResultScreen({
  language,
  prediction,
  onBackHome,
  onAskAnother,
  onFeedback,
}: {
  language: Language;
  prediction: Prediction;
  onBackHome: () => void;
  onAskAnother: () => void;
  onFeedback: (feedback: Feedback) => void;
}) {
  const precision =
    prediction.birthDataPrecision === 'exact'
      ? t(language, 'exactPrecision')
      : prediction.birthDataPrecision === 'approximate'
        ? t(language, 'approximatePrecision')
        : t(language, 'unknownPrecision');

  async function share() {
    await Share.share({ message: predictionToText(prediction), title: t(language, 'resultTitle') });
  }

  const sections = [
    { title: t(language, 'shortAnswer'), text: prediction.sections.shortAnswer, icon: 'chatbubble-ellipses-outline' as const },
    { title: t(language, 'currentPhase'), text: prediction.sections.currentPhase, icon: 'moon-outline' as const },
    { title: t(language, 'favourablePeriod'), text: prediction.sections.favourablePeriod, icon: 'calendar-outline' as const },
    { title: t(language, 'cautionPeriod'), text: prediction.sections.cautionPeriod, icon: 'warning-outline' as const },
    { title: t(language, 'whyThisMatters'), text: prediction.sections.whyThisMatters, icon: 'planet-outline' as const },
  ];

  return (
    <ScreenContainer>
      <AppHeader
        title={t(language, 'resultTitle')}
        onBack={onBackHome}
        rightLabel={language === 'hi' ? 'शेयर' : 'Share'}
        onRight={share}
      />

      <Text style={sharedStyles.eyebrow}>
        {prediction.category === 'career' ? t(language, 'career') : t(language, 'relationship')}
      </Text>
      <Text style={styles.resultQuestion}>{prediction.questionLabel}</Text>

      {prediction.source === 'demo' ? (
        <View style={styles.demoNotice}>
          <Ionicons name="construct-outline" size={20} color={colors.accent} />
          <Text style={styles.demoText}>{t(language, 'demoNotice')}</Text>
        </View>
      ) : null}

      <View style={styles.sectionList}>
        {sections.map((section) => (
          <Card key={section.title}>
            <View style={styles.sectionHeading}>
              <View style={styles.sectionIcon}>
                <Ionicons name={section.icon} size={20} color={colors.primary} />
              </View>
              <Text style={styles.sectionName}>{section.title}</Text>
            </View>
            <Text style={styles.sectionText}>{section.text}</Text>
          </Card>
        ))}

        <Card>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionIcon}>
              <Ionicons name="checkmark-done-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.sectionName}>{t(language, 'actions')}</Text>
          </View>
          {prediction.sections.practicalActions.map((action, index) => (
            <View key={action} style={styles.actionRow}>
              <View style={styles.actionNumber}>
                <Text style={styles.actionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.actionText}>{action}</Text>
            </View>
          ))}
        </Card>

        <Card>
          <Text style={styles.sectionName}>{t(language, 'traditionalGuidance')}</Text>
          <Text style={styles.sectionText}>{prediction.sections.traditionalGuidance}</Text>
        </Card>

        <View style={styles.precisionRow}>
          <Text style={styles.precisionLabel}>{t(language, 'precision')}</Text>
          <Text style={styles.precisionValue}>{precision}</Text>
        </View>
        <Text style={styles.disclaimer}>{prediction.sections.disclaimer}</Text>
      </View>

      <View style={styles.feedback}>
        <Text style={styles.feedbackTitle}>
          {language === 'hi' ? 'क्या यह उत्तर उपयोगी लगा?' : 'Did this reading feel useful?'}
        </Text>
        <View style={styles.twoButtons}>
          <View style={styles.flex}>
            <SecondaryButton
              label={t(language, 'relevant')}
              icon="thumbs-up-outline"
              selected={prediction.feedback === 'relevant'}
              onPress={() => onFeedback('relevant')}
            />
          </View>
          <View style={styles.flex}>
            <SecondaryButton
              label={t(language, 'notRelevant')}
              icon="thumbs-down-outline"
              selected={prediction.feedback === 'not_relevant'}
              onPress={() => onFeedback('not_relevant')}
            />
          </View>
        </View>
      </View>

      <PrimaryButton label={t(language, 'askAnother')} onPress={onAskAnother} />
    </ScreenContainer>
  );
}

export function HistoryScreen({
  language,
  history,
  onBack,
  onOpen,
  onDelete,
}: {
  language: Language;
  history: Prediction[];
  onBack: () => void;
  onOpen: (prediction: Prediction) => void;
  onDelete: (prediction: Prediction) => void;
}) {
  return (
    <ScreenContainer>
      <AppHeader title={t(language, 'history')} onBack={onBack} />
      <Text style={sharedStyles.title}>{t(language, 'history')}</Text>

      <View style={styles.historyList}>
        {history.length ? (
          history.map((prediction) => (
            <Pressable key={prediction.id} onPress={() => onOpen(prediction)}>
              <Card style={styles.historyCard}>
                <View style={styles.historyTop}>
                  <View style={styles.historyCategory}>
                    <Ionicons
                      name={prediction.category === 'career' ? 'briefcase-outline' : 'heart-outline'}
                      size={17}
                      color={colors.primary}
                    />
                    <Text style={styles.historyCategoryText}>
                      {prediction.category === 'career'
                        ? t(language, 'career')
                        : t(language, 'relationship')}
                    </Text>
                  </View>
                  <Pressable
                    onPress={(event) => {
                      event.stopPropagation();
                      onDelete(prediction);
                    }}
                    style={styles.deleteIcon}
                    accessibilityLabel={t(language, 'delete')}
                  >
                    <Ionicons name="trash-outline" size={18} color={colors.danger} />
                  </Pressable>
                </View>
                <Text style={styles.historyQuestion}>{prediction.questionLabel}</Text>
                <Text style={styles.historyAnswer} numberOfLines={2}>
                  {prediction.sections.shortAnswer}
                </Text>
                <Text style={styles.historyDate}>
                  {new Date(prediction.createdAt).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}
                </Text>
              </Card>
            </Pressable>
          ))
        ) : (
          <Card>
            <Text style={styles.emptyText}>{t(language, 'noHistory')}</Text>
          </Card>
        )}
      </View>
    </ScreenContainer>
  );
}

export function SettingsScreen({
  language,
  onLanguage,
  onBack,
  onEditProfile,
  onDeleteHistory,
  onDeleteAll,
}: {
  language: Language;
  onLanguage: (language: Language) => void;
  onBack: () => void;
  onEditProfile: () => void;
  onDeleteHistory: () => void;
  onDeleteAll: () => void;
}) {
  function confirm(title: string, body: string, action: () => void) {
    Alert.alert(title, body, [
      { text: language === 'hi' ? 'रद्द करें' : 'Cancel', style: 'cancel' },
      { text: t(language, 'delete'), style: 'destructive', onPress: action },
    ]);
  }

  return (
    <ScreenContainer>
      <AppHeader title={t(language, 'settings')} onBack={onBack} />
      <Text style={sharedStyles.title}>{t(language, 'settings')}</Text>

      <View style={styles.settingsSection}>
        <SectionTitle>{t(language, 'language')}</SectionTitle>
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
      </View>

      <View style={styles.settingsSection}>
        <SecondaryButton
          label={t(language, 'editProfile')}
          icon="person-outline"
          onPress={onEditProfile}
        />
      </View>

      <View style={styles.settingsSection}>
        <Card>
          <Text style={styles.infoTitle}>{t(language, 'privacy')}</Text>
          <Text style={styles.infoText}>{t(language, 'privacyBody')}</Text>
        </Card>
        <Card>
          <Text style={styles.infoTitle}>{t(language, 'terms')}</Text>
          <Text style={styles.infoText}>{t(language, 'termsBody')}</Text>
        </Card>
      </View>

      <View style={styles.settingsSection}>
        <SecondaryButton
          label={t(language, 'deleteHistory')}
          icon="trash-outline"
          danger
          onPress={() =>
            confirm(
              t(language, 'deleteHistory'),
              language === 'hi' ? 'सभी पुराने उत्तर हमेशा के लिए हट जाएंगे।' : 'All saved readings will be permanently deleted.',
              onDeleteHistory,
            )
          }
        />
        <SecondaryButton
          label={t(language, 'deleteData')}
          icon="warning-outline"
          danger
          onPress={() =>
            confirm(
              t(language, 'deleteData'),
              language === 'hi' ? 'जन्म विवरण और सभी उत्तर हट जाएंगे।' : 'Your birth profile and all readings will be deleted.',
              onDeleteAll,
            )
          }
        />
      </View>

      <Text style={styles.version}>{t(language, 'version')}</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  resultQuestion: { color: colors.text, fontSize: 25, lineHeight: 34, fontWeight: '800', marginTop: 8 },
  demoNotice: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E8',
    borderRadius: radius.medium,
    padding: 13,
    marginTop: 16,
  },
  demoText: { flex: 1, color: colors.text, fontSize: 12, lineHeight: 18 },
  sectionList: { gap: 14, marginTop: 18 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 11 },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionName: { flex: 1, color: colors.text, fontSize: 16, fontWeight: '800' },
  sectionText: { color: colors.textMuted, fontSize: 14, lineHeight: 22, marginTop: 8 },
  actionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 11, marginTop: 12 },
  actionNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionNumberText: { color: colors.white, fontSize: 12, fontWeight: '800' },
  actionText: { flex: 1, color: colors.textMuted, fontSize: 14, lineHeight: 21 },
  precisionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.medium,
    padding: 14,
  },
  precisionLabel: { color: colors.text, fontSize: 13, fontWeight: '700' },
  precisionValue: { color: colors.primary, fontSize: 13, fontWeight: '800' },
  disclaimer: { color: colors.textMuted, fontSize: 11, lineHeight: 17, textAlign: 'center' },
  feedback: { marginVertical: 24 },
  feedbackTitle: { color: colors.text, fontSize: 16, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  twoButtons: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
  historyList: { gap: 13, marginTop: 22 },
  historyCard: { padding: 16 },
  historyTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  historyCategory: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  historyCategoryText: { color: colors.primary, fontSize: 13, fontWeight: '800' },
  deleteIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF5F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyQuestion: { color: colors.text, fontSize: 16, lineHeight: 23, fontWeight: '800', marginTop: 12 },
  historyAnswer: { color: colors.textMuted, fontSize: 13, lineHeight: 20, marginTop: 7 },
  historyDate: { color: colors.textMuted, fontSize: 11, marginTop: 12 },
  emptyText: { color: colors.textMuted, textAlign: 'center', lineHeight: 22 },
  settingsSection: { gap: 12, marginTop: 24 },
  infoTitle: { color: colors.text, fontSize: 15, fontWeight: '800' },
  infoText: { color: colors.textMuted, fontSize: 13, lineHeight: 20, marginTop: 8 },
  version: { color: colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 28 },
});

