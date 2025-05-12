import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

// Define the auth state type
interface AuthState {
  user: FirebaseAuthTypes.User | null;
  subscription: any;
  isSubscribed: boolean | null;
  initializing: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  subscription: null,
  isSubscribed: null,
  initializing: true,
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set the user
    setUser: (state, action: PayloadAction<FirebaseAuthTypes.User | null>) => {
      state.user = action.payload;
    },
    // Set the subscription
    setSubscription: (state, action: PayloadAction<any>) => {
      state.subscription = action.payload;
    },
    // Set the subscription status
    setIsSubscribed: (state, action: PayloadAction<boolean | null>) => {
      state.isSubscribed = action.payload;
    },
    // Set the initializing state
    setInitializing: (state, action: PayloadAction<boolean>) => {
      state.initializing = action.payload;
    },
    // Logout - reset the state
    logout: state => {
      state.user = null;
      state.subscription = null;
      state.isSubscribed = null;
    },
  },
});

// Export actions and reducer
export const {
  setUser,
  setSubscription,
  setIsSubscribed,
  setInitializing,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
