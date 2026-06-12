import React, { createContext, useContext, useState } from 'react';
import { LoggedMeal, Challenge } from '../types/meal';
import { mockChallenges } from '../data/mockChallenges';

// Macro details for meals and recipes to allow dynamic calculations
const mealMacros: Record<string, { calories: number; protein: number; carbs: number; fat: number }> = {
  m1: { calories: 320, protein: 16, carbs: 28, fat: 15 },
  m2: { calories: 420, protein: 14, carbs: 52, fat: 18 },
  m3: { calories: 480, protein: 36, carbs: 12, fat: 26 },
  m4: { calories: 180, protein: 5, carbs: 25, fat: 6 },
};

const recipeMacros: Record<string, { calories: number; protein: number; carbs: number; fat: number }> = {
  r1: { calories: 420, protein: 14, carbs: 52, fat: 18 },
  r2: { calories: 320, protein: 16, carbs: 28, fat: 15 },
  r3: { calories: 480, protein: 36, carbs: 12, fat: 26 },
};

// Target values
const TARGETS = {
  calories: 1800,
  protein: 120,
  carbs: 300,
  fat: 80,
  water: 8,
};

// Base baseline offset to achieve the visual start values (1420 kcal, 78g P, 135g C, 64g F)
// when m1 (320 kcal, 16g P, 28g C, 15g F) and m2 (420 kcal, 14g P, 52g C, 18g F) are pre-completed.
// Baseline = Visual Target - (m1 + m2)
// Baseline Calories = 1420 - 740 = 680
// Baseline Protein = 78 - 30 = 48
// Baseline Carbs = 135 - 80 = 55
// Baseline Fat = 64 - 33 = 31
const BASELINE = {
  calories: 680,
  protein: 48,
  carbs: 55,
  fat: 31,
};

interface TrackingContextType {
  // Config targets
  maxCalories: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  waterTarget: number;

  // Active metrics
  loggedCalories: number;
  proteinCurrent: number;
  carbsCurrent: number;
  fatCurrent: number;
  waterCurrent: number;
  currentWeight: number;

  // Tracked items
  completedMeals: string[];
  completedRecipes: string[];
  completedHabits: Record<string, boolean>;

  // Logged meals
  loggedMeals: LoggedMeal[];
  addMeal: (meal: Omit<LoggedMeal, 'id' | 'timestamp'>) => void;
  removeMeal: (mealId: string) => void;

  // Challenges
  challenges: Challenge[];
  enrollChallenge: (challengeId: string) => void;
  leaveChallenge: (challengeId: string) => void;
  updateChallengeProgress: (challengeId: string, increment: number) => void;

  // Operations
  toggleMeal: (mealId: string) => void;
  toggleRecipe: (recipeId: string) => void;
  incrementWater: () => void;
  decrementWater: () => void;
  updateWeight: (weight: number) => void;
  toggleHabit: (habitId: string) => void;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export const TrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pre-completed meals matching default dashboard visuals
  const [completedMeals, setCompletedMeals] = useState<string[]>(['m1', 'm2']);
  const [completedRecipes, setCompletedRecipes] = useState<string[]>([]);
  const [waterCurrent, setWaterCurrent] = useState<number>(4);
  const [currentWeight, setCurrentWeight] = useState<number>(64.5);
  const [completedHabits, setCompletedHabits] = useState<Record<string, boolean>>({
    water: true,
    plan: false,
    walk: true,
    sugar: false,
  });
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);

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

  const toggleMeal = (mealId: string) => {
    setCompletedMeals((prev) =>
      prev.includes(mealId) ? prev.filter((id) => id !== mealId) : [...prev, mealId]
    );
  };

  const toggleRecipe = (recipeId: string) => {
    setCompletedRecipes((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  const incrementWater = () => {
    setWaterCurrent((prev) => Math.min(prev + 1, 16));
  };

  const decrementWater = () => {
    setWaterCurrent((prev) => Math.max(prev - 1, 0));
  };

  const updateWeight = (weight: number) => {
    if (weight > 0) {
      setCurrentWeight(weight);
    }
  };

  const toggleHabit = (habitId: string) => {
    setCompletedHabits((prev) => ({
      ...prev,
      [habitId]: !prev[habitId],
    }));
  };

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

  const enrollChallenge = (challengeId: string) => {
    setChallenges(prev =>
      prev.map(ch => ch.id === challengeId ? { ...ch, enrolled: true } : ch)
    );
  };

  const leaveChallenge = (challengeId: string) => {
    setChallenges(prev =>
      prev.map(ch => ch.id === challengeId ? { ...ch, enrolled: false } : ch)
    );
  };

  const updateChallengeProgress = (challengeId: string, increment: number) => {
    setChallenges(prev =>
      prev.map(ch =>
        ch.id === challengeId
          ? { ...ch, current: Math.min(ch.current + increment, ch.target) }
          : ch
      )
    );
  };

  return (
    <TrackingContext.Provider
      value={{
        maxCalories: TARGETS.calories,
        proteinTarget: TARGETS.protein,
        carbsTarget: TARGETS.carbs,
        fatTarget: TARGETS.fat,
        waterTarget: TARGETS.water,
        loggedCalories,
        proteinCurrent,
        carbsCurrent,
        fatCurrent,
        waterCurrent,
        currentWeight,
        completedMeals,
        completedRecipes,
        completedHabits,
        loggedMeals,
        addMeal,
        removeMeal,
        toggleMeal,
        toggleRecipe,
        incrementWater,
        decrementWater,
        updateWeight,
        toggleHabit,
        challenges,
        enrollChallenge,
        leaveChallenge,
        updateChallengeProgress,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};
