// src/navigation/SubscriptionNavigator.tsx
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import CompanyDetailsScreen from '../screens/subscription/CompanyDetailsScreen';
import ContactPersonDetailsScreen from '../screens/subscription/ContactPersonDetailsScreen';
import VerifyDocumentsScreen from '../screens/subscription/VerifyDocumentsScreen';
import ChoosePackageScreen from '../screens/subscription/ChoosePackageScreen';

const Stack = createStackNavigator();

const SubscriptionNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="CompanyDetails" component={CompanyDetailsScreen} />
      <Stack.Screen
        name="ContactPersonDetails"
        component={ContactPersonDetailsScreen}
      />
      <Stack.Screen name="VerifyDocuments" component={VerifyDocumentsScreen} />
      <Stack.Screen name="ChoosePackage" component={ChoosePackageScreen} />
    </Stack.Navigator>
  );
};

export default SubscriptionNavigator;
