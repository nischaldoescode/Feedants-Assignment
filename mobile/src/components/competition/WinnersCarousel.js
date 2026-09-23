// winners carousel
import React from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Play } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/spacing';
import { Card, SectionTitle } from './Shared';

// winner cards scroll horizontally like the reference(png)
export function WinnersCarousel({ winners, text }) {
  return (
    <Card style={styles.card}>
      <SectionTitle>{text.previousWinners}</SectionTitle>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {winners.map((winner) => (
            <Pressable
              key={`${winner.name}-${winner.position}`}
              style={styles.item}
              onPress={() => Alert.alert(`${winner.name} performance`, winner.videoUrl)}
            >
              {/* winner video card */}
              <View>
                <Image source={{ uri: winner.thumbnailUrl }} style={styles.image} />
                <View style={styles.play}>
                  <Play color={colors.surface} size={16} fill={colors.surface} />
                </View>
              </View>
              <View style={styles.copy}>
                <Text numberOfLines={1} style={styles.name}>{winner.name}</Text>
                <Text style={styles.position}>{winner.position}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingRight: 0
  },
  row: {
    flexDirection: 'row',
    gap: 14,
    paddingRight: 16
  },
  item: {
    width: 176,
    minHeight: 92,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSoft,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
  },
  image: {
    width: 82,
    height: 92,
    backgroundColor: colors.line
  },
  play: {
    position: 'absolute',
    right: 7,
    bottom: 7,
    width: 31,
    height: 31,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.teal
  },
  copy: {
    flex: 1,
    paddingHorizontal: 10
  },
  name: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900'
  },
  position: {
    marginTop: 7,
    color: colors.teal,
    fontSize: 13,
    fontWeight: '800'
  }
});
