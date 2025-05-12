import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {NavigationProp} from '@react-navigation/native';
import Toast from 'react-native-toast-message'; // Fixed import

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import SocialButton from '../../components/common/SocialButton';
import Divider from '../../components/common/Divider';
import {COLORS} from '../../constants/colors';
import {ROUTES} from '../../constants/routes';
import {STRINGS} from '../../constants/strings';
import {SPACING} from '../../constants/dimensions';

import googleIcon from '../../assets/images/google.jpeg';
import appleIcon from '../../assets/images/apple_black.jpeg';

interface RegisterScreenProps {
  navigation: NavigationProp<any>;
}

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onRegister = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Register with Firebase
      await auth().createUserWithEmailAndPassword(data.email, data.password);

      // Navigate to Home screen or confirmation screen
      // For now, let's just navigate back to Login
      navigation.navigate(ROUTES.LOGIN);
    } catch (error: any) {
      // Handle registration errors
      if (error.code === 'auth/email-already-in-use') {
        setError('That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        setError('That email address is invalid!');
      } else {
        setError('An error occurred during registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      // Ensure Google Play Services are available
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

      // Prompt user to sign in
      const userInfo: any = await GoogleSignin.signIn();
      const idToken = userInfo?.data?.idToken;

      if (!idToken) {
        throw new Error('Google ID Token is undefined');
      }

      // Authenticate with Firebase
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);

      // Navigate after successful sign-in
      navigation.navigate(ROUTES.LOGIN);
    } catch (error: any) {
      const errorMessage =
        'An error occurred during Google sign-in. Please try again.';
      setError(errorMessage);

      // Optional: Show toast feedback
      Toast.show({
        type: 'error',
        text1: 'Google Sign-In Failed',
        text2: error.message || errorMessage,
      });

      console.error('[Google Sign-In Error]', error);
    } finally {
      setLoading(false);
    }
  };

  const onAppleSignIn = () => {
    // Show toast notification
    Toast.show({
      type: 'info',
      text1: 'Apple Sign-In',
      text2: 'Not implemented yet',
      visibilityTime: 3000,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={styles.title}>{STRINGS.SIGN_UP}</Text>
            <Text style={styles.subtitle}>Create a new account</Text>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    // label="Email"
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
              <Controller
                control={control}
                name="password"
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    // label="Password"
                    placeholder="Enter your password"
                    isPassword
                    leftIcon="lock"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="confirmPassword"
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    // label="Confirm Password"
                    placeholder="Confirm your password"
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
                title={STRINGS.SIGN_UP}
                onPress={handleSubmit(onRegister)}
                isLoading={loading}
                containerStyle={styles.registerButton}
              />
              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginLinkText}>
                  {STRINGS.ALREADY_HAVE_ACCOUNT}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate(ROUTES.LOGIN)}>
                  <Text style={styles.loginLink}>{STRINGS.SIGN_IN}</Text>
                </TouchableOpacity>
              </View>

              <Divider text={STRINGS.OR} />

              <SocialButton
                title={STRINGS.CONTINUE_WITH_GOOGLE}
                icon={googleIcon}
                onPress={onGoogleSignIn}
                disabled={loading}
              />

              <SocialButton
                title={STRINGS.CONTINUE_WITH_APPLE}
                icon={appleIcon}
                onPress={onAppleSignIn}
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
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
    backgroundColor: COLORS.error + '20', // 20% opacity
    padding: SPACING.sm,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
  },
  registerButton: {
    marginTop: SPACING.md,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  loginLinkText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
});

export default RegisterScreen;
