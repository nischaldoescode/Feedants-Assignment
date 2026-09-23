// submission sheet
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/spacing';
import { isValidSubmissionUrl } from '../../utils/submissionUrl';
import { ActionButton } from './Shared';

// lightweight form for upload and update flows
export function SubmissionSheet({ visible, existingSubmission, busy, text, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) {
      return;
    }

    setTitle(existingSubmission?.title || '');
    setVideoUrl(existingSubmission?.videoUrl || '');
    setNotes(existingSubmission?.notes || '');
    setError('');
  }, [visible, existingSubmission]);

  const save = async () => {
    if (title.trim().length < 3) {
      setError(text.titleError);
      return;
    }

    if (!isValidSubmissionUrl(videoUrl)) {
      setError(text.urlError);
      return;
    }

    await onSubmit({
      title: title.trim(),
      videoUrl: videoUrl.trim(),
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <Pressable style={styles.scrim} onPress={onClose} />
        <View style={styles.sheet}>
          {/* sheet heading */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {existingSubmission ? text.updateSubmission : text.uploadSubmission}
            </Text>
            <Pressable style={styles.close} onPress={onClose}>
              <X color={colors.ink} size={22} />
            </Pressable>
          </View>

          {/* entry title */}
          <Text style={styles.label}>{text.performanceTitle}</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Kathak teen taal performance"
            placeholderTextColor={colors.softMuted}
            style={styles.input}
          />

          {/* video url */}
          <Text style={styles.label}>{text.videoLink}</Text>
          <TextInput
            value={videoUrl}
            onChangeText={setVideoUrl}
            placeholder="https://..."
            placeholderTextColor={colors.softMuted}
            autoCapitalize="none"
            keyboardType="url"
            style={styles.input}
          />

          {/* judge notes */}
          <Text style={styles.label}>{text.notesForJudge}</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Short note about raag, taal, or costume"
            placeholderTextColor={colors.softMuted}
            multiline
            style={[styles.input, styles.notes]}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <ActionButton
            label={existingSubmission ? text.updateEntry : text.submitEntry}
            busy={busy}
            onPress={save}
            style={styles.submit}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 22, 58, 0.28)'
  },
  sheet: {
    padding: 18,
    paddingBottom: 24,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: colors.surface
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900'
  },
  close: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft
  },
  label: {
    marginTop: 16,
    marginBottom: 7,
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900'
  },
  input: {
    minHeight: 48,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 13,
    color: colors.ink,
    backgroundColor: '#fbfcff',
    fontWeight: '700'
  },
  notes: {
    minHeight: 92,
    paddingTop: 12,
    textAlignVertical: 'top'
  },
  error: {
    marginTop: 12,
    color: colors.danger,
    fontWeight: '800'
  },
  submit: {
    marginTop: 18
  }
});
