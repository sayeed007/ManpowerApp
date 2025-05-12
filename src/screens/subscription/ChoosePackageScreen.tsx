// src/screens/subscription/ChoosePackageScreen.tsx
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Button from '../../components/common/Button';
import {COLORS} from '../../constants/colors';
import {Package} from '../../types/subscription.types';
import {loadFormData} from '../../utils/storage';

const ChoosePackageScreen: React.FC = () => {
  const navigation = useNavigation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'yearly',
  );
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const packages: Package[] = [
    {
      id: 'standard',
      name: 'Standard Pack',
      price: 15,
      billingCycle: 'monthly',
      features: [
        'Display stars in Google organic search result and showcase reviews on your website',
        '20,000 Visitors',
        'Create Unlimited Widgets',
        'CMS Integration',
      ],
    },
    // Add more packages as needed
  ];

  const handleSubmitToFirebase = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Load data from each form step
      const companyDetails = await loadFormData('companyDetails');
      const contactPersonDetails = await loadFormData('contactPersonDetails');
      const verifyDocuments = await loadFormData('verifyDocuments');
      const packageDetails = selectedPackage
        ? packages.find(pkg => pkg.id === selectedPackage)
        : null;

      // Combine all form data
      const submissionData = {
        userId: user.uid,
        companyDetails: companyDetails || {},
        contactPersonDetails: contactPersonDetails || {},
        documents: verifyDocuments?.documents || [],
        package: packageDetails || null,
        billingCycle,
        isVerifiedByAdmin: false,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      // Save to Firestore
      await firestore()
        .collection('subscriptions')
        .doc(user.uid)
        .set(submissionData, {merge: true});

      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Form data submitted successfully!',
        position: 'top',
        visibilityTime: 1500,
      });
      // Navigate to a confirmation screen or home screen
      navigation.navigate('Home' as never); // Adjust the navigation target as needed
    } catch (error: any) {
      console.error('Error submitting form data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error!',
        text2: `Failed to submit form data: ${error.message}`,
        position: 'top',
        visibilityTime: 1500,
      });
    }
  };

  const handleContinue = async () => {
    if (selectedPackage) {
      await handleSubmitToFirebase();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error!',
        text2: `Please select a package to continue.`,
        position: 'top',
        visibilityTime: 1500,
      });
    }
  };

  const handleSkip = async () => {
    // Submit data even if no package is selected
    await handleSubmitToFirebase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Choose Package <Text style={styles.handEmoji}>👋</Text>
          </Text>
          <Text style={styles.subtitle}>
            Lorem ipsum dolor sit amet consectetur. At pulvinar ultrices eget
            ullamcorper mi cras.
          </Text>
        </View>

        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[
              styles.billingOption,
              billingCycle === 'monthly' && styles.billingOptionActive,
            ]}
            onPress={() => setBillingCycle('monthly')}>
            <Text
              style={[
                styles.billingText,
                billingCycle === 'monthly' && styles.billingTextActive,
              ]}>
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.billingOption,
              billingCycle === 'yearly' && styles.billingOptionActive,
            ]}
            onPress={() => setBillingCycle('yearly')}>
            <Text
              style={[
                styles.billingText,
                billingCycle === 'yearly' && styles.billingTextActive,
              ]}>
              Yearly
            </Text>
          </TouchableOpacity>
        </View>

        {packages.map(pkg => (
          <TouchableOpacity
            key={pkg.id}
            style={[
              styles.packageCard,
              selectedPackage === pkg.id && styles.packageCardSelected,
            ]}
            onPress={() => setSelectedPackage(pkg.id)}>
            <View style={styles.packageHeader}>
              <Icon name="asterisk" size={24} color="#000" />
              <Text style={styles.packageName}>{pkg.name}</Text>
            </View>
            <Text style={styles.packageDescription}>{pkg.features[0]}</Text>
            {pkg.features.slice(1).map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Icon name="check" size={20} color={COLORS.primary} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
            <View style={styles.priceContainer}>
              <Text style={styles.priceValue}>${pkg.price}</Text>
              <Text style={styles.pricePeriod}>per month</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!selectedPackage}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    padding: wp('5%'),
  },
  header: {
    marginBottom: hp('3%'),
  },
  title: {
    fontSize: RFValue(24),
    fontWeight: '700',
    marginBottom: hp('1%'),
    color: '#000000',
  },
  handEmoji: {
    fontSize: RFValue(22),
  },
  subtitle: {
    fontSize: RFValue(14),
    color: '#888888',
    lineHeight: RFValue(20),
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 30,
    marginBottom: hp('2%'),
    padding: 4,
  },
  billingOption: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  billingOptionActive: {
    backgroundColor: COLORS.primary,
  },
  billingText: {
    fontSize: RFValue(14),
    fontWeight: '500',
    color: '#888888',
  },
  billingTextActive: {
    color: '#FFFFFF',
  },
  packageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: wp('5%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  packageCardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  packageName: {
    fontSize: RFValue(18),
    fontWeight: '700',
    marginLeft: wp('2%'),
    color: '#000000',
  },
  packageDescription: {
    fontSize: RFValue(14),
    color: '#6B7280',
    lineHeight: RFValue(20),
    marginBottom: hp('2%'),
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  featureText: {
    fontSize: RFValue(14),
    color: '#4B5563',
    marginLeft: wp('2%'),
  },
  priceContainer: {
    marginTop: hp('2%'),
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceValue: {
    fontSize: RFValue(28),
    fontWeight: 'bold',
    color: '#000000',
  },
  pricePeriod: {
    fontSize: RFValue(14),
    color: '#6B7280',
    marginLeft: wp('1%'),
  },
  actionContainer: {
    marginTop: hp('2%'),
  },
  skipButton: {
    alignItems: 'center',
    marginBottom: hp('1.5%'),
    paddingVertical: hp('1%'),
  },
  skipText: {
    fontSize: RFValue(14),
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default ChoosePackageScreen;
