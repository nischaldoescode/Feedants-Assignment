// sticky action bar
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Upload } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';

// main action follows the api decision
export function StickyActionBar({ action, busy, canCancel, text, onPrimary, onCancel }) {
  return (
    <View style={styles.wrap}>
      {canCancel && (
        <Pressable style={styles.cancel} onPress={onCancel} disabled={busy}>
          <Text style={styles.cancelText}>{text.cancelRegistration}</Text>
        </Pressable>
      )}

      {/* server directed action */}
      <Pressable
        disabled={action.disabled || busy}
        onPress={onPrimary}
        style={({ pressed }) => [
          styles.pressable,
          (action.disabled || busy) && styles.disabled,
          pressed && !action.disabled && styles.pressed
        ]}
      >
        <LinearGradient
          colors={['#008f96', '#007178']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Upload color={colors.surface} size={21} />
          <View style={styles.copy}>
            <Text style={styles.label}>{busy ? 'Please wait' : action.label}</Text>
            {action.reason ? <Text style={styles.reason}>{action.reason}</Text> : null}
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 18,
    paddingTop: 9,
    paddingBottom: 7,
    backgroundColor: colors.surface
  },
  cancel: {
    alignSelf: 'center',
    minHeight: 30,
    justifyContent: 'center',
    marginBottom: 5
  },
  cancelText: {
    color: colors.danger,
    fontWeight: '800'
  },
  pressable: {
    borderRadius: 8,
    overflow: 'hidden'
  },
  disabled: {
    opacity: 0.66
  },
  pressed: {
    transform: [{ scale: 0.99 }]
  },
  button: {
    minHeight: 57,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 11
  },
  copy: {
    alignItems: 'center'
  },
  label: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: '900'
  },
  reason: {
    marginTop: 3,
    color: '#dff7f7',
    fontSize: 11,
    fontWeight: '800'
  }
});
