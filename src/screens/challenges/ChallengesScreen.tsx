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
      <Pressable
        key={challenge.id}
        style={styles.challengeCard}
        onPress={() => {
          if (isEnrolled) {
            leaveChallenge(challenge.id);
          } else {
            enrollChallenge(challenge.id);
          }
        }}
      >
        <View style={[styles.challengeCardBg, { backgroundColor: challenge.color + '15' }]}>
          <View style={styles.challengeCardContent}>
            <View style={styles.challengeCardLeft}>
              <View style={[styles.challengeIconBg, { backgroundColor: challenge.color + '25' }]}>
                <Ionicons name={challenge.icon as any} size={28} color={challenge.color} />
              </View>

              <View style={styles.challengeCardInfo}>
                <Text style={styles.challengeName}>{challenge.name}</Text>
                <Text style={styles.challengeDesc}>{challenge.description}</Text>
              </View>
            </View>

            <View style={styles.challengeCardRight}>
              {isEnrolled ? (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFg, { width: `${Math.min(progress, 100)}%`, backgroundColor: challenge.color }]} />
                  </View>
                  <View style={styles.progressStats}>
                    <Text style={styles.progressPercent}>{progress}%</Text>
                    <Text style={styles.progressText}>{challenge.current}/{challenge.target}</Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.enrollButton, { backgroundColor: challenge.color }]}>
                  <Ionicons name="add" size={20} color="white" />
                </View>
              )}
            </View>
          </View>

          {isEnrolled && (
            <View style={styles.enrolledBadge}>
              <Ionicons name="checkmark-circle" size={16} color={challenge.color} />
              <Text style={[styles.enrolledText, { color: challenge.color }]}>Katılıldı</Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>{t('challenges.title')}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.challengesList}>
          {/* All Challenges */}
          {[...enrolledChallenges, ...availableChallenges].map(ch =>
            renderChallengeCard(ch, ch.enrolled)
          )}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    paddingVertical: theme.spacing.md,
  },
  appTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  challengesList: {
    flex: 1,
  },
  challengeCard: {
    marginBottom: theme.spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
  },
  challengeCardBg: {
    padding: theme.spacing.lg,
    borderRadius: 20,
  },
  challengeCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  challengeCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  challengeIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeCardInfo: {
    flex: 1,
  },
  challengeName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  challengeDesc: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginBottom: 0,
  },
  challengeCardRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  progressContainer: {
    width: 60,
    alignItems: 'flex-end',
    gap: 4,
  },
  progressBg: {
    width: 50,
    height: 4,
    backgroundColor: '#E2E8B9',
    borderRadius: 2,
  },
  progressFg: {
    height: '100%',
    borderRadius: 2,
  },
  progressStats: {
    alignItems: 'flex-end',
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textDark,
  },
  progressText: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  enrollButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enrolledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  enrolledText: {
    fontSize: 10,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ChallengesScreen;
