import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import store from '../store';
import {setIsSubscribed, setUser, logout} from '../store/slices/authSlice';

// Authentication services
export const authService = {
  // Sign in with email and password
  signInWithEmailAndPassword: async (email: string, password: string) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      return userCredential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign up with email and password
  signUpWithEmailAndPassword: async (email: string, password: string) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      return userCredential.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      return userCredential.user;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await auth().signOut();
      store.dispatch(logout());
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  // Check subscription status
  checkSubscriptionStatus: async (userId: string) => {
    try {
      const subscriptionDoc = await firestore()
        .collection('subscriptions')
        .doc(userId)
        .get();

      const isSubscribed =
        subscriptionDoc.exists && !!subscriptionDoc.data()?.package;
      store.dispatch(setIsSubscribed(isSubscribed));
      return isSubscribed;
    } catch (error) {
      console.error('Check subscription error:', error);
      store.dispatch(setIsSubscribed(false));
      return false;
    }
  },

  // Update user profile
  updateProfile: async (displayName?: string, photoURL?: string) => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        await currentUser.updateProfile({
          displayName: displayName || currentUser.displayName,
          photoURL: photoURL || currentUser.photoURL,
        });
        // Update user in Redux store
        store.dispatch(setUser(auth().currentUser));
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
};

export default authService;
