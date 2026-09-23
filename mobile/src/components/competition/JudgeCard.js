// judge panel
import React from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Play } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/spacing';
import { Card } from './Shared';

// intro video is represented as a real action
export function JudgeCard({ judge, text }) {
  return (
    <Card style={styles.card}>
      {/* judge profile */}
      <View style={styles.identity}>
        <Image source={{ uri: judge.photoUrl }} style={styles.photo} />
        <View style={styles.copy}>
          <Text style={styles.label}>{text.judge}</Text>
          <Text style={styles.name}>{judge.name}</Text>
          <Text style={styles.detail}>{judge.title}</Text>
          <Text style={styles.detail}>{judge.experience}</Text>
        </View>
      </View>

      <Pressable
        style={styles.video}
        onPress={() => Alert.alert('Intro video', judge.introVideoUrl)}
      >
        {/* intro video action */}
        <View style={styles.play}>
          <Play color={colors.teal} size={24} fill={colors.teal} />
        </View>
        <Text style={styles.videoText}>{text.introVideo}</Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  identity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  photo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surfaceSoft
  },
  copy: {
    flex: 1,
    marginLeft: 18
  },
  label: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700'
  },
  name: {
    marginTop: 4,
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900'
  },
  detail: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700'
  },
  video: {
    width: 98,
    alignItems: 'center'
  },
  play: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tealLight
  },
  videoText: {
    marginTop: 8,
    color: colors.muted,
    fontWeight: '800'
  }
});
