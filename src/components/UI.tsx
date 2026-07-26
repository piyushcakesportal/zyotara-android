import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, shadow } from '../theme';

export function ScreenContainer({
  children,
  scroll = true,
}: PropsWithChildren<{ scroll?: boolean }>) {
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.fixedContent}>{children}</View>
  );

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundRaised, colors.background]}
      style={styles.safeArea}
    >
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[styles.star, styles.starOne]} />
        <View style={[styles.star, styles.starTwo]} />
        <View style={[styles.star, styles.starThree]} />
        <View style={[styles.star, styles.starFour]} />
        <View style={[styles.star, styles.starFive]} />
        <View style={styles.cosmicGlow} />
      </View>
      <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        {body}
      </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

export function AppHeader({
  title,
  onBack,
  rightLabel,
  onRight,
}: {
  title: string;
  onBack?: () => void;
  rightLabel?: string;
  onRight?: () => void;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerSide}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.iconButton} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={[styles.headerSide, styles.headerRight]}>
        {rightLabel && onRight ? (
          <Pressable onPress={onRight} accessibilityRole="button">
            <Text style={styles.headerAction}>{rightLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  icon = 'arrow-forward',
  style,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressedButton,
        style,
      ]}
    >
      <Text style={styles.primaryButtonText}>{label}</Text>
      <Ionicons name={icon} size={19} color={colors.white} />
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  icon,
  danger,
  selected,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  danger?: boolean;
  selected?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.secondaryButton,
        selected && styles.selectedButton,
        danger && styles.dangerButton,
        pressed && styles.secondaryPressed,
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={danger ? colors.danger : selected ? colors.white : colors.primary}
        />
      ) : null}
      <Text
        style={[
          styles.secondaryButtonText,
          selected && styles.selectedButtonText,
          danger && styles.dangerText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function Field({
  label,
  help,
  error,
  ...inputProps
}: TextInputProps & { label: string; help?: string; error?: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, inputProps.multiline && styles.multiline]}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : help ? <Text style={styles.help}>{help}</Text> : null}
    </View>
  );
}

export function Card({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ children }: PropsWithChildren) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export const sharedStyles = StyleSheet.create({
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 38,
    marginTop: 8,
  },
  body: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  success: {
    color: colors.success,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  keyboard: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20, paddingBottom: 36 },
  fixedContent: { flex: 1, padding: 20 },
  header: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerSide: { width: 74 },
  headerRight: { alignItems: 'flex-end' },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  headerAction: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  primaryButton: {
    minHeight: 54,
    borderRadius: radius.medium,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryButtonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  disabledButton: { opacity: 0.45 },
  pressedButton: { backgroundColor: colors.primaryDark, transform: [{ scale: 0.99 }] },
  secondaryButton: {
    minHeight: 48,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surface,
  },
  secondaryPressed: { opacity: 0.75 },
  secondaryButtonText: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  selectedButton: { borderColor: colors.primary, backgroundColor: colors.primary },
  selectedButtonText: { color: colors.white },
  dangerButton: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  dangerText: { color: colors.danger },
  field: { gap: 6 },
  label: { color: colors.text, fontSize: 14, fontWeight: '700' },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.medium,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: 15,
    fontSize: 15,
  },
  multiline: { minHeight: 116, textAlignVertical: 'top', paddingTop: 14 },
  help: { color: colors.textMuted, fontSize: 12, lineHeight: 17 },
  error: { color: colors.danger, fontSize: 12, lineHeight: 17 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 12 },
  chip: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontSize: 13, fontWeight: '700' },
  chipTextSelected: { color: colors.white },
  star: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.white,
    opacity: 0.32,
  },
  starOne: { top: 92, left: 32 },
  starTwo: { top: 178, right: 48, width: 2, height: 2 },
  starThree: { top: 340, left: 18, width: 2, height: 2 },
  starFour: { top: 510, right: 27 },
  starFive: { bottom: 130, left: 58, width: 2, height: 2 },
  cosmicGlow: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(112, 75, 220, 0.07)',
    top: 35,
    right: -120,
  },
});
