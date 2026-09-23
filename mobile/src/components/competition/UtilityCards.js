// lower cards
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import {
  ChevronRight,
  Copy,
  Info,
  LockKeyhole,
  Megaphone,
  MessageCircle,
  Play,
  ShieldCheck
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/spacing';
import { ActionButton, Card } from './Shared';

// concise disclaimer line from the server
export function Disclaimer({ message, text }) {
  return (
    <View style={styles.disclaimer}>
      <Info color={colors.teal} size={22} />
      {/* paid participant note */}
      <Text style={styles.disclaimerText}>
        <Text style={styles.disclaimerStrong}>{text.disclaimer} </Text>
        {message}
      </Text>
    </View>
  );
}

// real video links are exposed as actions
export function SupportCards({ supportVideo, trustItems }) {
  return (
    <View style={styles.supportRow}>
      {/* prize video */}
      <Pressable
        style={styles.supportCard}
        onPress={() => Alert.alert(supportVideo.title, supportVideo.videoUrl)}
      >
        <View style={styles.playBox}>
          <Play color={colors.surface} size={22} fill={colors.surface} />
        </View>
        <View style={styles.supportCopy}>
          <Text style={styles.supportTitle}>{supportVideo.title}</Text>
          <Text style={styles.supportSub}>{supportVideo.subtitle}</Text>
        </View>
      </Pressable>

      <Card style={styles.trustCard}>
        {trustItems.map((item, index) => {
          const Icon = index === 0 ? ShieldCheck : LockKeyhole;

          return (
            <View key={`${item.label}-${item.value}`} style={styles.trustItem}>
              {/* trust badge */}
              <Icon color={colors.ink} size={25} />
              <View style={styles.trustCopy}>
                <Text style={styles.trustLabel}>{item.label}</Text>
                <Text style={styles.trustValue}>{item.value}</Text>
              </View>
            </View>
          );
        })}
      </Card>
    </View>
  );
}

// referral copy updates the device clipboard
export function ReferralCard({ referral, text, fill }) {
  const copyLink = async () => {
    await Clipboard.setStringAsync(referral.url);
    Alert.alert('Copied', 'Referral link copied to clipboard.');
  };

  return (
    <LinearGradient
      colors={['#e1f9ec', '#eafaf1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.referral}
    >
      <Megaphone color={colors.teal} size={42} />
      {/* referral link */}
      <View style={styles.referralCopy}>
        <Text style={styles.referralTitle}>{referral.discountText}</Text>
        <View style={styles.linkRow}>
          <Text numberOfLines={1} style={styles.linkText}>{referral.url}</Text>
          <Pressable style={styles.copyButton} onPress={copyLink}>
            <Copy color={colors.teal} size={16} />
            <Text style={styles.copyText}>{text.copyLink}</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.referralAction}>
        <ActionButton label={text.referNow} onPress={copyLink} style={styles.referButton} />
        <Text style={styles.earnText}>{fill(text.earnEverySignup, { amount: referral.rewardPerSignup })}</Text>
      </View>
    </LinearGradient>
  );
}

// compact row for social proof
export function TestimonialRow({ summary }) {
  return (
    <Pressable style={styles.testimonial}>
      <MessageCircle color={colors.ink} size={27} />
      {/* testimonial link */}
      <View style={styles.testimonialCopy}>
        <Text style={styles.testimonialTitle}>{summary.title}</Text>
        <Text style={styles.testimonialSub}>{summary.subtitle}</Text>
      </View>
      <ChevronRight color={colors.ink} size={24} />
    </Pressable>
  );
}

// ad area stays explicit for future inventory
export function AdSlot({ text }) {
  return (
    <View style={styles.ad}>
      <Megaphone color={colors.muted} size={21} />
      <Text style={styles.adText}>{text.adHere}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  disclaimer: {
    marginHorizontal: 18,
    marginTop: 12,
    minHeight: 42,
    paddingHorizontal: 18,
    borderRadius: radius.sm,
    backgroundColor: colors.tealLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  disclaimerText: {
    flex: 1,
    color: colors.ink,
    fontSize: 13,
    lineHeight: 18
  },
  disclaimerStrong: {
    color: colors.teal,
    fontWeight: '900'
  },
  supportRow: {
    marginTop: 12,
    marginHorizontal: 18,
    flexDirection: 'row',
    gap: 10
  },
  supportCard: {
    flex: 1,
    minHeight: 92,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center'
  },
  playBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center'
  },
  supportCopy: {
    flex: 1,
    marginLeft: 12
  },
  supportTitle: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900'
  },
  supportSub: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700'
  },
  trustCard: {
    flex: 1,
    marginHorizontal: 0,
    marginTop: 0,
    justifyContent: 'center'
  },
  trustItem: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center'
  },
  trustCopy: {
    flex: 1,
    marginLeft: 10
  },
  trustLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800'
  },
  trustValue: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700'
  },
  referral: {
    marginHorizontal: 18,
    marginTop: 12,
    minHeight: 88,
    borderRadius: radius.md,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  referralCopy: {
    flex: 1.4
  },
  referralTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900'
  },
  linkRow: {
    marginTop: 9,
    height: 38,
    flexDirection: 'row'
  },
  linkText: {
    flex: 1,
    paddingHorizontal: 11,
    lineHeight: 38,
    color: colors.teal,
    borderWidth: 1,
    borderColor: '#b9dbe0',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    backgroundColor: colors.surface
  },
  copyButton: {
    paddingHorizontal: 10,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#b9dbe0',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  copyText: {
    color: colors.teal,
    fontSize: 12,
    fontWeight: '900'
  },
  referralAction: {
    width: 170,
    alignItems: 'stretch'
  },
  referButton: {
    minHeight: 46
  },
  earnText: {
    marginTop: 8,
    color: colors.teal,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '700'
  },
  testimonial: {
    marginHorizontal: 18,
    marginTop: 12,
    minHeight: 64,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center'
  },
  testimonialCopy: {
    flex: 1,
    marginLeft: 14
  },
  testimonialTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900'
  },
  testimonialSub: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700'
  },
  ad: {
    marginHorizontal: 18,
    marginTop: 12,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#b8c5df',
    backgroundColor: '#fbfdff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9
  },
  adText: {
    color: colors.muted,
    fontWeight: '900'
  }
});
