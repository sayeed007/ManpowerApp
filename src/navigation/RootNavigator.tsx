import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SplashScreen from 'react-native-splash-screen';

import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import SubscriptionNavigator from './SubscriptionNavigator';
import {useAppDispatch, useAuth} from '../hooks/useRedux';
import {
  setInitializing,
  setIsSubscribed,
  setSubscription,
  setUser,
} from '../store/slices/authSlice';
import {convertTimestampsToObjects} from '../utils/firestoreHelpers';

const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const {user, isSubscribed, initializing} = useAuth();

  // Handle user state changes
  const onAuthStateChanged = async (
    firebaseUser: FirebaseAuthTypes.User | null,
  ) => {
    dispatch(setUser(firebaseUser));

    if (firebaseUser) {
      // Check subscription status in Firestore
      try {
        const subscriptionDoc = await firestore()
          .collection('subscriptions')
          .doc(firebaseUser.uid)
          .get();

        // Convert subscription data with timestamps to serializable objects
        const subscriptionData = subscriptionDoc.exists
          ? convertTimestampsToObjects(subscriptionDoc.data())
          : null;
        dispatch(setSubscription(subscriptionData));

        // Consider user subscribed if document exists and has a package
        const hasSubscription =
          subscriptionDoc.exists && !!subscriptionDoc.data()?.package;

        dispatch(setIsSubscribed(hasSubscription));
      } catch (error) {
        console.error('Error checking subscription status:', error);
        dispatch(setSubscription(null)); // No user, no subscription data
        dispatch(setIsSubscribed(false)); // Default to not subscribed on error
      }
    } else {
      dispatch(setIsSubscribed(null)); // No user, no subscription
    }

    dispatch(setInitializing(false));
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    // Hide splash screen after checking auth and subscription state
    if (!initializing) {
      SplashScreen.hide();
    }

    return subscriber; // Unsubscribe on unmount
  }, [initializing]);

  // Show nothing while initializing
  if (initializing || (user && isSubscribed === null)) {
    return null;
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : isSubscribed ? (
        <AppNavigator />
      ) : (
        <SubscriptionNavigator />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
