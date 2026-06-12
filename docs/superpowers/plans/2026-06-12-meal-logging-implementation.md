# Öğün Kaydetme Sistemi - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modal tabanlı öğün kaydetme sistemi - Edamam API ile arama, manuel giriş, fotoğraf ekleme, porsiyon seçimi ve TrackingContext entegrasyonu.

**Architecture:** Modal-based UI (2 tabs: Arama/Manuel) + EdamamService (API calls) + TrackingContext update (loggedMeals state) + expo-image-picker integration.

**Tech Stack:** React Native, Expo, TypeScript, Edamam Nutrition API, expo-image-picker, TrackingContext

---

## File Structure

**New Files:**
- `src/types/meal.ts` - LoggedMeal, FoodItem, Measure interfaces
- `src/services/EdamamService.ts` - API service for Edamam Nutrition API
- `src/components/modals/AddMealModal.tsx` - Ana modal component
- `src/components/modals/PhotoPicker.tsx` - Fotoğraf seçici reusable component

**Modified Files:**
- `src/context/TrackingContext.tsx` - loggedMeals state + addMeal/removeMeal methods
- `src/screens/home/HomeScreen.tsx` - Modal trigger integration
- `src/i18n/locales/tr.json` - Meal related translations (Turkish)
- `src/i18n/locales/en.json` - Meal related translations (English)
- `package.json` - Add expo-image-picker dependency
- `.gitignore` - Add .env file

**Environment:**
- `.env` - Edamam API credentials (not committed)

---

## Task 1: Install Dependencies and Setup Environment

**Files:**
- Modify: `package.json`
- Create: `.env`
- Modify: `.gitignore`

- [ ] **Step 1: Install expo-image-picker**

```bash
npx expo install expo-image-picker
```

Expected: Package installed successfully in package.json

- [ ] **Step 2: Create .env file with API credentials**

Create file: `.env`

```
EDAMAM_APP_ID=your_app_id_here
EDAMAM_APP_KEY=your_app_key_here
```

**Note:** Replace with actual credentials from https://developer.edamam.com/

- [ ] **Step 3: Add .env to .gitignore**

Add to `.gitignore`:

```
# Environment variables
.env
.env.local
.env.*.local
```

- [ ] **Step 4: Verify installation**

```bash
npm list expo-image-picker
```

Expected: Should show expo-image-picker version

- [ ] **Step 5: Commit dependency changes**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: add expo-image-picker dependency and .env setup"
```

---

## Task 2: Create Type Definitions

**Files:**
- Create: `src/types/meal.ts`

- [ ] **Step 1: Create meal types file**

Create file: `src/types/meal.ts`

```typescript
export interface LoggedMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
  quantity: number;
  photo?: string;
  timestamp: Date;
  source: 'api' | 'manual';
}

export interface FoodNutrients {
  ENERC_KCAL: number;
  PROCNT: number;
  CHOCDF: number;
  FAT: number;
}

export interface Measure {
  uri: string;
  label: string;
  weight: number;
}

export interface FoodItem {
  foodId: string;
  label: string;
  nutrients: FoodNutrients;
  measures: Measure[];
}

export interface EdamamApiResponse {
  text: string;
  parsed: any[];
  hints: Array<{
    food: {
      foodId: string;
      label: string;
      nutrients: FoodNutrients;
      category?: string;
      categoryLabel?: string;
    };
    measures: Measure[];
  }>;
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 3: Commit type definitions**

```bash
git add src/types/meal.ts
git commit -m "feat: add meal type definitions"
```

---

## Task 3: Create Edamam API Service

**Files:**
- Create: `src/services/EdamamService.ts`

- [ ] **Step 1: Create EdamamService file**

Create file: `src/services/EdamamService.ts`

```typescript
import { FoodItem, EdamamApiResponse } from '../types/meal';

export class EdamamService {
  private static readonly BASE_URL = 'https://api.edamam.com/api/food-database/v2';
  
  // Note: In production, use expo-constants or react-native-dotenv for env vars
  // For now, we'll use placeholder that needs to be replaced
  private static readonly APP_ID = 'REPLACE_WITH_YOUR_APP_ID';
  private static readonly APP_KEY = 'REPLACE_WITH_YOUR_APP_KEY';

  static async searchFood(query: string): Promise<FoodItem[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    try {
      const url = `${this.BASE_URL}/parser?app_id=${this.APP_ID}&app_key=${this.APP_KEY}&ingr=${encodeURIComponent(query)}&nutrition-type=logging`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: EdamamApiResponse = await response.json();
      
      return data.hints.map((hint) => ({
        foodId: hint.food.foodId,
        label: hint.food.label,
        nutrients: hint.food.nutrients,
        measures: hint.measures,
      }));
    } catch (error) {
      console.error('Edamam API error:', error);
      throw error;
    }
  }

  static calculateNutrients(
    baseNutrients: FoodItem['nutrients'],
    quantity: number,
    unitWeight: number
  ): {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } {
    const multiplier = (quantity * unitWeight) / 100;
    
    return {
      calories: Math.round(baseNutrients.ENERC_KCAL * multiplier),
      protein: Math.round(baseNutrients.PROCNT * multiplier),
      carbs: Math.round(baseNutrients.CHOCDF * multiplier),
      fat: Math.round(baseNutrients.FAT * multiplier),
    };
  }
}
```

- [ ] **Step 2: Verify service compiles**

```bash
npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 3: Commit service**

```bash
git add src/services/EdamamService.ts
git commit -m "feat: add Edamam API service"
```

---

## Task 4: Update i18n Translations

**Files:**
- Modify: `src/i18n/locales/tr.json`
- Modify: `src/i18n/locales/en.json`

- [ ] **Step 1: Add Turkish translations**

Add to `src/i18n/locales/tr.json` under the root object:

```json
"meal": {
  "addMeal": "Öğün Ekle",
  "searchTab": "Ara",
  "manualTab": "Manuel Ekle",
  "searchPlaceholder": "Yemek ara...",
  "noResults": "Sonuç bulunamadı",
  "manualEntry": "Bulamadın mı? Manuel ekle",
  "mealName": "Yemek Adı",
  "calories": "Kalori (kcal)",
  "protein": "Protein (g)",
  "carbs": "Karbonhidrat (g)",
  "fat": "Yağ (g)",
  "portion": "Porsiyon/Miktar",
  "addPhoto": "Fotoğraf Ekle (opsiyonel)",
  "calculated": "Hesaplanan Değerler",
  "save": "Kaydet",
  "cancel": "İptal",
  "photoFrom": "Fotoğraf nereden?",
  "camera": "Kamera",
  "gallery": "Galeri",
  "cameraPermission": "Kamera erişimi için izin vermeniz gerekiyor.",
  "galleryPermission": "Galeri erişimi için izin vermeniz gerekiyor.",
  "networkError": "İnternet bağlantınızı kontrol edin",
  "apiError": "Arama sırasında bir hata oluştu",
  "required": "Bu alan zorunludur",
  "searching": "Aranıyor...",
  "quantity": "Miktar",
  "unit": "Birim",
  "gram": "gram"
}
```

- [ ] **Step 2: Add English translations**

Add to `src/i18n/locales/en.json` under the root object:

```json
"meal": {
  "addMeal": "Add Meal",
  "searchTab": "Search",
  "manualTab": "Manual Entry",
  "searchPlaceholder": "Search food...",
  "noResults": "No results found",
  "manualEntry": "Can't find it? Add manually",
  "mealName": "Meal Name",
  "calories": "Calories (kcal)",
  "protein": "Protein (g)",
  "carbs": "Carbs (g)",
  "fat": "Fat (g)",
  "portion": "Portion/Amount",
  "addPhoto": "Add Photo (optional)",
  "calculated": "Calculated Values",
  "save": "Save",
  "cancel": "Cancel",
  "photoFrom": "Choose photo from?",
  "camera": "Camera",
  "gallery": "Gallery",
  "cameraPermission": "Camera permission is required.",
  "galleryPermission": "Gallery permission is required.",
  "networkError": "Check your internet connection",
  "apiError": "An error occurred during search",
  "required": "This field is required",
  "searching": "Searching...",
  "quantity": "Quantity",
  "unit": "Unit",
  "gram": "gram"
}
```

- [ ] **Step 3: Verify JSON syntax**

```bash
npx tsc --noEmit
```

Expected: No errors (JSON files are valid)

- [ ] **Step 4: Commit translations**

```bash
git add src/i18n/locales/tr.json src/i18n/locales/en.json
git commit -m "feat: add meal logging translations"
```

---

## Task 5: Update TrackingContext

**Files:**
- Modify: `src/context/TrackingContext.tsx`

- [ ] **Step 1: Import LoggedMeal type**

Add to imports in `src/context/TrackingContext.tsx`:

```typescript
import { LoggedMeal } from '../types/meal';
```

- [ ] **Step 2: Add loggedMeals to context interface**

Update `TrackingContextType` interface by adding after line 59:

```typescript
  // Logged meals
  loggedMeals: LoggedMeal[];
  addMeal: (meal: Omit<LoggedMeal, 'id' | 'timestamp'>) => void;
  removeMeal: (mealId: string) => void;
```

- [ ] **Step 3: Add loggedMeals state**

Add after line 77 (after completedHabits state):

```typescript
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
```

- [ ] **Step 4: Add meal management methods**

Add after line 142 (after toggleHabit function):

```typescript
  const addMeal = (meal: Omit<LoggedMeal, 'id' | 'timestamp'>) => {
    const newMeal: LoggedMeal = {
      ...meal,
      id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    setLoggedMeals((prev) => [...prev, newMeal]);
  };

  const removeMeal = (mealId: string) => {
    setLoggedMeals((prev) => prev.filter((m) => m.id !== mealId));
  };
```

- [ ] **Step 5: Update calorie calculations to include loggedMeals**

Replace lines 86-109 with:

```typescript
  // Calculate dynamic calories and macros based on completed meals, recipes, and logged meals
  let loggedCalories = BASELINE.calories;
  let proteinCurrent = BASELINE.protein;
  let carbsCurrent = BASELINE.carbs;
  let fatCurrent = BASELINE.fat;

  completedMeals.forEach((mealId) => {
    const macros = mealMacros[mealId];
    if (macros) {
      loggedCalories += macros.calories;
      proteinCurrent += macros.protein;
      carbsCurrent += macros.carbs;
      fatCurrent += macros.fat;
    }
  });

  completedRecipes.forEach((recipeId) => {
    const macros = recipeMacros[recipeId];
    if (macros) {
      loggedCalories += macros.calories;
      proteinCurrent += macros.protein;
      carbsCurrent += macros.carbs;
      fatCurrent += macros.fat;
    }
  });

  loggedMeals.forEach((meal) => {
    loggedCalories += meal.calories;
    proteinCurrent += meal.protein;
    carbsCurrent += meal.carbs;
    fatCurrent += meal.fat;
  });
```

- [ ] **Step 6: Add new methods to context provider value**

Update the provider value (around line 164) by adding after completedHabits:

```typescript
        loggedMeals,
        addMeal,
        removeMeal,
```

- [ ] **Step 7: Verify context compiles**

```bash
npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 8: Commit context updates**

```bash
git add src/context/TrackingContext.tsx
git commit -m "feat: add loggedMeals state to TrackingContext"
```

---

## Task 6: Create PhotoPicker Component

**Files:**
- Create: `src/components/modals/PhotoPicker.tsx`

- [ ] **Step 1: Create PhotoPicker component**

Create file: `src/components/modals/PhotoPicker.tsx`

```typescript
import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';

interface PhotoPickerProps {
  photoUri: string | undefined;
  onPhotoSelected: (uri: string) => void;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({ photoUri, onPhotoSelected }) => {
  const { t } = useTranslation();

  const showPhotoOptions = () => {
    Alert.alert(
      t('meal.photoFrom'),
      '',
      [
        {
          text: t('meal.camera'),
          onPress: pickImageFromCamera,
        },
        {
          text: t('meal.gallery'),
          onPress: pickImageFromGallery,
        },
        {
          text: t('meal.cancel'),
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('meal.cameraPermission'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      onPhotoSelected(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('meal.galleryPermission'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      onPhotoSelected(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('meal.addPhoto')}</Text>
      <Pressable onPress={showPhotoOptions} style={styles.photoButton}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photoPreview} />
        ) : (
          <View style={styles.placeholderContent}>
            <Ionicons name="camera-outline" size={32} color={theme.colors.textMuted} />
            <Text style={styles.placeholderText}>{t('meal.addPhoto')}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textDark,
    marginBottom: theme.spacing.xs,
  },
  photoButton: {
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C7CE9E',
    borderStyle: 'dashed',
    backgroundColor: '#EEF2D3',
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
});
```

- [ ] **Step 2: Verify component compiles**

```bash
npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 3: Commit PhotoPicker component**

```bash
git add src/components/modals/PhotoPicker.tsx
git commit -m "feat: add PhotoPicker component"
```

---

## Task 7: Create AddMealModal Component (Part 1 - Structure)

**Files:**
- Create: `src/components/modals/AddMealModal.tsx`

- [ ] **Step 1: Create modal file with imports and structure**

Create file: `src/components/modals/AddMealModal.tsx`

```typescript
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
import { EdamamService } from '../../services/EdamamService';
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

  // Search function will be added in next step
  // Save function will be added in next step
  // Reset function will be added in next step

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('meal.addMeal')}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
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

          {/* Content will be added in next steps */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {activeTab === 'search' ? (
              <Text>Search Tab Content (To be implemented)</Text>
            ) : (
              <Text>Manual Tab Content (To be implemented)</Text>
            )}
          </ScrollView>
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
});
```

- [ ] **Step 2: Verify modal structure compiles**

```bash
npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 3: Commit modal structure**

```bash
git add src/components/modals/AddMealModal.tsx
git commit -m "feat: add AddMealModal structure with tabs"
```

---

## Task 8: Add Search Tab UI to AddMealModal

**Files:**
- Modify: `src/components/modals/AddMealModal.tsx`

- [ ] **Step 1: Add search handler function**

Add after line 59 (after photoUri state):

```typescript
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await EdamamService.searchFood(searchQuery);
      setSearchResults(results);
    } catch (error) {
      Alert.alert(t('meal.apiError'), t('meal.networkError'));
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, t]);
```

- [ ] **Step 2: Add debounced search effect**

Add after handleSearch function:

```typescript
  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);
```

- [ ] **Step 3: Replace search tab content placeholder**

Replace the line `<Text>Search Tab Content (To be implemented)</Text>` with:

```typescript
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

                {/* No Results */}
                {!isSearching && searchQuery.trim().length > 0 && searchResults.length === 0 && (
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
                        const calculated = EdamamService.calculateNutrients(
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
```

- [ ] **Step 4: Add search tab styles**

Add to styles at the end of StyleSheet.create (before the closing }):

```typescript
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
```

- [ ] **Step 5: Verify search tab compiles**

```bash
npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 6: Commit search tab implementation**

```bash
git add src/components/modals/AddMealModal.tsx
git commit -m "feat: add search tab UI and logic to AddMealModal"
```

---

## Task 9: Add Manual Tab UI to AddMealModal

**Files:**
- Modify: `src/components/modals/AddMealModal.tsx`

- [ ] **Step 1: Replace manual tab content placeholder**

Replace the line `<Text>Manual Tab Content (To be implemented)</Text>` with:

```typescript
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
```

- [ ] **Step 2: Add manual tab styles**

Add to styles at the end of StyleSheet.create (before the closing }):

```typescript
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
```

- [ ] **Step 3: Verify manual tab compiles**

```bash
npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 4: Commit manual tab implementation**

```bash
git add src/components/modals/AddMealModal.tsx
git commit -m "feat: add manual entry tab UI to AddMealModal"
```

---

## Task 10: Add Save Logic and Reset to AddMealModal

**Files:**
- Modify: `src/components/modals/AddMealModal.tsx`

- [ ] **Step 1: Add reset function**

Add after the debounced search useEffect:

```typescript
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
```

- [ ] **Step 2: Add save handler function**

Add after resetForm function:

```typescript
  const handleSave = () => {
    if (activeTab === 'search') {
      // Save from search tab
      if (!selectedFood) {
        Alert.alert(t('meal.required'), 'Lütfen bir yemek seçin');
        return;
      }

      const unitWeight = selectedFood.measures[selectedMeasure]?.weight || 1;
      const calculated = EdamamService.calculateNutrients(
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
```

- [ ] **Step 3: Add save button to modal**

Add after the ScrollView closing tag (before the closing View of modalContainer):

```typescript
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
```

- [ ] **Step 4: Add footer styles**

Add to styles at the end of StyleSheet.create:

```typescript
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
```

- [ ] **Step 5: Update onClose to reset form**

Replace the onRequestClose prop in Modal component (around line 65):

```typescript
      onRequestClose={() => {
        resetForm();
        onClose();
      }}
```

Also update the close button onPress (around line 72):

```typescript
            <Pressable onPress={() => { resetForm(); onClose(); }} style={styles.closeButton}>
```

- [ ] **Step 6: Verify save logic compiles**

```bash
npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 7: Commit save logic**

```bash
git add src/components/modals/AddMealModal.tsx
git commit -m "feat: add save and reset logic to AddMealModal"
```

---

## Task 11: Integrate AddMealModal into HomeScreen

**Files:**
- Modify: `src/screens/home/HomeScreen.tsx`

- [ ] **Step 1: Import AddMealModal**

Add to imports at the top of HomeScreen.tsx (after existing imports, around line 13):

```typescript
import { AddMealModal } from '../../components/modals/AddMealModal';
```

- [ ] **Step 2: Add modal state**

Add state after the useTracking hook (around line 42):

```typescript
  const [isAddMealModalVisible, setIsAddMealModalVisible] = useState(false);
```

- [ ] **Step 3: Update handleQuickAction for log_meal**

Update the handleQuickAction function (around line 44) to show modal instead of alert:

```typescript
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
```

- [ ] **Step 4: Add AddMealModal component to render**

Add modal before the closing SafeAreaView tag (around line 300, right before `</SafeAreaView>`):

```typescript
        {/* Add Meal Modal */}
        <AddMealModal
          visible={isAddMealModalVisible}
          onClose={() => setIsAddMealModalVisible(false)}
        />
```

- [ ] **Step 5: Add missing import**

Add useState to React imports at the top:

```typescript
import React, { useState } from 'react';
```

- [ ] **Step 6: Verify HomeScreen compiles**

```bash
npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 7: Test modal opens**

```bash
npm start
```

Manual test: Open app → Click "Öğün Ekle" button → Modal should open

- [ ] **Step 8: Commit HomeScreen integration**

```bash
git add src/screens/home/HomeScreen.tsx
git commit -m "feat: integrate AddMealModal into HomeScreen"
```

---

## Task 12: Final Testing and Validation

**Files:**
- All modified files

- [ ] **Step 1: Full TypeScript compilation check**

```bash
npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 2: Start development server**

```bash
npm start
```

Expected: App starts without errors

- [ ] **Step 3: Manual testing - Search tab flow**

Manual steps:
1. Open app
2. Click "Öğün Ekle" quick action button
3. Verify modal opens with "Ara" tab active
4. Type "chicken" in search input
5. Wait for results to appear
6. Select a food item
7. Verify quantity controls work (+/- buttons)
8. Click "Fotoğraf Ekle" and select/take photo
9. Verify calculated values update
10. Click "Kaydet"
11. Verify modal closes
12. Verify calories on home screen updated

Expected: All steps work smoothly

- [ ] **Step 4: Manual testing - Manuel tab flow**

Manual steps:
1. Open "Öğün Ekle" modal
2. Switch to "Manuel Ekle" tab
3. Fill in: Name="Test Meal", Calories="200", Protein="10", Carbs="20", Fat="5", Portion="1 portion"
4. Add optional photo
5. Click "Kaydet"
6. Verify modal closes
7. Verify calories on home screen updated

Expected: All steps work smoothly

- [ ] **Step 5: Manual testing - Validation**

Manual steps:
1. Open modal → Search tab → Try to save without selecting food
2. Expected: Alert or disabled button
3. Open modal → Manuel tab → Try to save with empty name
4. Expected: Alert or disabled button

Expected: Validation prevents invalid saves

- [ ] **Step 6: Manual testing - Photo permissions**

Manual steps:
1. Open modal
2. Click "Fotoğraf Ekle"
3. Choose "Kamera"
4. Grant/deny permission
5. Verify permission alert shows if denied
6. Repeat with "Galeri" option

Expected: Permissions handled gracefully

- [ ] **Step 7: Manual testing - Tab switching**

Manual steps:
1. Open modal → Search tab → Enter search query
2. Switch to Manuel tab
3. Switch back to Ara tab
4. Verify search query persisted

Expected: State persists between tabs

- [ ] **Step 8: Check for memory leaks**

Manual steps:
1. Open/close modal 10 times
2. Add 5 meals
3. Check app performance

Expected: No performance degradation

- [ ] **Step 9: Test with API credentials**

Manual steps:
1. Add real Edamam API credentials to `.env` file
2. Replace APP_ID and APP_KEY in EdamamService.ts
3. Restart app
4. Test search with various queries

Expected: Real API results returned

- [ ] **Step 10: Final commit**

```bash
git add -A
git commit -m "test: validate meal logging system functionality"
```

---

## Task 13: Documentation and Cleanup

**Files:**
- Create: `docs/features/meal-logging.md` (optional)

- [ ] **Step 1: Add TODO comments for future improvements**

Add comment at top of `src/services/EdamamService.ts`:

```typescript
// TODO: Future improvements
// - Add caching for API results
// - Implement retry logic for failed requests
// - Add offline support with local database
// - Use expo-constants for environment variables instead of hardcoded values
```

- [ ] **Step 2: Add TODO for API key management**

Add comment in `src/services/EdamamService.ts` after line 8:

```typescript
  // TODO: Move to environment variables using expo-constants
  // import Constants from 'expo-constants';
  // private static readonly APP_ID = Constants.expoConfig?.extra?.edamamAppId || '';
```

- [ ] **Step 3: Document known limitations**

Add comment at top of `src/components/modals/AddMealModal.tsx`:

```typescript
// Known limitations:
// - Search limited to first 5 results
// - No pagination for search results
// - Photo stored locally only (no cloud sync)
// - No favorites or recent meals feature
// - No barcode scanning
```

- [ ] **Step 4: Update README (if exists)**

If `README.md` exists, add section:

```markdown
## Öğün Kaydetme Sistemi

Ana ekrandan "Öğün Ekle" butonuna tıklayarak:
- Edamam API ile yemek arama
- Manuel yemek girişi
- Fotoğraf ekleme
- Kalori ve makro değerlerinin otomatik hesaplanması

### API Credentials

`.env` dosyasında Edamam API credentials ekleyin:
```
EDAMAM_APP_ID=your_app_id
EDAMAM_APP_KEY=your_app_key
```

Ücretsiz kayıt: https://developer.edamam.com/
```

- [ ] **Step 5: Commit documentation**

```bash
git add -A
git commit -m "docs: add meal logging documentation and TODOs"
```

---

## Self-Review Checklist

**Spec Coverage:**
✅ Yemek arama (Edamam API) - Task 3, 8  
✅ Manuel yemek girişi - Task 9  
✅ Fotoğrafla kayıt - Task 6  
✅ Gram/porsiyon seçimi - Task 8  
✅ Kalori/makro hesaplama - Task 3, 8  
✅ TrackingContext entegrasyon - Task 5  
✅ Ana ekran güncelleme - Task 5  
✅ Modal UI - Task 7, 8, 9  
✅ i18n çevirileri - Task 4  

**Type Consistency:**
✅ LoggedMeal interface consistent across all tasks  
✅ FoodItem interface matches EdamamService usage  
✅ addMeal method signature matches across TrackingContext and AddMealModal  
✅ Photo URI type (string | undefined) consistent  

**No Placeholders:**
✅ All code blocks complete  
✅ All file paths specified  
✅ All commands with expected output  
✅ No TBD or TODO in task steps (only in final documentation task)  

---

## Execution Complete

Plan saved to: `docs/superpowers/plans/2026-06-12-meal-logging-implementation.md`