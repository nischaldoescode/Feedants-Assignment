// bottom navigation
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CircleUserRound, Home, Plus, Search, Trophy } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/spacing';

const navItems = [
  { key: 'home', icon: Home },
  { key: 'explore', icon: Search },
  { key: 'create', icon: Plus, center: true },
  { key: 'competitions', icon: Trophy, active: true },
  { key: 'profile', icon: CircleUserRound }
];

// visual bottom nav from the reference
export function BottomNav({ text }) {
  return (
    <View style={styles.nav}>
      {navItems.map((item) => {
        const Icon = item.icon;

        if (item.center) {
          return (
            <Pressable key={item.key} style={styles.center}>
              <Icon color={colors.teal} size={28} />
            </Pressable>
          );
        }

        return (
          <Pressable key={item.key} style={styles.item}>
            {/* nav item */}
            <Icon color={item.active ? colors.teal : colors.softMuted} size={26} />
            <Text style={[styles.label, item.active && styles.labelActive]}>{text[item.key]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    height: 74,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  item: {
    width: 74,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4
  },
  label: {
    color: colors.softMuted,
    fontSize: 11,
    fontWeight: '800'
  },
  labelActive: {
    color: colors.teal
  },
  center: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tealLight,
    borderWidth: 8,
    borderColor: colors.teal
  }
});
