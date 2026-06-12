import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { Card } from '../../components/cards/Card';
import { useTracking } from '../../context/TrackingContext';
import { Challenge } from '../../types/meal';

export const ChallengesScreen: React.FC = () => {
  const { t } = useTranslation();
  const { challenges, enrollChallenge, leaveChallenge } = useTracking();

  const enrolledChallenges = challenges.filter(ch => ch.enrolled);
  const availableChallenges = challenges.filter(ch => !ch.enrolled);

  const renderChallengeCard = (challenge: Challenge, isEnrolled: boolean) => {
    const progress = Math.round((challenge.current / challenge.target) * 100);

    return (
      <Card key={challenge.id} style={styles.challengeCard}>
        <View style={styles.challengeContent}>
          <View style={[styles.challengeIcon, { backgroundColor: challenge.color + '20' }]}>
            <Ionicons name={challenge.icon as any} size={24} color={challenge.color} />
          </View>

          <View style={styles.challengeInfo}>
            <Text style={styles.challengeName}>{challenge.name}</Text>
            <Text style={styles.challengeDesc}>{challenge.description}</Text>

            {isEnrolled && (
              <>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFg, { width: `${Math.min(progress, 100)}%`, backgroundColor: challenge.color }]} />
                </View>
                <Text style={styles.progressText}>{challenge.current} / {challenge.target} {challenge.unit}</Text>
              </>
            )}
          </View>

          <Pressable
            style={[
              styles.actionButton,
              { backgroundColor: challenge.color + '20' }
            ]}
            onPress={() => {
              if (isEnrolled) {
                leaveChallenge(challenge.id);
              } else {
                enrollChallenge(challenge.id);
              }
            }}
          >
            <Ionicons
              name={isEnrolled ? 'checkmark' : 'add'}
              size={20}
              color={challenge.color}
            />
          </Pressable>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>{t('challenges.title')}</Text>

        {/* Enrolled Challenges */}
        {enrolledChallenges.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t('challenges.enrolled')}</Text>
            {enrolledChallenges.map(ch => renderChallengeCard(ch, true))}
          </>
        )}

        {/* Available Challenges */}
        {availableChallenges.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: theme.spacing.lg }]}>{t('challenges.available')}</Text>
            {availableChallenges.map(ch => renderChallengeCard(ch, false))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.textDark,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textDark,
    marginBottom: theme.spacing.md,
  },
  challengeCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  challengeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  challengeIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeInfo: {
    flex: 1,
  },
  challengeName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  challengeDesc: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  progressBg: {
    height: 4,
    backgroundColor: '#E2E8B9',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFg: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChallengesScreen;
