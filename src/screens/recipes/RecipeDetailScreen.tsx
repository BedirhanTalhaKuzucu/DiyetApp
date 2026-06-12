import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme/theme';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { Card } from '../../components/cards/Card';
import { mockRecipes, dietitianProfile } from '../../data/mockData';
import { useTracking } from '../../context/TrackingContext';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeDetail'>;

export const RecipeDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const { t } = useTranslation();
  const recipe = mockRecipes.find((r) => r.id === recipeId) || mockRecipes[0];
  const { completedRecipes, toggleRecipe } = useTracking();
  const isLogged = completedRecipes.includes(recipe.id);

  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    Alert.alert(t('common.share'), `${recipe.titleTr} tarifi paylaşıldı!`);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.navigationHeader}>
        <Pressable onPress={() => navigation.goBack()} style={styles.navButton}>
          <Text style={styles.navButtonText}>←</Text>
        </Pressable>
        <Text style={styles.navTitle} numberOfLines={1}>{t('common.appName')}</Text>
        <View style={styles.headerRight}>
          <Pressable onPress={handleShare} style={styles.actionIconButton}>
            <Text style={styles.actionIcon}>🔗</Text>
          </Pressable>
          <Pressable onPress={handleSave} style={styles.actionIconButton}>
            <Text style={styles.actionIcon}>{isSaved ? '❤️' : '🤍'}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Large Food Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: recipe.imagePlaceholder }}
            style={styles.heroImage}
            contentFit="cover"
          />
        </View>

        <View style={styles.contentContainer}>
          {/* Main Info */}
          <Text style={styles.category}>{recipe.categoryTr}</Text>
          <Text style={styles.title}>{recipe.titleTr}</Text>

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('common.calories')}</Text>
              <Text style={styles.statVal}>{recipe.calories} {t('common.kcal')}</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('common.prepTime')}</Text>
              <Text style={styles.statVal}>{recipe.prepTime} {t('common.mins')}</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('common.difficulty')}</Text>
              <Text style={styles.statVal}>{t(`common.${recipe.difficulty}`)}</Text>
            </View>
          </View>

          {/* Macronutrients Card */}
          <Card style={styles.macrosCard}>
            <Text style={styles.sectionHeaderLabel}>{t('recipes.macronutrients')}</Text>
            <View style={styles.macrosContainer}>
              <View style={styles.macroCircle}>
                <Text style={styles.macroValue}>{recipe.protein}g</Text>
                <Text style={styles.macroLabel}>{t('home.macros.protein')}</Text>
              </View>
              <View style={styles.macroCircle}>
                <Text style={styles.macroValue}>{recipe.carbs}g</Text>
                <Text style={styles.macroLabel}>{t('home.macros.carbs')}</Text>
              </View>
              <View style={styles.macroCircle}>
                <Text style={styles.macroValue}>{recipe.fat}g</Text>
                <Text style={styles.macroLabel}>{t('home.macros.fat')}</Text>
              </View>
            </View>
          </Card>

          {/* Dietitian Tip Box */}
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipIcon}>🍳</Text>
              <Text style={styles.tipTitle}>
                {t('recipes.dietitianTip', { dietitian: dietitianProfile.name.split(' ')[0] })}
              </Text>
            </View>
            <Text style={styles.tipText}>“{recipe.dietitianTipTr}”</Text>
          </View>

          {/* Ingredients Checklist */}
          <Text style={styles.sectionTitle}>{t('recipes.ingredients')}</Text>
          <View style={styles.ingredientsBox}>
            {recipe.ingredientsTr.map((ingredient, index) => (
              <Pressable
                key={index}
                onPress={() => toggleIngredient(index)}
                style={styles.checkRow}
              >
                <View style={[styles.checkbox, checkedIngredients[index] && styles.checkboxChecked]}>
                  {checkedIngredients[index] && <Text style={styles.checkText}>✓</Text>}
                </View>
                <Text
                  style={[
                    styles.ingredientLabel,
                    checkedIngredients[index] && styles.checkedIngredientLabel
                  ]}
                >
                  {ingredient}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Preparation steps */}
          <Text style={styles.sectionTitle}>{t('recipes.preparation')}</Text>
          <View style={styles.stepsBox}>
            {recipe.stepsTr.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <Text style={styles.stepNumber}>0{index + 1}</Text>
                <Text style={styles.stepDesc}>{step}</Text>
              </View>
            ))}
          </View>

          <PrimaryButton
            title={isLogged ? `${t('common.remove').toUpperCase()}` : `${t('home.logMeal').toUpperCase()}`}
            onPress={() => {
              toggleRecipe(recipe.id);
              Alert.alert(
                isLogged ? t('common.remove') : t('common.added'),
                isLogged
                  ? `${recipe.titleTr} günlüğünüzden çıkarıldı!`
                  : `${recipe.titleTr} günlüğünüze eklendi!`
              );
            }}
            style={[
              styles.logRecipeBtn,
              isLogged && styles.logRecipeBtnActive
            ]}
            textStyle={isLogged ? styles.logRecipeBtnTextActive : undefined}
          />

          <PrimaryButton
            title={t('common.startCooking')}
            onPress={() => Alert.alert(t('common.startCooking'), `${recipe.titleTr} pişirme moduna geçildi!`)}
            style={styles.cookingBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  navButtonText: {
    fontSize: 18,
    color: theme.colors.textDark,
  },
  navTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionIconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionIcon: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 250,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: theme.spacing.lg,
  },
  category: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  statVal: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.border,
  },
  macrosCard: {
    marginVertical: theme.spacing.sm,
  },
  sectionHeaderLabel: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroValue: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  macroLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  tipCard: {
    backgroundColor: '#FAF0E6',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accentGoldDark,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  tipIcon: {
    fontSize: 18,
  },
  tipTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.accentGoldDark,
  },
  tipText: {
    fontSize: theme.typography.sizes.sm,
    fontStyle: 'italic',
    color: theme.colors.textDark,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  ingredientsBox: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1.5,
    borderColor: theme.colors.textMuted,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkText: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  ingredientLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textDark,
  },
  checkedIngredientLabel: {
    textDecorationLine: 'line-through',
    color: theme.colors.textMuted,
  },
  stepsBox: {
    gap: theme.spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  stepNumber: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.black,
    color: theme.colors.primary,
    opacity: 0.3,
  },
  stepDesc: {
    flex: 1,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textDark,
    lineHeight: 20,
  },
  cookingBtn: {
    marginBottom: theme.spacing.xl,
  },
  logRecipeBtn: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
  },
  logRecipeBtnActive: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  logRecipeBtnTextActive: {
    color: theme.colors.primary,
  },
});
export default RecipeDetailScreen;
