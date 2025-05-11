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
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {NavigationProp} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

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

interface LoginScreenProps {
  navigation: NavigationProp<any>;
}

interface LoginFormData {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onLogin = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Sign in with Firebase
      await auth().signInWithEmailAndPassword(data.email, data.password);

      // Show toast notification instead of alert
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        visibilityTime: 3000, // Duration in ms
      });

      // Navigate to Home screen (uncomment and implement as needed)
      // navigation.navigate(ROUTES.HOME);
    } catch (error: any) {
      // Handle login errors
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        setError('Invalid email or password');
      } else if (error.code === 'auth/invalid-email') {
        setError('That email address is invalid!');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      // Google Sign-In
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);

      // Show toast notification instead of alert
      Toast.show({
        type: 'success',
        text1: 'Google Login Successful',
        visibilityTime: 3000,
      });

      // Navigate to Home screen (uncomment and implement as needed)
      // navigation.navigate(ROUTES.HOME);
    } catch (error: any) {
      setError('An error occurred during Google sign-in. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onAppleSignIn = () => {
    // Show toast notification instead of alert
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
            <Text style={styles.title}>{STRINGS.WELCOME_BACK}</Text>
            <Text style={styles.subtitle}>Welcome back to Manpower</Text>

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

              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}>
                <Text style={styles.forgotPasswordText}>
                  {STRINGS.FORGOT_PASSWORD}
                </Text>
              </TouchableOpacity>

              <Button
                title={STRINGS.SIGN_IN}
                onPress={handleSubmit(onLogin)}
                isLoading={loading}
                containerStyle={styles.loginButton}
              />

              <View style={styles.registerLinkContainer}>
                <Text style={styles.registerLinkText}>
                  {STRINGS.DONT_HAVE_ACCOUNT}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate(ROUTES.REGISTER)}>
                  <Text style={styles.registerLink}>{STRINGS.SIGN_UP}</Text>
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
    marginTop: SPACING.md,
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.md,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: SPACING.md,
  },
  registerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  registerLinkText: {
    color: COLORS.textLight,
    marginRight: SPACING.xs,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;
