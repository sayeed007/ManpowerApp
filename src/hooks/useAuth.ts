import {useState, useEffect} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {Platform} from 'react-native';

type AuthError = {
  code: string;
  message: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Initialize GoogleSignin
    GoogleSignin.configure({
      webClientId:
        '910557937730-f05ld824oi60fgkns87hujbpac0lk1rc.apps.googleusercontent.com',
    });

    // Listen for auth state changes
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Email/Password Sign Up
  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    setAuthError(null);

    try {
      const {user} = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      await user.updateProfile({displayName: name});
      return user;
    } catch (error: any) {
      setAuthError({
        code: error.code,
        message: error.message,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Sign In
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setAuthError(null);

    try {
      const {user} = await auth().signInWithEmailAndPassword(email, password);
      return user;
    } catch (error: any) {
      setAuthError({
        code: error.code,
        message: error.message,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);

    try {
      // Get the user ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in with the credential
      const {user} = await auth().signInWithCredential(googleCredential);
      return user;
    } catch (error: any) {
      setAuthError({
        code: error.code || 'google_sign_in_error',
        message: error.message || 'An error occurred during Google sign in',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Apple Sign In
  const signInWithApple = async () => {
    // Only available on iOS
    if (Platform.OS !== 'ios') {
      setAuthError({
        code: 'apple_sign_in_unavailable',
        message: 'Apple Sign In is only available on iOS devices',
      });
      return null;
    }

    setLoading(true);
    setAuthError(null);

    try {
      // Perform the apple authentication flow
      const appleAuthResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthResponse.identityToken) {
        throw new Error('Apple Sign In failed - no identity token returned');
      }

      // Create a credential for Firebase Auth
      const credential = auth.AppleAuthProvider.credential(
        appleAuthResponse.identityToken,
        appleAuthResponse.nonce,
      );

      // Sign in with the credential
      const {user} = await auth().signInWithCredential(credential);

      // If this is the first sign-in and we have a full name
      if (
        appleAuthResponse.fullName &&
        appleAuthResponse.fullName.givenName &&
        appleAuthResponse.fullName.familyName
      ) {
        const displayName = `${appleAuthResponse.fullName.givenName} ${appleAuthResponse.fullName.familyName}`;
        await user.updateProfile({displayName});
      }

      return user;
    } catch (error: any) {
      setAuthError({
        code: error.code || 'apple_sign_in_error',
        message: error.message || 'An error occurred during Apple sign in',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    setAuthError(null);

    try {
      await auth().signOut();
      // If the user signed in with Google, sign out from there too
      if (await GoogleSignin.isSignedIn()) {
        await GoogleSignin.signOut();
      }
    } catch (error: any) {
      setAuthError({
        code: error.code || 'sign_out_error',
        message: error.message || 'An error occurred during sign out',
      });
    } finally {
      setLoading(false);
    }
  };

  // Password reset
  const sendPasswordResetEmail = async (email: string) => {
    setLoading(true);
    setAuthError(null);

    try {
      await auth().sendPasswordResetEmail(email);
      return true;
    } catch (error: any) {
      setAuthError({
        code: error.code,
        message: error.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP code (for custom implementation of password reset)
  const verifyOtpCode = async (email: string, code: string) => {
    // This is a placeholder for a custom implementation
    // Typically, you'd verify this on your backend or using Firebase Functions
    return true;
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    setLoading(true);
    setAuthError(null);

    try {
      if (!user) {
        throw new Error('No user is currently logged in');
      }

      await user.updatePassword(newPassword);
      return true;
    } catch (error: any) {
      setAuthError({
        code: error.code,
        message: error.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    authError,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    signOut,
    sendPasswordResetEmail,
    verifyOtpCode,
    updatePassword,
  };
};

export default useAuth;
