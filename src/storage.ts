import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { AppState, BirthProfile, Prediction } from './types';

const APP_STATE_KEY = 'dashavaani.app-state.v1';
const PROFILE_KEY = 'dashavaani.birth-profile.v1';
const PREDICTION_PREFIX = 'dashavaani.prediction.';

const todayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const defaultAppState: AppState = {
  language: 'en',
  onboardingComplete: false,
  history: [],
  usage: { day: todayKey(), count: 0 },
};

async function getSensitive(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function setSensitive(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function removeSensitive(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export async function loadState(): Promise<AppState> {
  try {
    const rawState = await AsyncStorage.getItem(APP_STATE_KEY);
    const rawProfile = await getSensitive(PROFILE_KEY);
    const stored = rawState ? (JSON.parse(rawState) as AppState) : defaultAppState;
    const savedProfile = rawProfile ? (JSON.parse(rawProfile) as BirthProfile) : undefined;
    const profile = savedProfile
      ? {
          ...savedProfile,
          // Existing MVP profiles were created for an India-first launch.
          // The user can change this value in Edit birth profile.
          timezoneOffset: savedProfile.timezoneOffset || '+05:30',
        }
      : undefined;
    const day = todayKey();
    const usage = stored.usage?.day === day ? stored.usage : { day, count: 0 };

    const predictions = await Promise.all(
      (stored.history ?? []).slice(0, 20).map(async (entry) => {
        const raw = await getSensitive(`${PREDICTION_PREFIX}${entry.id}`);
        return raw ? (JSON.parse(raw) as Prediction) : entry;
      }),
    );

    return {
      ...defaultAppState,
      ...stored,
      profile,
      usage,
      history: predictions,
    };
  } catch {
    return defaultAppState;
  }
}

export async function saveState(state: AppState): Promise<void> {
  const historyIndex = state.history.map((prediction) => ({
    ...prediction,
    context: '',
    sections: {
      shortAnswer: prediction.sections.shortAnswer,
      currentPhase: '',
      favourablePeriod: '',
      cautionPeriod: '',
      whyThisMatters: '',
      practicalActions: [],
      traditionalGuidance: '',
      disclaimer: '',
    },
  }));

  await AsyncStorage.setItem(
    APP_STATE_KEY,
    JSON.stringify({ ...state, profile: undefined, history: historyIndex }),
  );

  if (state.profile) {
    await setSensitive(PROFILE_KEY, JSON.stringify(state.profile));
  } else {
    await removeSensitive(PROFILE_KEY);
  }

  await Promise.all(
    state.history.slice(0, 20).map((prediction) =>
      setSensitive(`${PREDICTION_PREFIX}${prediction.id}`, JSON.stringify(prediction)),
    ),
  );
}

export async function deletePredictionFile(id: string): Promise<void> {
  await removeSensitive(`${PREDICTION_PREFIX}${id}`);
}

export async function clearAllData(history: Prediction[]): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(APP_STATE_KEY),
    removeSensitive(PROFILE_KEY),
    ...history.map((prediction) => removeSensitive(`${PREDICTION_PREFIX}${prediction.id}`)),
  ]);
}
