// screen header
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/spacing';

// language is local ui state for this screen
export function Header({ language, text, onLanguageChange }) {
  return (
    <View style={styles.header}>
      {/* back action */}
      <Pressable style={styles.back}>
        <ArrowLeft color={colors.ink} size={24} />
        <Text style={styles.backText}>{text.goBack}</Text>
      </Pressable>

      {/* language switch */}
      <View style={styles.toggle}>
        <Pressable
          onPress={() => onLanguageChange('en')}
          style={[styles.toggleItem, language === 'en' && styles.toggleActive]}
        >
          <Text style={[styles.toggleText, language === 'en' && styles.toggleTextActive]}>ENG</Text>
        </Pressable>
        <Pressable
          onPress={() => onLanguageChange('hi')}
          style={[styles.toggleItem, language === 'hi' && styles.toggleActive]}
        >
          <Text style={[styles.toggleText, language === 'hi' && styles.toggleTextActive]}>हिंदी</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  back: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9
  },
  backText: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900'
  },
  toggle: {
    height: 38,
    padding: 3,
    borderRadius: radius.pill,
    backgroundColor: '#f1f4fb',
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row'
  },
  toggleItem: {
    minWidth: 62,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center'
  },
  toggleActive: {
    backgroundColor: colors.teal
  },
  toggleText: {
    color: colors.ink,
    fontWeight: '800'
  },
  toggleTextActive: {
    color: colors.surface
  }
});
