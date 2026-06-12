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
