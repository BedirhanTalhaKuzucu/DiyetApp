import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable, Alert, Modal, TextInput, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../../types/navigation';
import { theme } from '../../theme/theme';
import { Card } from '../../components/cards/Card';
import { ProgressBar } from '../../components/progress/ProgressBar';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { useTracking } from '../../context/TrackingContext';

type TrackingScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Tracking'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: TrackingScreenNavigationProp;
}

export const TrackingScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  // Connect to shared local tracking state
  const {
    maxCalories,
    loggedCalories,
    proteinTarget,
    proteinCurrent,
    carbsTarget,
    carbsCurrent,
    fatTarget,
    fatCurrent,
    currentWeight,
    updateWeight,
    completedHabits,
    toggleHabit
  } = useTracking();

  // Weight editor state
  const [isWeightModalVisible, setIsWeightModalVisible] = useState<boolean>(false);
  const [weightInput, setWeightInput] = useState<string>(currentWeight.toString());

  const habitsList = [
    { id: 'water', key: 'tracking.habit_water' },
    { id: 'plan', key: 'tracking.habit_plan' },
    { id: 'walk', key: 'tracking.habit_walk' },
    { id: 'sugar', key: 'tracking.habit_sugar' }
  ];

  const handleUpdate = () => {
    Alert.alert(t('tracking.updateProgress'), t('common.saved'));
  };

  const handleOpenWeightModal = () => {
    setWeightInput(currentWeight.toString());
    setIsWeightModalVisible(true);
  };

  const handleSaveWeight = () => {
    const parsed = parseFloat(weightInput.replace(',', '.'));
    if (!isNaN(parsed) && parsed > 0) {
      updateWeight(parsed);
      setIsWeightModalVisible(false);
      Alert.alert(t('common.saved'), `${parsed} kg kaydedildi!`);
    } else {
      Alert.alert('Hata', 'Lütfen geçerli bir kilo değeri girin.');
    }
  };

  const percent = Math.round((loggedCalories / maxCalories) * 100);

  // Dynamic borders to simulate progress ring
  const getCircleBorderStyles = (percentValue: number) => {
    const activeColor = theme.colors.primary;
    const inactiveColor = '#E2E8B9';
    return {
      borderTopColor: percentValue >= 12.5 ? activeColor : inactiveColor,
      borderRightColor: percentValue >= 37.5 ? activeColor : inactiveColor,
      borderBottomColor: percentValue >= 62.5 ? activeColor : inactiveColor,
      borderLeftColor: percentValue >= 87.5 ? activeColor : inactiveColor,
    };
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>{t('navigation.track')}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          {/* Calorie Progress Ring */}
          <Card style={styles.ringCard}>
            <Text style={styles.cardTitle}>{t('tracking.calorieProgress')}</Text>
            <View style={styles.ringContainer}>
              <View style={[styles.ringOuter, getCircleBorderStyles(percent)]}>
                <View style={styles.ringInner}>
                  <Text style={styles.ringValue}>{loggedCalories.toLocaleString()}</Text>
                  <Text style={styles.ringTotal}>/ {maxCalories.toLocaleString()} kcal</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Macro Progress Bars */}
          <Card style={styles.macrosCard}>
            <SectionHeader title={t('tracking.macroProgress')} />
            <ProgressBar progress={Math.min(proteinCurrent / proteinTarget, 1.0)} label={`${t('home.macros.protein')} (${proteinCurrent}g / ${proteinTarget}g)`} color="#A3C585" />
            <ProgressBar progress={Math.min(carbsCurrent / carbsTarget, 1.0)} label={`${t('home.macros.carbs')} (${carbsCurrent}g / ${carbsTarget}g)`} color="#F6C585" />
            <ProgressBar progress={Math.min(fatCurrent / fatTarget, 1.0)} label={`${t('home.macros.fat')} (${fatCurrent}g / ${fatTarget}g)`} color="#E59A8F" />
          </Card>

          {/* Weight Chart Card (Pressable to log weight) */}
          <Pressable onPress={handleOpenWeightModal}>
            <Card style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.cardTitle}>{t('tracking.weightChart')}</Text>
                <Text style={styles.editLink}>{t('home.edit')}</Text>
              </View>
              <View style={styles.chartMockContainer}>
                <View style={styles.chartGrid}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <View key={i} style={styles.chartGridLine} />
                  ))}
                  {/* Simulated wave line for weight decline */}
                  <View style={styles.chartDotContainer}>
                    <View style={[styles.chartDot, { bottom: 50, left: '10%' }]} />
                    <View style={[styles.chartDot, { bottom: 42, left: '30%' }]} />
                    <View style={[styles.chartDot, { bottom: 35, left: '50%' }]} />
                    <View style={[styles.chartDot, { bottom: 25, left: '70%' }]} />
                    <View style={[styles.chartDot, { bottom: 15, left: '90%' }]} />
                  </View>
                </View>
                <View style={styles.chartLabels}>
                  <Text style={styles.chartLabelText}>1 Haz</Text>
                  <Text style={styles.chartLabelText}>15 Haz</Text>
                  <Text style={styles.chartLabelText}>30 Haz</Text>
                </View>
                <Text style={styles.weightText}>Son kayıt: {currentWeight} kg</Text>
              </View>
            </Card>
          </Pressable>

          {/* Habit Checklist */}
          <SectionHeader title={t('tracking.habits')} />
          <View style={styles.habitBox}>
            {habitsList.map((habit) => {
              const isDone = !!completedHabits[habit.id];
              return (
                <Pressable
                  key={habit.id}
                  onPress={() => toggleHabit(habit.id)}
                  style={styles.habitRow}
                >
                  <View style={[styles.checkbox, isDone && styles.checkboxChecked]}>
                    {isDone && <Text style={styles.checkText}>✓</Text>}
                  </View>
                  <Text style={[styles.habitText, isDone && styles.habitTextDone]}>
                    {t(habit.key)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <PrimaryButton
            title={t('tracking.updateProgress')}
            onPress={handleUpdate}
            style={styles.updateButton}
          />
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>

      {/* Weight Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isWeightModalVisible}
        onRequestClose={() => setIsWeightModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t('tracking.enterWeight')}</Text>
            
            <TextInput
              style={styles.weightTextInput}
              keyboardType="numeric"
              placeholder={t('tracking.weightPlaceholder')}
              placeholderTextColor={theme.colors.textMuted}
              value={weightInput}
              onChangeText={setWeightInput}
              autoFocus
            />

            <View style={styles.modalButtonRow}>
              <Pressable
                onPress={() => setIsWeightModalVisible(false)}
                style={[styles.modalBtn, styles.modalBtnCancel]}
              >
                <Text style={styles.modalBtnCancelText}>{t('tracking.close')}</Text>
              </Pressable>

              <Pressable
                onPress={handleSaveWeight}
                style={[styles.modalBtn, styles.modalBtnSave]}
              >
                <Text style={styles.modalBtnSaveText}>{t('tracking.save')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  scroll: {
    flex: 1,
  },
  ringCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },
  ringOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    ...theme.shadows.light,
  },
  ringInner: {
    alignItems: 'center',
  },
  ringValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.black,
    color: theme.colors.textDark,
  },
  ringTotal: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  macrosCard: {
    padding: theme.spacing.lg,
  },
  chartCard: {
    marginVertical: theme.spacing.sm,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  editLink: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  chartMockContainer: {
    width: '100%',
  },
  chartGrid: {
    height: 120,
    width: '100%',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'space-between',
    position: 'relative',
  },
  chartGridLine: {
    height: 1,
    width: '100%',
    backgroundColor: theme.colors.border,
    opacity: 0.3,
  },
  chartDotContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  chartDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
  },
  chartLabelText: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  weightText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  habitBox: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: theme.borderRadius.sm,
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
    fontSize: 12,
    fontWeight: 'bold',
  },
  habitText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textDark,
  },
  habitTextDone: {
    textDecorationLine: 'line-through',
    color: theme.colors.textMuted,
  },
  updateButton: {
    marginVertical: theme.spacing.xl,
  },
  bottomSpacing: {
    height: 40,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(30, 37, 18, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: theme.colors.background,
    borderRadius: 24,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textDark,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: theme.spacing.lg,
  },
  weightTextInput: {
    width: '100%',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: theme.colors.textDark,
    marginBottom: theme.spacing.xl,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancel: {
    marginRight: theme.spacing.md,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.textMuted,
  },
  modalBtnSave: {
    backgroundColor: theme.colors.primary,
  },
  modalBtnCancelText: {
    color: theme.colors.textMuted,
    fontWeight: '700',
    fontSize: 14,
  },
  modalBtnSaveText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});

export default TrackingScreen;
