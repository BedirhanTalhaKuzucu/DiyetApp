export type RootStackParamList = {
  Welcome: undefined;
  GoalSelection: undefined;
  MainApp: undefined;
  RecipeDetail: { recipeId: string };
  Premium: undefined;
  ShoppingList: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Plans: undefined;
  Challenges: undefined;
  Tracking: undefined;
  Profile: undefined;
};

export type ChallengesStackParamList = {
  ChallengesMain: undefined;
  ChallengeDetail: { challengeId: string };
};
