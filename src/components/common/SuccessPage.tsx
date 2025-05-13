// src/screens/main/SuccessPage.tsx
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import {colors} from '../../constants/colors';
import {dimensions} from '../../constants/dimensions';

const SuccessPage = () => {
  const navigation = useNavigation();

  const handleContinue = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.checkmarkContainer}>
          <View style={styles.checkBackground}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>
        <Text style={styles.title}>Thank You!</Text>
        <Text style={styles.subtitle}>Added Successfully!</Text>
      </View>
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>TAP TO CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    padding: dimensions.padding.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkContainer: {
    marginBottom: 30,
  },
  checkBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  checkmark: {
    fontSize: 40,
    color: colors.success,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  continueButton: {
    width: '100%',
    padding: dimensions.padding.md,
    backgroundColor: colors.primary,
    borderRadius: dimensions.radius.md,
    alignItems: 'center',
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SuccessPage;
