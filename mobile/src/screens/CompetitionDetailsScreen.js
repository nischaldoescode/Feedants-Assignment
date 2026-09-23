// competition details screen
import React, { useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useCompetition } from '../hooks/useCompetition';
import { StatusState } from '../components/StatusState';
import { Header } from '../components/competition/Header';
import { HeroCard } from '../components/competition/HeroCard';
import { JudgeCard } from '../components/competition/JudgeCard';
import { CountdownBanner } from '../components/competition/CountdownBanner';
import { ImportantDates } from '../components/competition/ImportantDates';
import { WinnersCarousel } from '../components/competition/WinnersCarousel';
import { InfoTabs } from '../components/competition/InfoTabs';
import { RewardsPanel } from '../components/competition/RewardsPanel';
import {
  AdSlot,
  Disclaimer,
  ReferralCard,
  SupportCards,
  TestimonialRow
} from '../components/competition/UtilityCards';
import { SubmissionSheet } from '../components/competition/SubmissionSheet';
import { StickyActionBar } from '../components/competition/StickyActionBar';
import { BottomNav } from '../components/competition/BottomNav';
import { actionCopy, fill, localizeCompetition, pickCopy } from '../utils/i18n';

// compose the whole dynamic competition view
export function CompetitionDetailsScreen() {
  const { payload, loading, busy, error, reload, actions } = useCompetition();
  const [language, setLanguage] = useState('en');
  const [submissionOpen, setSubmissionOpen] = useState(false);

  if (!payload) {
    return <StatusState loading={loading} error={error} onRetry={reload} />;
  }

  const text = pickCopy(language);
  const { viewer, serverNow } = payload;
  const competition = localizeCompetition(payload.competition, language);
  const primaryAction = actionCopy(viewer.primaryAction, text);

  // the backend decides what this button means
  const runPrimaryAction = async () => {
    try {
      if (primaryAction.kind === 'register') {
        await actions.register({
          language,
          referralCode: competition.referral.code
        });
        Alert.alert(text.registeredTitle, text.registeredBody);
        return;
      }

      if (primaryAction.kind === 'upload_submission' || primaryAction.kind === 'update_submission') {
        setSubmissionOpen(true);
        return;
      }

      if (primaryAction.kind === 'view_results') {
        Alert.alert(text.resultsTitle, text.resultsBody);
        return;
      }

      if (primaryAction.kind === 'complete_payment') {
        Alert.alert(text.paymentTitle, text.paymentBody);
        return;
      }

      if (primaryAction.reason) {
        Alert.alert(primaryAction.label, primaryAction.reason);
      }
    } catch (requestError) {
      Alert.alert(text.actionFailed, requestError.message);
    }
  };

  // cancellation is available only when the api says so
  const cancelRegistration = () => {
    Alert.alert(
      text.cancelTitle,
      text.cancelBody,
      [
        { text: text.keepRegistration, style: 'cancel' },
        {
          text: text.cancelRegistration,
          style: 'destructive',
          onPress: async () => {
            try {
              await actions.cancel();
            } catch (requestError) {
              Alert.alert(text.cancellationFailed, requestError.message);
            }
          }
        }
      ]
    );
  };

  // save the entry and keep the sheet state simple
  const submitEntry = async (values) => {
    try {
      await actions.submit(values);
      Alert.alert(text.savedTitle, text.savedBody);
    } catch (requestError) {
      Alert.alert(text.actionFailed, requestError.message);
      throw requestError;
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Header language={language} text={text} onLanguageChange={setLanguage} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} tintColor={colors.teal} />}
        contentContainerStyle={styles.content}
      >
        {error && <InlineError message={error.message} />}

        <HeroCard competition={competition} viewer={viewer} text={text} fill={fill} />
        <JudgeCard judge={competition.judge} text={text} />
        <CountdownBanner competition={competition} serverNow={serverNow} text={text} />
        <ImportantDates timeline={competition.timeline} text={text} />
        <WinnersCarousel winners={competition.previousWinners} text={text} />
        <InfoTabs tabs={competition.tabs} />
        <RewardsPanel rewards={competition.rewards} text={text} />
        <Disclaimer message={competition.disclaimer} text={text} />
        <SupportCards supportVideo={competition.supportVideo} trustItems={competition.trustItems} />
        <ReferralCard referral={competition.referral} text={text} fill={fill} />
        <TestimonialRow summary={competition.testimonialSummary} />
        <AdSlot text={text} />
      </ScrollView>

      <StickyActionBar
        action={primaryAction}
        busy={busy}
        canCancel={viewer.canCancelRegistration}
        text={text}
        onPrimary={runPrimaryAction}
        onCancel={cancelRegistration}
      />
      <BottomNav text={text} />

      <SubmissionSheet
        visible={submissionOpen}
        busy={busy}
        existingSubmission={viewer.submission}
        text={text}
        onClose={() => setSubmissionOpen(false)}
        onSubmit={submitEntry}
      />
    </SafeAreaView>
  );
}

// show action errors without hiding stale data
function InlineError({ message }) {
  return (
    <View style={styles.inlineError}>
      <Text style={styles.inlineErrorText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface
  },
  content: {
    paddingBottom: 18
  },
  inlineError: {
    marginHorizontal: 18,
    marginBottom: 2,
    padding: 10,
    borderRadius: 9,
    backgroundColor: '#fff4f4',
    borderWidth: 1,
    borderColor: '#ffd5d5'
  },
  inlineErrorText: {
    color: colors.danger,
    fontWeight: '800'
  }
});
