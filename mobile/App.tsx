import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import ConnectionLostScreen from './src/screens/ConnectionLostScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TriageResultsScreen from './src/screens/TriageResultsScreen';
import SymptomHistoryScreen from './src/screens/SymptomHistoryScreen';
import AnalyzingSymptomsScreen from './src/screens/AnalyzingSymptomsScreen';
import FollowUpInteractionScreen from './src/screens/FollowUpInteractionScreen';
import BodyMapScreen from './src/screens/BodyMapScreen';
import SymptomInputScreen from './src/screens/SymptomInputScreen';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';

type Screen = 'auth' | 'home' | 'connection' | 'settings' | 'profile' | 'triage' | 'history' | 'analyzing' | 'followup' | 'bodymap' | 'input';

export default function App() {
  const [screen, setScreen] = useState<Screen>('auth');

  useEffect(() => {
    if (Platform.OS === 'web') {
      document.title = "MOI-DOCTAR";
    }
  }, []);

  return (
    <>
      {screen === 'auth' && (
        <AuthScreen onLogin={() => setScreen('home')} />
      )}
      {screen === 'home' && (
        <HomeScreen
          onStartSymptomCheck={() => setScreen('input')}
          onGoToBodyMap={() => setScreen('bodymap')}
          onGoToVoiceInput={() => setScreen('input')}
          onGoToHistory={() => setScreen('history')}
          onGoToProfile={() => setScreen('profile')}
        />
      )}
      {screen === 'connection' && (
        <ConnectionLostScreen onAccessOfflineData={() => setScreen('settings')} />
      )}
      {screen === 'settings' && (
        <SettingsScreen onBack={() => setScreen('connection')} />
      )}
      {screen === 'profile' && (
        <ProfileScreen
          onBack={() => setScreen('connection')}
          onGoToSettings={() => setScreen('settings')}
          onGoToHome={() => setScreen('connection')}
          onGoToHistory={() => setScreen('history')}
        />
      )}
      {screen === 'triage' && (
        <TriageResultsScreen
          onBack={() => setScreen('connection')} // using connection as home placeholder for now
          onGoToProfile={() => setScreen('profile')}
          onGoToHistory={() => setScreen('history')}
        />
      )}
      {screen === 'history' && (
        <SymptomHistoryScreen
          onGoToHome={() => setScreen('connection')} // using connection as home placeholder
          onGoToProfile={() => setScreen('profile')}
        />
      )}
      {screen === 'analyzing' && (
        <AnalyzingSymptomsScreen
          onFinishAnalysis={() => setScreen('triage')}
        />
      )}
      {screen === 'followup' && (
        <FollowUpInteractionScreen
          onBack={() => setScreen('history')}
          onNext={() => setScreen('analyzing')}
        />
      )}
      {screen === 'bodymap' && (
        <BodyMapScreen
          onBack={() => setScreen('history')}
          onContinue={() => setScreen('followup')}
        />
      )}
      {screen === 'input' && (
        <SymptomInputScreen
          onContinue={() => setScreen('bodymap')}
          onGoToHome={() => setScreen('connection')}
          onGoToHistory={() => setScreen('history')}
          onGoToProfile={() => setScreen('profile')}
        />
      )}
      <StatusBar style="dark" />
    </>
  );
}



