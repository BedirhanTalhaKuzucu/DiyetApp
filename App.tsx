import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation/Navigation';
import { TrackingProvider } from './src/context/TrackingContext';
import './src/i18n'; // Bootstrap i18n setup

export default function App() {
  return (
    <TrackingProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Navigation />
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
    </TrackingProvider>
  );
}
