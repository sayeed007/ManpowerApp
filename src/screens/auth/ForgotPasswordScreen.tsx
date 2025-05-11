import React, { useState } from 'react';
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
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import auth from '@react-native-firebase/auth';
import { NavigationProp } from '@react-navigation/native';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { COLORS } from '../../constants/colors';
import { ROUTES } from '../../constants/routes';
import { STRINGS } from '../../constants/strings';
import { SPACING } from '../../constants/dimensions';

interface ForgotPasswordScreenProps {
  navigation: NavigationProp<any>;
}

interface ForgotPasswordFormData {
  email: string;
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const sendResetEmail = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Send password reset email via Firebase
      await auth().sendPasswordResetEmail(data.email);
      
      // Store email for the next step
      setEmail(data.email);
      
      // Set OTP sent flag to true
      setOtpSent(true);
      
      // In a real app, we'd wait for the user to enter OTP
      // For now, we'll show an alert and navigate to the verification screen
      Alert.alert(
        'OTP Sent',
        'A verification code has been sent to your email address.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate(ROUTES.RESET_PASSWORD, { email: data.email })
          }
        ]
      );
    } catch (error: any) {
      // Handle errors
      if (error.code === 'auth/user-not-found') {
        setError('No user found with this email address.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>{STRINGS.FORGOT_PASSWORD}</Text>
          <Text style={styles.subtitle}>
            Enter your email address to receive a verification code
          </Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon="email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />
            
            <Button
              title={STRINGS.SEND_OTP}
              onPress={handleSubmit(sendResetEmail)}
              isLoading={loading}
              containerStyle={styles.sendButton}
            />
            
            <TouchableOpacity 
              style={styles.loginLinkContainer}
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
            >
              <Text style={styles.loginLinkText}>Back to login</Text>
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
  sendButton: {
    marginTop: SPACING.sm,
  },
  loginLinkContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  loginLinkText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ForgotPasswordScreen;