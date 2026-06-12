import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable, Alert, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../../types/navigation';
import { theme } from '../../theme/theme';
import { Card } from '../../components/cards/Card';
import { mockMeals, dietitianProfile } from '../../data/mockData';
import { useTracking } from '../../context/TrackingContext';
import { AddMealModal } from '../../components/modals/AddMealModal';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  // Connect to shared tracking state
  const {
    maxCalories,
    loggedCalories,
    proteinTarget,
    proteinCurrent,
    carbsTarget,
    carbsCurrent,
    fatTarget,
    fatCurrent,
    waterTarget,
    waterCurrent,
    incrementWater,
    decrementWater,
    completedMeals,
    loggedMeals,
    removeMeal,
    challenges
  } = useTracking();

  const [isAddMealModalVisible, setIsAddMealModalVisible] = useState(false);

  const handleQuickAction = (action: string) => {
    if (action === 'recipes') {
      navigation.navigate('Recipes');
    } else if (action === 'water') {
      incrementWater();
    } else if (action === 'challenges') {
      navigation.navigate('Challenges');
    } else if (action === 'log_meal') {
      setIsAddMealModalVisible(true);
    } else {
      Alert.alert(t('common.premiumAlertTitle'), t('common.premiumAlertMessage'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.unlock'), onPress: () => navigation.navigate('Premium') }
      ]);
    }
  };

  const getFormattedDate = () => {
    const now = new Date();
    const daysTr = ['PAZAR', 'PAZARTESİ', 'SALI', 'ÇARŞAMBA', 'PERŞEMBE', 'CUMA', 'CUMARTESİ'];
    const daysEn = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const monthsTr = ['OCA', 'ŞUB', 'MAR', 'NİS', 'MAY', 'HAZ', 'TEM', 'AĞU', 'EYL', 'EKİ', 'KAS', 'ARA'];
    const monthsEn = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    const isTr = i18n.language === 'tr';
    const dayName = isTr ? daysTr[now.getDay()] : daysEn[now.getDay()];
    const monthName = isTr ? monthsTr[now.getMonth()] : monthsEn[now.getMonth()];
    const day = now.getDate();
    
    return `${dayName}, ${monthName} ${day}`;
  };

  const percentDone = Math.round((loggedCalories / maxCalories) * 100);

  // Dynamic borders to simulate circular progress ring
  const getCircleBorderStyles = (percent: number) => {
    const activeColor = theme.colors.primary;
    const inactiveColor = '#E2E8B9';
    return {
      borderTopColor: percent >= 12.5 ? activeColor : inactiveColor,
      borderRightColor: percent >= 37.5 ? activeColor : inactiveColor,
      borderBottomColor: percent >= 62.5 ? activeColor : inactiveColor,
      borderLeftColor: percent >= 87.5 ? activeColor : inactiveColor,
    };
  };

  // Mock description subtexts for food cards, matching premium style
  const getMealDescription = (mealType: string) => {
    const isTr = i18n.language === 'tr';
    if (mealType === 'breakfast') {
      return isTr ? 'Ekşi mayalı çavdar ekmeği, ezilmiş avokado, haşlanmış yumurta' : 'Sourdough rye toast, mashed avocado, poached eggs';
    } else if (mealType === 'lunch') {
      return isTr ? 'Kinoa, fırınlanmış nohut, avokado ve özel tahin sosu' : 'Quinoa, roasted chickpeas, avocado and tahini dressing';
    }
    return '';
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        
        {/* Top Header Section */}
        <View style={styles.topHeader}>
          <Pressable onPress={() => navigation.navigate('Profile')}>
            <Image 
              source={{ uri: dietitianProfile.imagePlaceholder }} 
              style={styles.avatar} 
            />
          </Pressable>
          <Text style={styles.brandTitle}>Nourish</Text>
          <View style={styles.badgeWrapper}>
            <Ionicons name="ribbon-sharp" size={18} color={theme.colors.primary} />
          </View>
        </View>

        {/* Date and Welcoming */}
        <View style={styles.welcomeSection}>
          <Text style={styles.dateText}>{getFormattedDate()}</Text>
          <Text style={styles.greetingText}>{t('home.goodMorning', { name: 'Ayşe' })}</Text>
        </View>

        {/* Calorie Tracker Card (Daily Goal) */}
        <Card style={styles.dailyGoalCard}>
          <View style={styles.goalLeft}>
            <Text style={styles.goalTitle}>{t('home.dailyGoal')}</Text>
            
            <View style={styles.calorieInfoRow}>
              <Text style={styles.calorieCurrent}>{loggedCalories.toLocaleString()}</Text>
              <Text style={styles.calorieDivider}> / </Text>
              <Text style={styles.calorieTarget}>{t('common.calories')} {maxCalories.toLocaleString()}</Text>
            </View>
            
            {/* Simple progress bar under calories */}
            <View style={styles.goalProgressBg}>
              <View style={[styles.goalProgressFg, { width: `${Math.min(percentDone, 100)}%` }]} />
            </View>

            {/* Macros Row */}
            <View style={styles.macrosRow}>
              <View style={styles.macroCol}>
                <Text style={styles.macroLabel}>{t('home.macros.protein')}</Text>
                <Text style={styles.macroVal}>{proteinCurrent}g / {proteinTarget}g</Text>
              </View>
              <View style={styles.macroCol}>
                <Text style={styles.macroLabel}>{t('home.macros.carbs')}</Text>
                <Text style={styles.macroVal}>{carbsCurrent}g / {carbsTarget}g</Text>
              </View>
              <View style={styles.macroCol}>
                <Text style={styles.macroLabel}>{t('home.macros.fat')}</Text>
                <Text style={styles.macroVal}>{fatCurrent}g / {fatTarget}g</Text>
              </View>
            </View>
          </View>

          {/* Right Side Circular Progress */}
          <View style={styles.goalRight}>
            <View style={[styles.circleRing, getCircleBorderStyles(percentDone)]}>
              <Text style={styles.circleNumber}>{percentDone}%</Text>
              <Text style={styles.circleLabel}>{t('home.done')}</Text>
            </View>
          </View>
        </Card>

        {/* Hydration Section */}
        <View style={styles.hydrationHeader}>
          <Text style={styles.sectionTitle}>{t('home.hydration')}</Text>
          <Text style={styles.hydrationValue}>{waterCurrent} / {waterTarget} {t('home.waterUnit')}</Text>
        </View>
        <Card style={styles.hydrationCard}>
          <View style={styles.cupsContainer}>
            <View style={styles.cupsList}>
              {Array.from({ length: 8 }).map((_, index) => {
                const isFilled = index < waterCurrent;
                return (
                  <View key={index} style={[styles.waterCupOutline, isFilled && styles.waterCupFilled]}>
                    <Ionicons 
                      name={isFilled ? "water" : "water-outline"} 
                      size={13} 
                      color={isFilled ? theme.colors.primary : theme.colors.textMuted} 
                    />
                  </View>
                );
              })}
            </View>
            
            <View style={styles.waterControls}>
              <Pressable onPress={decrementWater} style={[styles.addWaterBtn, { backgroundColor: '#C7CE9E', marginRight: 6 }]}>
                <Ionicons name="remove" size={16} color="white" />
              </Pressable>
              <Pressable onPress={incrementWater} style={styles.addWaterBtn}>
                <Ionicons name="add" size={16} color="white" />
              </Pressable>
            </View>
          </View>
        </Card>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
        <View style={styles.quickGrid}>
          <Pressable style={styles.quickCard} onPress={() => handleQuickAction('log_meal')}>
            <View style={styles.quickIconCircle}>
              <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.quickText}>{t('home.logMeal')}</Text>
          </Pressable>
          <Pressable style={styles.quickCard} onPress={() => handleQuickAction('water')}>
            <View style={styles.quickIconCircle}>
              <Ionicons name="water-outline" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.quickText}>{t('home.trackWater')}</Text>
          </Pressable>
          <Pressable style={styles.quickCard} onPress={() => handleQuickAction('recipes')}>
            <View style={styles.quickIconCircle}>
              <Ionicons name="book-outline" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.quickText}>{t('home.viewRecipes')}</Text>
          </Pressable>
          <Pressable style={styles.quickCard} onPress={() => handleQuickAction('challenges')}>
            <View style={styles.quickIconCircle}>
              <Ionicons name="flash-outline" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.quickText}>{t('home.dailyChallenge')}</Text>
          </Pressable>
        </View>

        {/* Today's Meal Plan Preview */}
        <View style={styles.mealPlanHeader}>
          <Text style={styles.sectionTitle}>{t('home.todayPlan')}</Text>
          <Pressable onPress={() => navigation.navigate('Plans')}>
            <Text style={styles.editBtnText}>{t('home.edit')}</Text>
          </Pressable>
        </View>

        {mockMeals.slice(0, 2).map((meal) => {
          const isAdded = completedMeals.includes(meal.id);
          return (
            <Pressable
              key={meal.id}
              onPress={() => {
                if (meal.isPremium) {
                  navigation.navigate('Premium');
                } else {
                  const recipeId = meal.id === 'm1' ? 'r2' : 'r1';
                  navigation.navigate('RecipeDetail', { recipeId });
                }
              }}
              style={({ pressed }) => [
                styles.foodCard,
                pressed && styles.foodCardPressed
              ]}
            >
              <Image
                source={{ uri: meal.imagePlaceholder }}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
              />
              {/* Dark tint overlay for reading white text */}
              <View style={styles.foodCardOverlay} />

              <View style={styles.foodCardContent}>
                <View style={styles.foodBadgeRow}>
                  <View style={styles.foodBadge}>
                    <Text style={styles.foodBadgeText}>
                      {t(`meals.${meal.type}`).toUpperCase()} • {meal.calories} {t('common.kcal').toUpperCase()}
                    </Text>
                  </View>
                  {isAdded && (
                    <View style={styles.addedCheckBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#A3C585" />
                      <Text style={styles.addedCheckText}>{t('common.added').toUpperCase()}</Text>
                    </View>
                  )}
                </View>

                <View>
                  <Text style={styles.foodTitle}>{meal.nameTr}</Text>
                  <Text style={styles.foodDesc}>{getMealDescription(meal.type)}</Text>
                </View>
              </View>
            </Pressable>
          );
        })}

        {/* Logged Meals - Eklenen Öğünler */}
        {loggedMeals.length > 0 && (
          <>
            <View style={styles.extrasHeader}>
              <Text style={styles.sectionTitle}>
                {t('home.todayPlan')} - Ekstralar
              </Text>
              <Text style={styles.extrasCount}>{loggedMeals.length}</Text>
            </View>
            {loggedMeals.map((loggedMeal) => (
              <Pressable
                key={loggedMeal.id}
                style={[
                  styles.loggedMealCard,
                  loggedMeal.photo && { overflow: 'hidden' }
                ]}
              >
                {loggedMeal.photo ? (
                  <>
                    <Image
                      source={{ uri: loggedMeal.photo }}
                      style={StyleSheet.absoluteFillObject}
                      contentFit="cover"
                    />
                    <View style={styles.loggedMealOverlay} />
                  </>
                ) : (
                  <>
                    <View style={[StyleSheet.absoluteFillObject, styles.loggedMealDefaultBg]} />
                    <View style={styles.defaultBgContent}>
                      <Ionicons name="restaurant-outline" size={50} color="rgba(255, 255, 255, 0.25)" />
                    </View>
                    <View style={styles.loggedMealOverlay} />
                  </>
                )}

                <View style={styles.loggedMealContentInner}>
                  <View style={styles.loggedMealInfo}>
                    <Text style={styles.loggedMealName}>{loggedMeal.name}</Text>
                    <Text style={styles.loggedMealMacros}>
                      {loggedMeal.calories} kcal • P:{loggedMeal.protein}g C:{loggedMeal.carbs}g F:{loggedMeal.fat}g
                    </Text>
                    <Text style={styles.loggedMealPortion}>{loggedMeal.portion}</Text>
                  </View>
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => removeMeal(loggedMeal.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </>
        )}

        {/* Challenge Progress - Mücadele İlerlemesi */}
        {(() => {
          const enrolledChallenges = challenges.filter(ch => ch.enrolled);
          return enrolledChallenges.length > 0 ? (
            <>
              <View style={styles.challengeProgressHeader}>
                <Text style={styles.sectionTitle}>{t('challenges.title')}</Text>
                <Pressable onPress={() => navigation.navigate('Challenges')}>
                  <Text style={styles.editBtnText}>{t('challenges.viewAll')}</Text>
                </Pressable>
              </View>
              {enrolledChallenges.slice(0, 2).map((challenge) => {
                const progress = Math.round((challenge.current / challenge.target) * 100);
                return (
                  <Card key={challenge.id} style={styles.challengeProgressCard}>
                    <View style={styles.challengeProgressContent}>
                      <View style={[styles.challengeProgressIcon, { backgroundColor: challenge.color + '20' }]}>
                        <Ionicons name={challenge.icon as any} size={20} color={challenge.color} />
                      </View>

                      <View style={styles.challengeProgressInfo}>
                        <Text style={styles.challengeProgressName}>{challenge.name}</Text>
                        <View style={styles.challengeProgressBg}>
                          <View style={[styles.challengeProgressFg, { width: `${Math.min(progress, 100)}%`, backgroundColor: challenge.color }]} />
                        </View>
                        <Text style={styles.challengeProgressText}>{challenge.current} / {challenge.target} {challenge.unit}</Text>
                      </View>

                      <Text style={styles.challengeProgressPercent}>{progress}%</Text>
                    </View>
                  </Card>
                );
              })}
            </>
          ) : null;
        })()}

        {/* Go Premium Card */}
        <Card style={styles.premiumCard}>
          {/* Faint star decorative background */}
          <View style={styles.premiumStarBg}>
            <Ionicons name="star-outline" size={100} color={theme.colors.primary} style={{ opacity: 0.05 }} />
          </View>

          <View style={styles.premiumContent}>
            <Text style={styles.premiumTitle}>{t('home.goPremiumTitle')}</Text>
            <Text style={styles.premiumDesc}>{t('home.goPremiumDesc')}</Text>
            <Pressable onPress={() => navigation.navigate('Premium')} style={styles.premiumBtn}>
              <Text style={styles.premiumBtnText}>{t('home.upgradeNow')}</Text>
            </Pressable>
          </View>
        </Card>

        {/* Add Meal Modal */}
        <AddMealModal
          visible={isAddMealModalVisible}
          onClose={() => setIsAddMealModalVisible(false)}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.lg,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? theme.spacing.md : theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.primary,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  badgeWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EEF2D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeSection: {
    marginBottom: theme.spacing.lg,
  },
  dateText: {
    fontSize: 10,
    letterSpacing: 1,
    color: theme.colors.textMuted,
    fontWeight: '700',
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.textDark,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  dailyGoalCard: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    borderRadius: 24,
    backgroundColor: '#EEF2D3',
    borderWidth: 0,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  goalLeft: {
    flex: 1.5,
  },
  goalRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  goalTitle: {
    fontSize: 10,
    letterSpacing: 0.5,
    fontWeight: '800',
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  calorieInfoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.xs,
  },
  calorieCurrent: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textDark,
  },
  calorieDivider: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  calorieTarget: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  goalProgressBg: {
    height: 3,
    backgroundColor: '#D7DCBB',
    borderRadius: 1.5,
    width: '90%',
    marginBottom: theme.spacing.md,
  },
  goalProgressFg: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 1.5,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
  },
  macroCol: {
    marginRight: 2,
  },
  macroLabel: {
    fontSize: 9,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  macroVal: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textDark,
  },
  circleRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  circleNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textDark,
  },
  circleLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
  },
  hydrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: theme.colors.textDark,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: theme.spacing.sm,
  },
  hydrationValue: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  hydrationCard: {
    padding: theme.spacing.md,
    borderRadius: 20,
    backgroundColor: '#EEF2D3',
    borderWidth: 0,
    marginBottom: theme.spacing.xl,
  },
  cupsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cupsList: {
    flexDirection: 'row',
    gap: 6,
  },
  waterCupOutline: {
    width: 26,
    height: 30,
    borderWidth: 2,
    borderColor: '#C7CE9E',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  waterCupFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: '#DFE5C2',
  },
  waterControls: {
    flexDirection: 'row',
  },
  addWaterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.light,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  quickCard: {
    width: '48%',
    backgroundColor: '#EEF2D3',
    borderRadius: 20,
    padding: theme.spacing.md,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: 100,
  },
  quickIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textDark,
  },
  mealPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing.xs,
  },
  extrasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  extrasCount: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  foodCard: {
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    marginVertical: theme.spacing.sm,
    ...theme.shadows.medium,
  },
  foodCardPressed: {
    opacity: 0.95,
  },
  foodCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 37, 18, 0.45)', // beautiful dark green/olive tint overlay
  },
  foodCardContent: {
    ...StyleSheet.absoluteFillObject,
    padding: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  foodBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(30, 37, 18, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  addedCheckBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 37, 18, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  addedCheckText: {
    color: '#A3C585',
    fontSize: 8,
    fontWeight: '800',
  },
  foodBadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  foodTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 4,
  },
  foodDesc: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  premiumCard: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: 24,
    backgroundColor: '#E6DCCE', // gold/cream background
    borderWidth: 0,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
  },
  premiumStarBg: {
    position: 'absolute',
    right: -20,
    bottom: -20,
  },
  premiumContent: {
    zIndex: 1,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3E3425',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 6,
  },
  premiumDesc: {
    fontSize: 12,
    color: '#5C5243',
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: theme.spacing.md,
    paddingRight: 60,
  },
  premiumBtn: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  premiumBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  loggedMealCard: {
    height: 140,
    borderRadius: 24,
    overflow: 'hidden',
    marginVertical: theme.spacing.sm,
    ...theme.shadows.medium,
    marginBottom: theme.spacing.md,
  },
  loggedMealDefaultBg: {
    backgroundColor: '#C7CE9E',
  },
  defaultBgContent: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  loggedMealOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 37, 18, 0.45)',
  },
  loggedMealContentInner: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    padding: theme.spacing.lg,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loggedMealInfo: {
    flex: 1,
  },
  loggedMealName: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  loggedMealMacros: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: 4,
  },
  loggedMealPortion: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.md,
  },
  challengeProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  challengeProgressCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: 20,
    backgroundColor: '#F5F7EE',
  },
  challengeProgressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  challengeProgressIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeProgressInfo: {
    flex: 1,
  },
  challengeProgressName: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textDark,
    marginBottom: 6,
  },
  challengeProgressBg: {
    height: 4,
    backgroundColor: '#E2E8B9',
    borderRadius: 2,
    marginBottom: 4,
  },
  challengeProgressFg: {
    height: '100%',
    borderRadius: 2,
  },
  challengeProgressText: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  challengeProgressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textDark,
    minWidth: 35,
    textAlign: 'right',
  },
});

export default HomeScreen;
