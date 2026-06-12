import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../../types/navigation';
import { theme } from '../../theme/theme';
import { RecipeCard } from '../../components/cards/RecipeCard';
import { mockRecipes } from '../../data/mockData';

type RecipesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Recipes'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: RecipesScreenNavigationProp;
}

export const RecipesScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  const handleRecipePress = (recipeId: string, isPremium: boolean) => {
    if (isPremium) {
      navigation.navigate('Premium');
    } else {
      navigation.navigate('RecipeDetail', { recipeId });
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>{t('navigation.recipes')}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.recipesList}>
          {mockRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              title={recipe.titleTr}
              category={recipe.categoryTr}
              calories={recipe.calories}
              prepTime={recipe.prepTime}
              difficulty={t(`common.${recipe.difficulty}`)}
              imageUri={recipe.imagePlaceholder}
              isPremium={recipe.isPremium}
              onPress={() => handleRecipePress(recipe.id, recipe.isPremium)}
              premiumLabel={t('common.premiumBadge')}
              kcalLabel={t('common.kcal')}
              minsLabel={t('common.mins')}
              difficultyLabel={t('common.difficulty')}
            />
          ))}
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
  recipesList: {
    flex: 1,
  },
  bottomSpacing: {
    height: 40,
  },
});
export default RecipesScreen;
