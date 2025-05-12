import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

// Configure the store
const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here as needed
  },
  // Optional middleware configuration
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in the specified action types
        ignoredActions: ['auth/setUser'],
        // Ignore non-serializable paths
        ignoredPaths: ['auth.user'],
      },
    }),
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
