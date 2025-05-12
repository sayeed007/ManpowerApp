// src/screens/subscription/ContactPersonDetailsScreen.tsx
import React, {useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Input from '../../components/common/Input';
import Stepper from '../../components/common/Stepper';
import {ContactPerson} from '../../types/subscription.types';
import {COLORS} from '../../constants/colors';
import {FONT_SIZES, SPACING, SPACING_H} from '../../constants/dimensions';
import {STRINGS} from '../../constants/strings';
import {saveFormData, loadFormData} from '../../utils/storage';
import FooterButton from '../../components/common/FooterButton';
import {steps} from '../../constants/steps';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  idNumber: yup.string().required('ID/Passport Number is required'),
  mobileNumber: yup.string().required('Mobile Number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  designation: yup.string().required('Designation is required'),
});

const ContactPersonDetailsScreen: React.FC = () => {
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
    trigger,
    watch,
  } = useForm<ContactPerson>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      idNumber: '',
      mobileNumber: '',
      email: '',
      designation: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const loadSavedData = async () => {
      const savedData = await loadFormData('contactPersonDetails');
      if (savedData) {
        reset(savedData);
        trigger();
      }
    };
    loadSavedData();
  }, [reset, trigger]);

  const onSubmit = async (data: ContactPerson) => {
    await saveFormData('contactPersonDetails', data);
    // navigation.navigate('VerifyDocuments' as never);
    navigation.navigate('ChoosePackage' as never);
  };

  const handleSkip = async () => {
    const currentData = watch();
    await saveFormData('contactPersonDetails', currentData);
    // navigation.navigate('VerifyDocuments' as never);
    navigation.navigate('ChoosePackage' as never);
  };

  const handleStepNavigation = async (step: string) => {
    if (step === 'ContactPersonDetails') return;

    const isFormValid = await trigger();
    const stepsKey = Object.keys(steps);
    if (
      !isFormValid &&
      stepsKey.indexOf(step) > stepsKey.indexOf('ContactPersonDetails')
    ) {
      return;
    }

    const currentData = watch();
    await saveFormData('contactPersonDetails', currentData);
    navigation.navigate(step as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stepper
        steps={steps}
        currentStep="ContactPersonDetails"
        onStepPress={handleStepNavigation}
        isValid={isValid}
      />
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, {paddingBottom: 100}]} // Add padding to avoid overlap with footer
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            Contact Person Details <Text style={styles.handEmoji}>👋</Text>
          </Text>
          <Text style={styles.subtitle}>
            {STRINGS.CONTACT_PERSON_DESCRIPTION}
          </Text>
        </View>

        <Controller
          control={control}
          name="name"
          render={({field: {onChange, value}}) => (
            <Input
              placeholder="Name"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
              leftIcon="account"
            />
          )}
        />

        <Controller
          control={control}
          name="idNumber"
          render={({field: {onChange, value}}) => (
            <Input
              placeholder="ID/Passport Number"
              value={value}
              onChangeText={onChange}
              error={errors.idNumber?.message}
              leftIcon="card-account-details"
            />
          )}
        />

        <Controller
          control={control}
          name="mobileNumber"
          render={({field: {onChange, value}}) => (
            <Input
              placeholder="Mobile Number"
              value={value}
              onChangeText={onChange}
              keyboardType="phone-pad"
              error={errors.mobileNumber?.message}
              leftIcon="cellphone"
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({field: {onChange, value}}) => (
            <Input
              placeholder="Email Address"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
              leftIcon="email"
            />
          )}
        />

        <Controller
          control={control}
          name="designation"
          render={({field: {onChange, value}}) => (
            <Input
              placeholder="Designation"
              value={value}
              onChangeText={onChange}
              error={errors.designation?.message}
              leftIcon="badge-account"
            />
          )}
        />
      </ScrollView>

      <FooterButton
        onContinue={handleSubmit(onSubmit)}
        onSkip={handleSkip}
        isContinueDisabled={!isValid}
        isSkipVisible={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: SPACING.sm,
  },
  header: {
    marginBottom: hp('3%'),
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginBottom: SPACING_H.one,
    color: COLORS.text,
  },
  handEmoji: {
    fontSize: FONT_SIZES.xxl,
  },
  subtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    lineHeight: FONT_SIZES.xl,
  },
});

export default ContactPersonDetailsScreen;
