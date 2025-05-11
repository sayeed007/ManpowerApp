import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import auth from '@react-native-firebase/auth';
import {NavigationProp, RouteProp} from '@react-navigation/native';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import {COLORS} from '../../constants/colors';
import {ROUTES} from '../../constants/routes';
import {STRINGS} from '../../constants/strings';
import {SPACING} from '../../constants/dimensions';

type ResetPasswordParamList = {
  ResetPassword: {
    email: string;
  };
};

interface ResetPasswordScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<ResetPasswordParamList, 'ResetPassword'>;
}

interface ResetPasswordFormData {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

const schema = yup.object().shape({
  otp: yup
    .string()
    .required('OTP is required')
    .length(6, 'OTP must be 6 digits'),
  newPassword: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const {email} = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // In a real app, we'd implement proper OTP verification with Firebase
  // For now, we'll simulate the OTP verification and password reset
  const resetPassword = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate OTP verification
      if (data.otp !== '123456') {
        // For demo purposes, OTP is always 123456
        setError('Invalid verification code');
        setLoading(false);
        return;
      }

      // In a real app, we'd use Firebase's confirmPasswordReset API
      // For now, we'll just show a success message and navigate back to login
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Success', 'Your password has been reset successfully', [
          {
            text: 'OK',
            onPress: () => navigation.navigate(ROUTES.LOGIN),
          },
        ]);
      }, 1000);
    } catch (error: any) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter the verification code sent to {email} and your new password
          </Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <Controller
              control={control}
              name="otp"
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  label="Verification Code"
                  placeholder="Enter 6 digit code"
                  keyboardType="number-pad"
                  leftIcon="key"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.otp?.message}
                  maxLength={6}
                />
              )}
            />

            <Controller
              control={control}
              name="newPassword"
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  label="New Password"
                  placeholder="Enter new password"
                  isPassword
                  leftIcon="lock"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.newPassword?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  isPassword
                  leftIcon="lock"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            <Button
              title={STRINGS.RESET_PASSWORD}
              onPress={handleSubmit(resetPassword)}
              isLoading={loading}
              containerStyle={styles.resetButton}
            />

            <TouchableOpacity
              style={styles.resendCodeContainer}
              onPress={() =>
                Alert.alert(
                  'Resend Code',
                  'A new verification code has been sent.',
                )
              }>
              <Text style={styles.resendCodeText}>
                Resend verification code
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: SPACING.lg,
    left: SPACING.lg,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
  },
  resetButton: {
    marginTop: SPACING.sm,
  },
  resendCodeContainer: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  resendCodeText: {
    color: COLORS.primary,
    fontSize: 14,
  },
});

export default ResetPasswordScreen;
