import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { RootStackParamList, MainTabParamList } from '../types/navigation';

// Screens
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import GoalSelectionScreen from '../screens/onboarding/GoalSelectionScreen';
import HomeScreen from '../screens/home/HomeScreen';
import MealPlanScreen from '../screens/mealPlan/MealPlanScreen';
import RecipeDetailScreen from '../screens/recipes/RecipeDetailScreen';
import TrackingScreen from '../screens/tracking/TrackingScreen';
import PremiumSubscriptionScreen from '../screens/premium/PremiumSubscriptionScreen';
import ShoppingListScreen from '../screens/shoppingList/ShoppingListScreen';
import ChallengesScreen from '../screens/challenges/ChallengesScreen';
import ChallengeDetailScreen from '../screens/challenges/ChallengeDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconProps {
  name: string;
  focused: boolean;
  color: string;
}

const TabIcon: React.FC<TabIconProps> = ({ name, focused, color }) => {
  return (
    <View style={[styles.tabIconWrapper, focused && styles.tabIconWrapperActive]}>
      <Ionicons
        name={name as any}
        size={20}
        color={focused ? theme.colors.primary : theme.colors.textMuted}
      />
    </View>
  );
};

const MainTabNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F3F6D8', // slightly darker cream for contrast of the tab bar container
          borderTopWidth: 1,
          borderTopColor: '#E2E8B9',
          paddingBottom: 12,
          paddingTop: 8,
          height: 72,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarIconStyle: {
          width: 55,
          height: 30,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('navigation.home'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Plans"
        component={MealPlanScreen}
        options={{
          tabBarLabel: t('navigation.meals'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'restaurant' : 'restaurant-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Challenges"
        component={ChallengesScreen}
        options={{
          tabBarLabel: t('navigation.challenges'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'flash' : 'flash-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tracking"
        component={TrackingScreen}
        options={{
          tabBarLabel: t('navigation.track'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'stats-chart' : 'stats-chart-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t('navigation.profile'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconWrapper: {
    width: 55,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tabIconWrapperActive: {
    backgroundColor: '#D9E0A9', // soft light olive green pill background
  },
});

export const Navigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="GoalSelection" component={GoalSelectionScreen} />
      <Stack.Screen name="MainApp" component={MainTabNavigator} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      <Stack.Screen name="Premium" component={PremiumSubscriptionScreen} />
      <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
      <Stack.Screen name="Challenges" component={ChallengesScreen} />
      <Stack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
    </Stack.Navigator>
  );
};

export default Navigation;
