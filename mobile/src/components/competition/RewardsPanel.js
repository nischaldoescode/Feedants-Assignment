// rewards panel
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Award, Medal, Star, Trophy } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Card, SectionTitle } from './Shared';

const icons = {
  trophy: Trophy,
  shield: Medal,
  award: Award,
  star: Star
};

// reward rows come straight from the api
export function RewardsPanel({ rewards, text }) {
  return (
    <Card>
      <SectionTitle
        trailing={<Text style={styles.trailing}>{text.allPositions}</Text>}
      >
        {text.rewards}
      </SectionTitle>

      {rewards.map((reward) => {
        const Icon = icons[reward.icon] || Star;

        return (
          <View key={reward.rank} style={styles.row}>
            {/* prize row */}
            <Icon
              color={reward.rank <= 3 ? colors.warning : colors.teal}
              size={24}
              fill={reward.rank <= 3 ? colors.warning : 'transparent'}
            />
            <Text style={styles.title}>{reward.title}</Text>
            <Text style={styles.amount}>{reward.prize.formatted}</Text>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  trailing: {
    marginLeft: 8,
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700'
  },
  row: {
    minHeight: 39,
    borderRadius: 9,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbfcff'
  },
  title: {
    flex: 1,
    marginLeft: 16,
    color: colors.ink,
    fontWeight: '900'
  },
  amount: {
    color: colors.teal,
    fontSize: 17,
    fontWeight: '900'
  }
});
