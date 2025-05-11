import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Input from '../common/Input';
import Button from '../common/Button';
import LoadingIndicator from '../common/LoadingIndicator';
import { COLORS } from '../../constants/colors';

type ForgotPasswordFormProps = {
  onSubmit: (data: { email: string }) => void;
  loading: boolean;
};

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
});

const ForgotPasswordForm = ({ onSubmit, loading }: ForgotPasswordFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Enter your email address and we'll send you a verification code to reset your password.
      </Text>
      
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email?.message}
          />
        )}
      />

      {loading ? (
        <LoadingIndicator />
      ) : (
        <Button
          title="Send Code"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 20,
  },
  message: {
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
});

export default ForgotPasswordForm;