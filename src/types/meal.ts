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

export interface Challenge {
  id: string;
  name: string;
  description: string;
  category: 'calories' | 'protein' | 'water' | 'steps';
  icon: string;
  target: number;
  current: number;
  unit: string;
  startDate: string;
  endDate: string;
  color: string;
  enrolled: boolean;
}
