import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme/theme';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { SelectableGoalCard } from '../../components/cards/SelectableGoalCard';
import { mockGoals } from '../../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'GoalSelection'>;

export const GoalSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedGoal, setSelectedGoal] = useState<string>('lose_weight');

  const handleContinue = () => {
    navigation.replace('MainApp');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.badgeText}>{t('profile.weeklyFocus')}</Text>
          <Text style={styles.title}>{t('goals.title')}</Text>
          <Text style={styles.subtitle}>{t('goals.subtitle')}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollList}>
          {mockGoals.map((goal) => (
            <SelectableGoalCard
              key={goal.id}
              title={t(`${goal.translationKey}.title`)}
              subtitle={t(`${goal.translationKey}.desc`)}
              selected={selectedGoal === goal.id}
              iconName={goal.icon}
              onPress={() => setSelectedGoal(goal.id)}
            />
          ))}

          {/* Decorative food plate image at the bottom to match the design screenshot */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=500&auto=format&fit=crop' }}
              style={styles.bottomDecorativeImage}
              contentFit="cover"
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            title={t('common.continue')}
            onPress={handleContinue}
            hasArrow
          />
          <Text style={styles.footerNote}>
            Yolculuğunuza devam etmek için bir hedef belirleyin.
          </Text>
        </View>
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
    paddingBottom: theme.spacing.md,
  },
  header: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  badgeText: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.border,
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
    lineHeight: 18,
  },
  scrollList: {
    flex: 1,
  },
  imageContainer: {
    height: 180,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.light,
  },
  bottomDecorativeImage: {
    width: '100%',
    height: '100%',
  },
  footer: {
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  footerNote: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
});
export default GoalSelectionScreen;
