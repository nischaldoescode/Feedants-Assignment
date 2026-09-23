// screen states
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { RefreshCcw } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/spacing';

// small full screen feedback for loading and errors
export function StatusState({ loading, error, onRetry }) {
  if (loading) {
    return (
      <View style={styles.wrap}>
        <ActivityIndicator color={colors.teal} size="large" />
        <Text style={styles.title}>Loading competition</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.title}>Could not load competition</Text>
        <Text style={styles.copy}>{error.message}</Text>
        <Pressable style={styles.retry} onPress={onRetry}>
          <RefreshCcw color={colors.surface} size={17} />
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.surface
  },
  title: {
    marginTop: 14,
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800'
  },
  copy: {
    marginTop: 8,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20
  },
  retry: {
    marginTop: 18,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: colors.teal
  },
  retryText: {
    color: colors.surface,
    fontWeight: '800'
  }
});
