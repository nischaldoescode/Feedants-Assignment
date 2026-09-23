// date grid
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CalendarDays, Send, Trophy, Upload } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { formatDateParts } from '../../utils/date';
import { Card, SectionTitle } from './Shared';

const dateRows = [
  ['registerBefore', 'registrationClosesAt', CalendarDays],
  ['submissionStarts', 'submissionStartsAt', Send],
  ['submissionEnds', 'submissionEndsAt', Upload],
  ['resultDate', 'resultAt', Trophy]
];

// all date values are served by the api
export function ImportantDates({ timeline, text }) {
  return (
    <Card>
      <SectionTitle>{text.importantDates}</SectionTitle>
      <View style={styles.grid}>
        {dateRows.map(([label, key, Icon], index) => {
          const parts = formatDateParts(timeline[key]);

          return (
            <View
              key={key}
              style={[
                styles.cell,
                index % 2 === 0 && styles.rightLine,
                index < 2 && styles.bottomLine
              ]}
            >
              <Icon color={colors.teal} size={30} />
              {/* date label */}
              <View style={styles.copy}>
                <Text style={styles.label}>{text[label]}</Text>
                <Text style={styles.date}>{parts.date}</Text>
                <Text style={styles.time}>{parts.time}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  cell: {
    width: '50%',
    minHeight: 104,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  rightLine: {
    borderRightWidth: 1,
    borderRightColor: colors.line
  },
  bottomLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  copy: {
    flex: 1
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700'
  },
  date: {
    marginTop: 5,
    color: colors.teal,
    fontSize: 15,
    fontWeight: '900'
  },
  time: {
    marginTop: 4,
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800'
  }
});
