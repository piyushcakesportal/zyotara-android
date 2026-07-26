import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  BirthProfileScreen,
  LanguageScreen,
  WelcomeScreen,
} from './src/screens/OnboardingScreens';
import {
  GeneratingScreen,
  HomeScreen,
  QuestionScreen,
  ReviewScreen,
} from './src/screens/CoreScreens';
import {
  HistoryScreen,
  ResultScreen,
  SettingsScreen,
} from './src/screens/ResultScreens';
import { DailyHoroscopeScreen } from './src/screens/DailyHoroscopeScreen';
import {
  clearAllData,
  defaultAppState,
  deletePredictionFile,
  loadState,
  saveState,
} from './src/storage';
import { generatePrediction } from './src/services/predictionService';
import { colors } from './src/theme';
import {
  AppState,
  BirthProfile,
  Category,
  Feedback,
  Language,
  Prediction,
  QuestionDraft,
  Screen,
} from './src/types';
import { t } from './src/i18n';

type ProfileReturn = 'home' | 'review';

function localDayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function App() {
  const [state, setState] = useState<AppState>(defaultAppState);
  const [screen, setScreen] = useState<Screen>('language');
  const [hydrated, setHydrated] = useState(false);
  const [category, setCategory] = useState<Category>('career');
  const [draft, setDraft] = useState<QuestionDraft>();
  const [currentPrediction, setCurrentPrediction] = useState<Prediction>();
  const [profileReturn, setProfileReturn] = useState<ProfileReturn>('home');

  useEffect(() => {
    let active = true;
    loadState().then((loaded) => {
      if (!active) return;
      setState(loaded);
      setScreen(loaded.onboardingComplete && loaded.profile ? 'home' : 'language');
      setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveState(state).catch(() => {
      // The UI remains usable if local persistence fails temporarily.
    });
  }, [hydrated, state]);

  const language = state.language;

  function setLanguage(nextLanguage: Language) {
    setState((current) => ({ ...current, language: nextLanguage }));
  }

  function saveProfile(profile: BirthProfile) {
    setState((current) => ({
      ...current,
      profile,
      onboardingComplete: true,
    }));
    setScreen(profileReturn === 'review' && draft ? 'review' : 'home');
    setProfileReturn('home');
  }

  function usageForToday(current: AppState): AppState['usage'] {
    const day = localDayKey();
    return current.usage.day === day ? current.usage : { day, count: 0 };
  }

  function startQuestion(nextCategory: Category) {
    const usage = usageForToday(state);
    if (usage.count >= 2) {
      Alert.alert(t(language, 'dailyLimit'));
      if (usage !== state.usage) {
        setState((current) => ({ ...current, usage }));
      }
      return;
    }
    setCategory(nextCategory);
    setDraft(undefined);
    setScreen('question');
  }

  const performGeneration = useCallback(async () => {
    if (!state.profile || !draft) {
      setScreen('home');
      return;
    }

    try {
      const prediction = await generatePrediction({
        language,
        profile: state.profile,
        question: draft,
      });
      setCurrentPrediction(prediction);
      setState((current) => {
        const usage = usageForToday(current);
        return {
          ...current,
          history: [prediction, ...current.history].slice(0, 20),
          usage: { day: usage.day, count: Math.min(2, usage.count + 1) },
        };
      });
      setScreen('result');
    } catch {
      Alert.alert(t(language, 'tryAgain'));
      setScreen('review');
    }
  }, [draft, language, state.profile]);

  function openPrediction(prediction: Prediction) {
    setCurrentPrediction(prediction);
    setScreen('result');
  }

  function setFeedback(feedback: Feedback) {
    if (!currentPrediction) return;
    const updated = { ...currentPrediction, feedback };
    setCurrentPrediction(updated);
    setState((current) => ({
      ...current,
      history: current.history.map((prediction) =>
        prediction.id === updated.id ? updated : prediction,
      ),
    }));
  }

  async function deleteOne(prediction: Prediction) {
    await deletePredictionFile(prediction.id);
    setState((current) => ({
      ...current,
      history: current.history.filter((item) => item.id !== prediction.id),
    }));
  }

  async function deleteHistory() {
    await Promise.all(state.history.map((prediction) => deletePredictionFile(prediction.id)));
    setState((current) => ({ ...current, history: [] }));
  }

  async function deleteEverything() {
    await clearAllData(state.history);
    setState({
      ...defaultAppState,
      language,
      history: [],
      usage: { day: localDayKey(), count: 0 },
    });
    setDraft(undefined);
    setCurrentPrediction(undefined);
    setScreen('language');
  }

  if (!hydrated) {
    return (
      <SafeAreaProvider>
        <View style={styles.loading}>
          <View style={styles.loadingMark}>
            <Text style={styles.loadingStar}>✦</Text>
          </View>
          <Text style={styles.loadingBrand}>DashaVaani</Text>
          <ActivityIndicator color={colors.primary} size="large" style={styles.spinner} />
        </View>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  let content: React.ReactNode;

  switch (screen) {
    case 'language':
      content = (
        <LanguageScreen
          language={language}
          onLanguage={setLanguage}
          onContinue={() => setScreen(state.onboardingComplete ? 'home' : 'welcome')}
        />
      );
      break;
    case 'welcome':
      content = (
        <WelcomeScreen
          language={language}
          onBack={() => setScreen('language')}
          onContinue={() => {
            setProfileReturn('home');
            setScreen('birthProfile');
          }}
        />
      );
      break;
    case 'birthProfile':
      content = (
        <BirthProfileScreen
          language={language}
          existing={state.profile}
          onBack={() =>
            setScreen(
              profileReturn === 'review'
                ? 'review'
                : state.onboardingComplete
                  ? 'settings'
                  : 'welcome',
            )
          }
          onSave={saveProfile}
        />
      );
      break;
    case 'home':
      content = (
        <HomeScreen
          language={language}
          state={{ ...state, usage: usageForToday(state) }}
          onCategory={startQuestion}
          onDailyHoroscope={() => setScreen('dailyHoroscope')}
          onHistory={() => setScreen('history')}
          onSettings={() => setScreen('settings')}
          onOpenPrediction={openPrediction}
        />
      );
      break;
    case 'dailyHoroscope':
      content = state.profile ? (
        <DailyHoroscopeScreen
          language={language}
          profile={state.profile}
          onBack={() => setScreen('home')}
        />
      ) : null;
      break;
    case 'question':
      content = (
        <QuestionScreen
          language={language}
          category={category}
          existing={draft?.category === category ? draft : undefined}
          onBack={() => setScreen('home')}
          onContinue={(question) => {
            setDraft(question);
            setScreen('review');
          }}
        />
      );
      break;
    case 'review':
      content = draft ? (
        <ReviewScreen
          language={language}
          profile={state.profile}
          question={draft}
          onBack={() => setScreen('question')}
          onEditProfile={() => {
            setProfileReturn('review');
            setScreen('birthProfile');
          }}
          onGenerate={() => setScreen('generating')}
        />
      ) : (
        <HomeScreen
          language={language}
          state={state}
          onCategory={startQuestion}
          onDailyHoroscope={() => setScreen('dailyHoroscope')}
          onHistory={() => setScreen('history')}
          onSettings={() => setScreen('settings')}
          onOpenPrediction={openPrediction}
        />
      );
      break;
    case 'generating':
      content = <GeneratingScreen language={language} onGenerate={performGeneration} />;
      break;
    case 'result':
      content = currentPrediction ? (
        <ResultScreen
          language={language}
          prediction={currentPrediction}
          profile={state.profile}
          onBackHome={() => setScreen('home')}
          onAskAnother={() => setScreen('home')}
          onFeedback={setFeedback}
        />
      ) : null;
      break;
    case 'history':
      content = (
        <HistoryScreen
          language={language}
          history={state.history}
          onBack={() => setScreen('home')}
          onOpen={openPrediction}
          onDelete={deleteOne}
        />
      );
      break;
    case 'settings':
      content = (
        <SettingsScreen
          language={language}
          onLanguage={setLanguage}
          onBack={() => setScreen('home')}
          onEditProfile={() => {
            setProfileReturn('home');
            setScreen('birthProfile');
          }}
          onDeleteHistory={deleteHistory}
          onDeleteAll={deleteEverything}
        />
      );
      break;
    default:
      content = null;
  }

  return (
    <SafeAreaProvider>
      {content}
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMark: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingStar: { color: colors.accent, fontSize: 52 },
  loadingBrand: { color: colors.text, fontSize: 26, fontWeight: '800', marginTop: 18 },
  spinner: { marginTop: 24 },
});
