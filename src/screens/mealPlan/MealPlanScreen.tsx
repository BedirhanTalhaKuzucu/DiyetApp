import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../../types/navigation';
import { theme } from '../../theme/theme';
import { MealCard } from '../../components/cards/MealCard';
import { mockMeals } from '../../data/mockData';
import { useTracking } from '../../context/TrackingContext';

type MealsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Plans'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: MealsScreenNavigationProp;
}

const recipeIdMap: Record<string, string> = {
  m1: 'r2', // Breakfast -> Avocado & Egg Rye Toast (r2)
  m2: 'r1', // Lunch -> Roasted Chickpea Salad (r1)
  m3: 'r3', // Dinner -> Grilled Salmon & Asparagus (r3)
  m4: 'r1', // Snack -> Chickpea salad fallback
};

export const MealPlanScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const { completedMeals, toggleMeal } = useTracking();
  const weeks = [1, 2, 3, 4];

  const handleMealPress = (mealId: string, isPremium: boolean) => {
    if (isPremium) {
      Alert.alert(t('common.premiumAlertTitle'), t('common.premiumAlertMessage'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.unlock'), onPress: () => navigation.navigate('Premium') }
      ]);
    } else {
      const recipeId = recipeIdMap[mealId] || 'r1';
      navigation.navigate('RecipeDetail', { recipeId });
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>{t('meals.weekSelector')}</Text>
          {/* Week Selector tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekScroll}>
            {weeks.map((week) => (
              <Pressable
                key={week}
                onPress={() => setSelectedWeek(week)}
                style={[
                  styles.weekTab,
                  selectedWeek === week && styles.activeWeekTab
                ]}
              >
                <Text
                  style={[
                    styles.weekTabText,
                    selectedWeek === week && styles.activeWeekTabText
                  ]}
                >
                  {week}. Hafta
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.mealsList}>
          {mockMeals.map((meal) => {
            // Alternate meal locks depending on week selector for demo variation
            const isMealLocked = meal.isPremium || (selectedWeek > 1 && meal.type !== 'breakfast');
            const isAdded = completedMeals.includes(meal.id);

            return (
              <View key={meal.id} style={styles.mealSection}>
                <Text style={styles.sectionTitle}>{t(`meals.${meal.type}`)}</Text>
                <MealCard
                  name={meal.nameTr}
                  calories={meal.calories}
                  prepTime={meal.prepTime}
                  imageUri={meal.imagePlaceholder}
                  isPremium={isMealLocked}
                  typeLabel={t(`meals.${meal.type}`)}
                  onPress={() => handleMealPress(meal.id, isMealLocked)}
                  onAddPress={() => toggleMeal(meal.id)}
                  isAdded={isAdded}
                  addLabel={t('common.add')}
                  addedLabel={t('common.added')}
                  premiumLabel={t('common.premiumBadge')}
                  kcalLabel={t('common.kcal')}
                  minsLabel={t('common.mins')}
                />
              </View>
            );
          })}

          <Pressable style={styles.subscribeCTA} onPress={() => navigation.navigate('Premium')}>
            <Text style={styles.ctaTitle}>{t('meals.subscribeCTA')}</Text>
            <Text style={styles.ctaButtonText}>{t('common.getStarted')} →</Text>
          </Pressable>

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
    marginBottom: theme.spacing.sm,
  },
  weekScroll: {
    flexDirection: 'row',
  },
  weekTab: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeWeekTab: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  weekTabText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textMuted,
  },
  activeWeekTabText: {
    color: theme.colors.white,
  },
  mealsList: {
    flex: 1,
  },
  mealSection: {
    marginVertical: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    marginTop: theme.spacing.xs,
    marginLeft: 2,
  },
  subscribeCTA: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.colors.primary,
  },
  ctaTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  ctaButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default MealPlanScreen;
