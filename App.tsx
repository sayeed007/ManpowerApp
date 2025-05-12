import React, {useEffect, useState} from 'react';
import {ActivityIndicator, LogBox, StatusBar, View} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import {Provider as ReduxProvider} from 'react-redux';
import {configureGoogleSignIn, initializeFirebase} from './src/config/firebase';
import {COLORS} from './src/constants/colors';
import RootNavigator from './src/navigation/RootNavigator';
import store from './src/store';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Setting a timer',
  'AsyncStorage has been extracted',
  'VirtualizedLists should never be nested',
]);

const App = () => {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize Firebase
        await initializeFirebase();
        // console.log('Firebase initialized');

        // Configure Google Sign-In
        configureGoogleSignIn();

        // Set Firebase as ready
        setIsFirebaseReady(true);

        // Hide splash screen after a delay
        setTimeout(() => {
          SplashScreen.hide();
        }, 1500);
      } catch (error) {
        console.error('Firebase initialization error:', error);
      }
    };

    initialize();
  }, []);

  if (!isFirebaseReady) {
    // Show a loading screen while Firebase is initializing
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.background,
        }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <PaperProvider>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={COLORS.background}
          />
          <RootNavigator />

          {/* Add Toast component at the bottom of the screen */}
          <Toast config={{}} />
        </PaperProvider>
      </SafeAreaProvider>
    </ReduxProvider>
  );
};

export default App;
