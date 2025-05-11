import React, {useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {COLORS} from '../../constants/colors';
import {ROUTES} from '../../constants/routes';
import {NavigationProp} from '@react-navigation/native';

// Import the app logo
import appLogo from '../../assets/images/logo.jpg';

interface SplashScreenProps {
  navigation: NavigationProp<any>;
}

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      // Navigate to the appropriate screen based on authentication state
      // For now, we'll just navigate to the Login screen
      navigation.reset({
        index: 0,
        // routes: [{name: ROUTES.LOGIN}],
        routes: [{name: ROUTES.REGISTER}],
      });
    }, 1000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={appLogo} style={styles.logo} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 350,
    height: 350,
  },
});

export default SplashScreen;
