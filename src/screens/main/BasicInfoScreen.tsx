// src/screens/main/BasicInfoScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Input from '../../components/common/Input';
import {colors} from '../../constants/colors';
import {dimensions} from '../../constants/dimensions';

const BasicInfoScreen = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleContinue = () => {
    navigation.navigate('UserTypeSelection');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Basic Information 👏</Text>
          <Text style={styles.subtitle}>
            Lorem ipsum dolor sit amet consectetur. At pulvinar ultrices eget
            ullamcorper mi cras.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWithIcon}>
            <Icon
              name="account-card"
              size={24}
              color={colors.text.secondary}
              style={styles.inputIcon}
            />
            <Input
              placeholder="Full Name As Per Id/Passport"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWithIcon}>
            <Icon
              name="cellphone"
              size={24}
              color={colors.text.secondary}
              style={styles.inputIcon}
            />
            <Input
              placeholder="Mobile Number"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWithIcon}>
            <Icon
              name="email-outline"
              size={24}
              color={colors.text.secondary}
              style={styles.inputIcon}
            />
            <Input
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWithIcon}>
            <Icon
              name="map-marker"
              size={24}
              color={colors.text.secondary}
              style={styles.inputIcon}
            />
            <Input
              placeholder="Home Address"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: dimensions.padding.lg,
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: dimensions.radius.md,
    paddingHorizontal: dimensions.padding.sm,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: dimensions.padding.md,
    fontSize: 16,
  },
  continueButton: {
    width: '100%',
    padding: dimensions.padding.md,
    backgroundColor: colors.primary,
    borderRadius: dimensions.radius.md,
    alignItems: 'center',
    marginTop: 32,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BasicInfoScreen;
