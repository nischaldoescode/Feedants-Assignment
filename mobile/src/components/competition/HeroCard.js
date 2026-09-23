// competition summary
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckCircle2, Trophy, UsersRound } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Pill, Card } from './Shared';

// top card mirrors the main design facts
export function HeroCard({ competition, viewer, text, fill }) {
  const spots = competition.spots;

  return (
    <Card>
      {/* title and user state */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>{competition.title}</Text>
        {viewer.isRegistered && (
          <Pill active icon={<CheckCircle2 color={colors.teal} size={18} />}>
            {text.registered}
          </Pill>
        )}
      </View>

      {/* category chips */}
      <View style={styles.chipRow}>
        {competition.tags.map((tag) => (
          <Pill key={tag}>{tag}</Pill>
        ))}
        {competition.certificateAwarded && (
          <View style={styles.certificate}>
            <Trophy color={colors.teal} size={20} />
            <Text style={styles.certificateText}>{text.certificate}</Text>
          </View>
        )}
      </View>

      {/* money and capacity */}
      <View style={styles.facts}>
        <View>
          <Text style={styles.factLabel}>{text.prizePool}</Text>
          <Text style={styles.amount}>{competition.prizePool.formatted}</Text>
        </View>
        <View>
          <Text style={styles.factLabel}>{text.entryFee}</Text>
          <Text style={styles.fee}>{competition.entryFee.formatted}</Text>
        </View>
        <View style={styles.spots}>
          <View style={styles.spotsHeader}>
            <UsersRound color={colors.teal} size={18} />
            <Text style={styles.spotsLeft}>{fill(text.spotsLeft, { count: spots.left })}</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.progress, { width: `${spots.bookedPercent}%` }]} />
          </View>
          <Text style={styles.booked}>{fill(text.booked, { booked: spots.booked, total: spots.total })}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12
  },
  title: {
    flex: 1,
    color: colors.ink,
    fontSize: 26,
    lineHeight: 31,
    fontWeight: '900'
  },
  chipRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10
  },
  certificate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 4
  },
  certificateText: {
    color: colors.teal,
    fontSize: 14,
    fontWeight: '700'
  },
  facts: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16
  },
  factLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700'
  },
  amount: {
    marginTop: 6,
    color: colors.teal,
    fontSize: 36,
    fontWeight: '900'
  },
  fee: {
    marginTop: 10,
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900'
  },
  spots: {
    flex: 1.1,
    minWidth: 134,
    paddingTop: 2
  },
  spotsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  spotsLeft: {
    color: colors.teal,
    fontWeight: '900'
  },
  track: {
    marginTop: 18,
    height: 6,
    borderRadius: 10,
    backgroundColor: '#d2eef0',
    overflow: 'hidden'
  },
  progress: {
    height: 6,
    borderRadius: 10,
    backgroundColor: colors.teal
  },
  booked: {
    marginTop: 9,
    color: colors.muted,
    fontWeight: '700'
  }
});
