import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Input from '../common/Input';
import Button from '../common/Button';
import LoadingIndicator from '../common/LoadingIndicator';
import { COLORS } from '../../constants/colors';

type ResetPasswordFormProps = {
  onSubmit: (data: { password: string; confirmPassword: string }) => void;
  loading: boolean;
};

// Validation schema
const schema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const ResetPasswordForm = ({ onSubmit, loading }: ResetPasswordFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Create a new strong password for your account
      </Text>
      
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="New Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            error={errors.password?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Confirm Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            error={errors.confirmPassword?.message}
          />
        )}
      />

      {loading ? (
        <LoadingIndicator />
      ) : (
        <Button
          title="Reset Password"
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

export default ResetPasswordForm;