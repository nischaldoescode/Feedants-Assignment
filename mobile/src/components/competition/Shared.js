// shared view pieces
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { radius, shadow } from '../../theme/spacing';

// card shell used by most sections
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// simple section title
export function SectionTitle({ children, trailing }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionText}>{children}</Text>
      {trailing}
    </View>
  );
}

// compact label chip
export function Pill({ children, active, icon }) {
  return (
    <View style={[styles.pill, active && styles.pillActive]}>
      {icon}
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{children}</Text>
    </View>
  );
}

// button used in cards and sticky footer
export function ActionButton({ label, icon, disabled, busy, onPress, variant = 'primary', style }) {
  return (
    <Pressable
      disabled={disabled || busy}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'ghost' && styles.buttonGhost,
        (disabled || busy) && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
        style
      ]}
    >
      {icon}
      <Text style={[styles.buttonText, variant === 'ghost' && styles.buttonGhostText]}>
        {busy ? 'Please wait' : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 18,
    marginTop: 10,
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  sectionText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900'
  },
  pill: {
    minHeight: 30,
    paddingHorizontal: 13,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSoft,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7
  },
  pillActive: {
    borderWidth: 1,
    borderColor: '#b7e4e6',
    backgroundColor: '#eefbfb'
  },
  pillText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800'
  },
  pillTextActive: {
    color: colors.teal
  },
  button: {
    minHeight: 52,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
    backgroundColor: colors.teal
  },
  buttonGhost: {
    minHeight: 42,
    backgroundColor: '#eefbfb',
    borderWidth: 1,
    borderColor: '#c4e8ea'
  },
  buttonDisabled: {
    opacity: 0.64
  },
  buttonPressed: {
    transform: [{ scale: 0.99 }]
  },
  buttonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '900'
  },
  buttonGhostText: {
    color: colors.teal
  }
});
