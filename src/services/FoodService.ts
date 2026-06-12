import { FoodItem } from '../types/meal';

// Mock Turkish food data for testing
const mockFoods: Record<string, FoodItem[]> = {
  'tavuk': [
    {
      foodId: 'tavuk_1',
      label: 'Tavuk Göğsü (Izgara)',
      nutrients: { ENERC_KCAL: 165, PROCNT: 31, CHOCDF: 0, FAT: 3.6 },
      measures: [
        { uri: 'http://mock/gram', label: 'gram', weight: 1 },
        { uri: 'http://mock/portion', label: 'filet (100g)', weight: 100 },
      ],
    },
    {
      foodId: 'tavuk_2',
      label: 'Tavuk Şnitzel',
      nutrients: { ENERC_KCAL: 220, PROCNT: 25, CHOCDF: 12, FAT: 8 },
      measures: [
        { uri: 'http://mock/gram', label: 'gram', weight: 1 },
        { uri: 'http://mock/portion', label: 'şnitzel', weight: 150 },
      ],
    },
  ],
  'et': [
    {
      foodId: 'et_1',
      label: 'Dana Eti (Kızartma)',
      nutrients: { ENERC_KCAL: 250, PROCNT: 28, CHOCDF: 0, FAT: 14 },
      measures: [
        { uri: 'http://mock/gram', label: 'gram', weight: 1 },
        { uri: 'http://mock/portion', label: 'porsiyon (100g)', weight: 100 },
      ],
    },
  ],
  'ekmek': [
    {
      foodId: 'ekmek_1',
      label: 'Beyaz Ekmek',
      nutrients: { ENERC_KCAL: 265, PROCNT: 9, CHOCDF: 49, FAT: 3 },
      measures: [
        { uri: 'http://mock/gram', label: 'gram', weight: 1 },
        { uri: 'http://mock/portion', label: 'dilim (30g)', weight: 30 },
      ],
    },
    {
      foodId: 'ekmek_2',
      label: 'Çavdar Ekmeği',
      nutrients: { ENERC_KCAL: 220, PROCNT: 8, CHOCDF: 42, FAT: 2 },
      measures: [
        { uri: 'http://mock/gram', label: 'gram', weight: 1 },
        { uri: 'http://mock/portion', label: 'dilim (35g)', weight: 35 },
      ],
    },
  ],
  'peynir': [
    {
      foodId: 'peynir_1',
      label: 'Beyaz Peynir',
      nutrients: { ENERC_KCAL: 264, PROCNT: 21, CHOCDF: 1.3, FAT: 21 },
      measures: [
        { uri: 'http://mock/gram', label: 'gram', weight: 1 },
        { uri: 'http://mock/portion', label: 'dilim (30g)', weight: 30 },
      ],
    },
    {
      foodId: 'peynir_2',
      label: 'Kaşar Peyniri',
      nutrients: { ENERC_KCAL: 402, PROCNT: 22, CHOCDF: 0, FAT: 35 },
      measures: [
        { uri: 'http://mock/gram', label: 'gram', weight: 1 },
        { uri: 'http://mock/portion', label: 'dilim (30g)', weight: 30 },
      ],
    },
  ],
  'süt': [
    {
      foodId: 'sut_1',
      label: 'Tam Yağlı Süt',
      nutrients: { ENERC_KCAL: 61, PROCNT: 3.2, CHOCDF: 4.8, FAT: 3.3 },
      measures: [
        { uri: 'http://mock/ml', label: 'ml', weight: 1 },
        { uri: 'http://mock/cup', label: 'bardak (200ml)', weight: 200 },
      ],
    },
  ],
  'pilav': [
    {
      foodId: 'pilav_1',
      label: 'Pirinç Pilavı',
      nutrients: { ENERC_KCAL: 130, PROCNT: 2.7, CHOCDF: 28, FAT: 0.3 },
      measures: [
        { uri: 'http://mock/gram', label: 'gram', weight: 1 },
        { uri: 'http://mock/portion', label: 'porsiyon (100g)', weight: 100 },
      ],
    },
  ],
  'yoğurt': [
    {
      foodId: 'yogurt_1',
      label: 'Yoğurt (Tam Yağlı)',
      nutrients: { ENERC_KCAL: 59, PROCNT: 3.5, CHOCDF: 3.3, FAT: 3.3 },
      measures: [
        { uri: 'http://mock/gram', label: 'gram', weight: 1 },
        { uri: 'http://mock/portion', label: 'bardak (200g)', weight: 200 },
      ],
    },
  ],
};

// Open Food Facts API - No API key required!
export class FoodService {
  private static readonly BASE_URL = 'https://world.openfoodfacts.org/cgi/search.pl';

  static async searchFood(query: string): Promise<FoodItem[]> {
    if (!query || query.trim().length < 2) {
      // Minimum 2 karakter gerekli
      return [];
    }

    const lowerQuery = query.toLowerCase().trim();

    // Search mock data (case-insensitive)
    const results: FoodItem[] = [];

    for (const [key, foods] of Object.entries(mockFoods)) {
      if (key.includes(lowerQuery) || lowerQuery.includes(key)) {
        results.push(...foods);
      }
    }

    return results.slice(0, 6); // Return up to 6 results
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
