// app shell
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { CompetitionDetailsScreen } from './src/screens/CompetitionDetailsScreen';

// keep the root quiet and predictable
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <CompetitionDetailsScreen />
    </SafeAreaProvider>
  );
}
