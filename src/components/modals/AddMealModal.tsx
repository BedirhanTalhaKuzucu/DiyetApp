// Known limitations:
// - Search limited to first 5 results
// - No pagination for search results
// - Photo stored locally only (no cloud sync)
// - No favorites or recent meals feature
// - No barcode scanning

import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import { FoodService } from '../../services/FoodService';
import { FoodItem } from '../../types/meal';
import { PhotoPicker } from './PhotoPicker';
import { useTracking } from '../../context/TrackingContext';

interface AddMealModalProps {
  visible: boolean;
  onClose: () => void;
}

type TabType = 'search' | 'manual';

export const AddMealModal: React.FC<AddMealModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { addMeal } = useTracking();

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('search');

  // Search tab state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuantity, setSearchQuantity] = useState<number>(100);
  const [selectedMeasure, setSelectedMeasure] = useState<number>(0);

  // Manual tab state
  const [manualName, setManualName] = useState('');
  const [manualCalories, setManualCalories] = useState('');
  const [manualProtein, setManualProtein] = useState('');
  const [manualCarbs, setManualCarbs] = useState('');
  const [manualFat, setManualFat] = useState('');
  const [manualPortion, setManualPortion] = useState('');

  // Shared state
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await FoodService.searchFood(searchQuery);
      setSearchResults(results);
    } catch (error) {
      Alert.alert(t('meal.apiError'), t('meal.networkError'));
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, t]);

  // Debounced search (minimum 2 karakter)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else if (searchQuery.trim().length > 0 && searchQuery.trim().length < 2) {
        setSearchResults([]); // Temizle
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const resetForm = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedFood(null);
    setSearchQuantity(100);
    setSelectedMeasure(0);
    setManualName('');
    setManualCalories('');
    setManualProtein('');
    setManualCarbs('');
    setManualFat('');
    setManualPortion('');
    setPhotoUri(undefined);
    setActiveTab('search');
  };

  const handleSave = () => {
    if (activeTab === 'search') {
      // Save from search tab
      if (!selectedFood) {
        Alert.alert(t('meal.required'), 'Lütfen bir yemek seçin');
        return;
      }

      const unitWeight = selectedFood.measures[selectedMeasure]?.weight || 1;
      const calculated = FoodService.calculateNutrients(
        selectedFood.nutrients,
        searchQuantity,
        unitWeight
      );

      addMeal({
        name: selectedFood.label,
        calories: calculated.calories,
        protein: calculated.protein,
        carbs: calculated.carbs,
        fat: calculated.fat,
        portion: `${searchQuantity}${t('meal.gram')}`,
        quantity: searchQuantity,
        photo: photoUri,
        source: 'api',
      });

      resetForm();
      onClose();
    } else {
      // Save from manual tab
      if (!manualName.trim() || !manualCalories) {
        Alert.alert(t('meal.required'), 'Lütfen en az yemek adı ve kalori girin');
        return;
      }

      const calories = parseInt(manualCalories) || 0;
      const protein = parseInt(manualProtein) || 0;
      const carbs = parseInt(manualCarbs) || 0;
      const fat = parseInt(manualFat) || 0;

      addMeal({
        name: manualName.trim(),
        calories,
        protein,
        carbs,
        fat,
        portion: manualPortion.trim() || '1 porsiyon',
        quantity: 1,
        photo: photoUri,
        source: 'manual',
      });

      resetForm();
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        resetForm();
        onClose();
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('meal.addMeal')}</Text>
            <Pressable onPress={() => { resetForm(); onClose(); }} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.textDark} />
            </Pressable>
          </View>

          {/* Tab Selector */}
          <View style={styles.tabContainer}>
            <Pressable
              style={[styles.tab, activeTab === 'search' && styles.activeTab]}
              onPress={() => setActiveTab('search')}
            >
              <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
                🔍 {t('meal.searchTab')}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'manual' && styles.activeTab]}
              onPress={() => setActiveTab('manual')}
            >
              <Text style={[styles.tabText, activeTab === 'manual' && styles.activeTabText]}>
                📝 {t('meal.manualTab')}
              </Text>
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {activeTab === 'search' ? (
              <View>
                {/* Search Input */}
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder={t('meal.searchPlaceholder')}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                  />
                  <Ionicons
                    name="search"
                    size={20}
                    color={theme.colors.textMuted}
                    style={styles.searchIcon}
                  />
                </View>

                {/* Loading Indicator */}
                {isSearching && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>{t('meal.searching')}</Text>
                  </View>
                )}

                {/* Search Results */}
                {!isSearching && searchResults.length > 0 && !selectedFood && (
                  <View style={styles.resultsContainer}>
                    <Text style={styles.resultsTitle}>{t('meal.searchTab')}:</Text>
                    {searchResults.slice(0, 5).map((food, index) => (
                      <Pressable
                        key={`${food.foodId}-${index}`}
                        style={styles.resultItem}
                        onPress={() => {
                          setSelectedFood(food);
                          setSelectedMeasure(0);
                        }}
                      >
                        <View style={styles.resultContent}>
                          <Text style={styles.resultName}>{food.label}</Text>
                          <Text style={styles.resultNutrients}>
                            {Math.round(food.nutrients.ENERC_KCAL)} kcal • P:{Math.round(food.nutrients.PROCNT)}g C:{Math.round(food.nutrients.CHOCDF)}g F:{Math.round(food.nutrients.FAT)}g
                          </Text>
                        </View>
                        <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
                      </Pressable>
                    ))}
                  </View>
                )}

                {/* No Results - sadece 2+ karakter yazıldığında ve hala sonuç yoksa göster */}
                {!isSearching && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>{t('meal.noResults')}</Text>
                    <Pressable onPress={() => setActiveTab('manual')}>
                      <Text style={styles.manualLink}>{t('meal.manualEntry')}</Text>
                    </Pressable>
                  </View>
                )}

                {/* Selected Food Details */}
                {selectedFood && (
                  <View style={styles.selectedFoodContainer}>
                    <View style={styles.selectedHeader}>
                      <Text style={styles.selectedTitle}>{selectedFood.label}</Text>
                      <Pressable onPress={() => setSelectedFood(null)}>
                        <Ionicons name="close-circle" size={20} color={theme.colors.textMuted} />
                      </Pressable>
                    </View>

                    {/* Quantity Controls */}
                    <View style={styles.quantityContainer}>
                      <Text style={styles.quantityLabel}>{t('meal.quantity')}:</Text>
                      <View style={styles.quantityControls}>
                        <Pressable
                          style={styles.quantityButton}
                          onPress={() => setSearchQuantity(Math.max(1, searchQuantity - 10))}
                        >
                          <Ionicons name="remove" size={18} color={theme.colors.primary} />
                        </Pressable>
                        <TextInput
                          style={styles.quantityInput}
                          value={searchQuantity.toString()}
                          onChangeText={(text) => {
                            const num = parseInt(text) || 0;
                            setSearchQuantity(Math.max(1, num));
                          }}
                          keyboardType="numeric"
                        />
                        <Text style={styles.unitText}>{t('meal.gram')}</Text>
                        <Pressable
                          style={styles.quantityButton}
                          onPress={() => setSearchQuantity(searchQuantity + 10)}
                        >
                          <Ionicons name="add" size={18} color={theme.colors.primary} />
                        </Pressable>
                      </View>
                    </View>

                    {/* Calculated Nutrients */}
                    <View style={styles.calculatedContainer}>
                      <Text style={styles.calculatedTitle}>{t('meal.calculated')}:</Text>
                      {(() => {
                        const unitWeight = selectedFood.measures[selectedMeasure]?.weight || 1;
                        const calculated = FoodService.calculateNutrients(
                          selectedFood.nutrients,
                          searchQuantity,
                          unitWeight
                        );
                        return (
                          <Text style={styles.calculatedText}>
                            {calculated.calories} kcal • P:{calculated.protein}g C:{calculated.carbs}g F:{calculated.fat}g
                          </Text>
                        );
                      })()}
                    </View>

                    {/* Photo Picker */}
                    <PhotoPicker photoUri={photoUri} onPhotoSelected={setPhotoUri} />
                  </View>
                )}
              </View>
            ) : (
              <View>
                {/* Meal Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('meal.mealName')}:</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('meal.mealName')}
                    value={manualName}
                    onChangeText={setManualName}
                  />
                </View>

                {/* Calories */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('meal.calories')}:</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="250"
                    value={manualCalories}
                    onChangeText={setManualCalories}
                    keyboardType="numeric"
                  />
                </View>

                {/* Protein and Carbs Row */}
                <View style={styles.rowInputs}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: theme.spacing.sm }]}>
                    <Text style={styles.inputLabel}>{t('meal.protein')}:</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="12"
                      value={manualProtein}
                      onChangeText={setManualProtein}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>{t('meal.carbs')}:</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="30"
                      value={manualCarbs}
                      onChangeText={setManualCarbs}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Fat and Portion Row */}
                <View style={styles.rowInputs}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: theme.spacing.sm }]}>
                    <Text style={styles.inputLabel}>{t('meal.fat')}:</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="8"
                      value={manualFat}
                      onChangeText={setManualFat}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>{t('meal.portion')}:</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="1 tabak"
                      value={manualPortion}
                      onChangeText={setManualPortion}
                    />
                  </View>
                </View>

                {/* Photo Picker */}
                <PhotoPicker photoUri={photoUri} onPhotoSelected={setPhotoUri} />
              </View>
            )}
          </ScrollView>

          {/* Save Button */}
          <View style={styles.footer}>
            <Pressable
              style={[
                styles.saveButton,
                ((activeTab === 'search' && !selectedFood) || (activeTab === 'manual' && !manualName.trim())) && styles.saveButtonDisabled
              ]}
              onPress={handleSave}
              disabled={(activeTab === 'search' && !selectedFood) || (activeTab === 'manual' && !manualName.trim())}
            >
              <Text style={styles.saveButtonText}>{t('meal.save')}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '75%',
    paddingTop: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textDark,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  activeTabText: {
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2D3',
    borderRadius: 12,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: theme.colors.textDark,
  },
  searchIcon: {
    marginLeft: theme.spacing.xs,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  resultsContainer: {
    marginTop: theme.spacing.sm,
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textDark,
    marginBottom: theme.spacing.sm,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EEF2D3',
    padding: theme.spacing.md,
    borderRadius: 12,
    marginBottom: theme.spacing.sm,
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  resultNutrients: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  noResultsText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  manualLink: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  selectedFoodContainer: {
    marginTop: theme.spacing.md,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textDark,
  },
  quantityContainer: {
    marginBottom: theme.spacing.md,
  },
  quantityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textDark,
    marginBottom: theme.spacing.xs,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2D3',
    borderRadius: 12,
    padding: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityInput: {
    flex: 1,
    height: 36,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: theme.spacing.sm,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  unitText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  calculatedContainer: {
    backgroundColor: '#EEF2D3',
    padding: theme.spacing.md,
    borderRadius: 12,
    marginBottom: theme.spacing.md,
  },
  calculatedTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  calculatedText: {
    fontSize: 13,
    color: theme.colors.textDark,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textDark,
    marginBottom: theme.spacing.xs,
  },
  textInput: {
    height: 48,
    backgroundColor: '#EEF2D3',
    borderRadius: 12,
    paddingHorizontal: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.textDark,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E2E8B9',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#C7CE9E',
    opacity: 0.5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
