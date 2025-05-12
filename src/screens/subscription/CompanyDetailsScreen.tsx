// src/screens/subscription/CompanyDetailsScreen.tsx
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as yup from 'yup';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FooterButton from '../../components/common/FooterButton';
import Input from '../../components/common/Input';
import Stepper from '../../components/common/Stepper';
import {COLORS} from '../../constants/colors';
import {FONT_SIZES, SPACING, SPACING_H} from '../../constants/dimensions';
import {steps} from '../../constants/steps';
import {STRINGS} from '../../constants/strings';
import {CompanyDetails} from '../../types/subscription.types';
import {loadFormData, saveFormData} from '../../utils/storage';

const schema = yup.object().shape({
  name: yup.string().required('Company/Agency Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  registrationNumber: yup.string().required('Registration Number is required'),
  registrationAddress: yup
    .string()
    .required('Registration Address is required'),
  presentAddress: yup.string().when('isSameAsRegistration', {
    is: false,
    then: schema => schema.required('Present Address is required'),
    otherwise: schema => schema.notRequired(),
  }),
  isSameAsRegistration: yup.boolean(),
});

const CompanyDetailsScreen: React.FC = () => {
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    setValue,
    watch,
    reset,
    trigger,
  } = useForm<CompanyDetails>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      registrationNumber: '',
      registrationAddress: '',
      presentAddress: '',
      isSameAsRegistration: false,
    },
    mode: 'onChange',
  });

  const isSameAsRegistration = watch('isSameAsRegistration');
  const watchRegistrationAddress = watch('registrationAddress');

  useEffect(() => {
    const loadSavedData = async () => {
      const savedData = await loadFormData('companyDetails');
      if (savedData) {
        reset(savedData);
        trigger();
      }
    };
    loadSavedData();
  }, [reset, trigger]);

  const toggleSameAddress = () => {
    const newValue = !isSameAsRegistration;
    setValue('isSameAsRegistration', newValue, {shouldValidate: true});
    if (newValue) {
      setValue('presentAddress', watchRegistrationAddress, {
        shouldValidate: true,
      });
    }
  };

  const onSubmit = async (data: CompanyDetails) => {
    await saveFormData('companyDetails', data);
    navigation.navigate('ContactPersonDetails' as never);
  };

  const handleSkip = async () => {
    const currentData = watch();
    await saveFormData('companyDetails', currentData);
    navigation.navigate('ContactPersonDetails' as never);
  };

  const handleStepNavigation = async (step: string) => {
    if (step === 'CompanyDetails') return;

    const isFormValid = await trigger();
    const stepsKey = Object.keys(steps);
    if (
      !isFormValid &&
      stepsKey.indexOf(step) > stepsKey.indexOf('CompanyDetails')
    ) {
      return;
    }

    const currentData = watch();
    await saveFormData('companyDetails', currentData);
    navigation.navigate(step as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stepper
        steps={steps}
        currentStep="CompanyDetails"
        onStepPress={handleStepNavigation}
        isValid={isValid}
      />
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, {paddingBottom: 100}]} // Add padding to avoid overlap with footer
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {STRINGS.COMPANY_DETAILS} <Text style={styles.handEmoji}>👋</Text>
          </Text>
          <Text style={styles.subtitle}>{STRINGS.COMPANY_DESCRIPTION}</Text>
        </View>

        <Controller
          control={control}
          name="name"
          render={({field: {onChange, value}}) => (
            <Input
              placeholder="Company/Agency Name"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
              leftIcon="office-building"
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
          name="registrationNumber"
          render={({field: {onChange, value}}) => (
            <Input
              placeholder="Registration Number"
              value={value}
              onChangeText={onChange}
              error={errors.registrationNumber?.message}
              leftIcon="file-document"
            />
          )}
        />

        <Controller
          control={control}
          name="registrationAddress"
          render={({field: {onChange, value}}) => (
            <Input
              placeholder="Registration Address"
              value={value}
              onChangeText={text => {
                onChange(text);
                if (isSameAsRegistration) {
                  setValue('presentAddress', text, {shouldValidate: true});
                }
              }}
              error={errors.registrationAddress?.message}
              leftIcon="map-marker"
              multiline
              numberOfLines={4}
            />
          )}
        />

        <Controller
          control={control}
          name="presentAddress"
          render={({field: {onChange, value}}) => (
            <Input
              placeholder="Present Address"
              value={value}
              onChangeText={onChange}
              error={errors.presentAddress?.message}
              leftIcon="map-marker"
              multiline
              numberOfLines={4}
              editable={!isSameAsRegistration}
            />
          )}
        />

        <View style={styles.checkboxContainer}>
          <TouchableOpacity style={styles.checkbox} onPress={toggleSameAddress}>
            <Icon
              name={
                isSameAsRegistration
                  ? 'checkbox-marked'
                  : 'checkbox-blank-outline'
              }
              size={24}
              color={isSameAsRegistration ? COLORS.primary : COLORS.textLight}
            />
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>{STRINGS.SAME_ADDRESS}</Text>
        </View>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  checkbox: {
    padding: SPACING.xs,
  },
  checkboxLabel: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZES.xs,
    color: COLORS.placeholder,
  },
});

export default CompanyDetailsScreen;
