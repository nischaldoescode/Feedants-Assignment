// countdown strip
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Clock3, Hourglass } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/spacing';
import { formatCountdown } from '../../utils/date';
import { useCountdown } from '../../hooks/useCountdown';

// the target follows the active registration milestone
export function CountdownBanner({ competition, serverNow, text }) {
  const target = competition.timeline.registrationClosesAt;
  const remainingMs = useCountdown(target, serverNow);
  const hasClosed = remainingMs === 0;

  return (
    <View style={styles.wrap}>
      <Hourglass color={colors.teal} size={25} />
      {/* countdown label */}
      <Text style={styles.label}>{hasClosed ? text.registrationClosed : text.registrationClosesIn}</Text>
      <Text style={styles.time}>{formatCountdown(remainingMs)}</Text>
      <View style={styles.hurry}>
        <Clock3 color={colors.teal} size={25} />
        <Text style={styles.hurryText}>{hasClosed ? text.done : text.hurry}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 18,
    marginTop: 10,
    minHeight: 54,
    paddingHorizontal: 18,
    borderRadius: radius.sm,
    backgroundColor: colors.tealLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  label: {
    color: colors.ink,
    fontWeight: '900'
  },
  time: {
    flex: 1,
    color: colors.teal,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center'
  },
  hurry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7
  },
  hurryText: {
    color: colors.teal,
    fontWeight: '900'
  }
});
