import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SplashScreen from 'react-native-splash-screen';

import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import SubscriptionNavigator from './SubscriptionNavigator';

const RootNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);

  // Handle user state changes
  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    if (user) {
      // Check subscription status in Firestore
      try {
        const subscriptionDoc = await firestore()
          .collection('subscriptions')
          .doc(user.uid)
          .get();

        // Consider user subscribed if document exists and has a package
        const isSubscribed =
          subscriptionDoc.exists && !!subscriptionDoc.data()?.package;
        setIsSubscribed(isSubscribed);
      } catch (error) {
        console.error('Error checking subscription status:', error);
        setIsSubscribed(false); // Default to not subscribed on error
      }
    } else {
      setIsSubscribed(null); // No user, no subscription
    }
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    // prezentHide splash screen after checking auth and subscription state
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

// import React, {useEffect, useState} from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
// import SplashScreen from 'react-native-splash-screen';

// import AuthNavigator from './AuthNavigator';
// import AppNavigator from './AppNavigator';
// import SubscriptionNavigator from './SubscriptionNavigator';

// const RootNavigator = () => {
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

//   // Handle user state changes
//   const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
//     setUser(user);
//     if (initializing) setInitializing(false);
//   };

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

//     // Hide splash screen after checking auth state
//     if (!initializing) {
//       SplashScreen.hide();
//     }

//     return subscriber; // Unsubscribe on unmount
//   }, [initializing]);

//   // Show nothing while initializing
//   if (initializing) return null;

//   return (
//     <NavigationContainer>
//       {/* {user ? <AppNavigator /> : <AuthNavigator />} */}
//       {user ? <SubscriptionNavigator /> : <AuthNavigator />}
//     </NavigationContainer>
//   );
// };

// export default RootNavigator;
