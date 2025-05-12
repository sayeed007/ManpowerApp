import firestore from '@react-native-firebase/firestore';
import store from '../store';
import {setIsSubscribed} from '../store/slices/authSlice';

// Subscription types
export type SubscriptionPackage = 'basic' | 'premium' | 'enterprise';

export interface Subscription {
  package: SubscriptionPackage;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  status: 'active' | 'expired' | 'canceled';
}

// Subscription services
export const subscriptionService = {
  // Get user subscription
  getUserSubscription: async (userId: string) => {
    try {
      const subscriptionDoc = await firestore()
        .collection('subscriptions')
        .doc(userId)
        .get();

      if (subscriptionDoc.exists) {
        const data = subscriptionDoc.data() as Subscription;
        // Convert Firestore timestamps to Date objects
        return {
          ...data,
          startDate: data.startDate.toDate(),
          endDate: data.endDate.toDate(),
        };
      }
      return null;
    } catch (error) {
      console.error('Get subscription error:', error);
      throw error;
    }
  },

  // Subscribe user to a package
  subscribeUser: async (
    userId: string,
    subscriptionPackage: SubscriptionPackage,
    autoRenew: boolean = true,
    durationMonths: number = 1,
  ) => {
    try {
      const now = new Date();
      const endDate = new Date();
      endDate.setMonth(now.getMonth() + durationMonths);

      const subscription: Subscription = {
        package: subscriptionPackage,
        startDate: now,
        endDate: endDate,
        autoRenew: autoRenew,
        status: 'active',
      };

      await firestore()
        .collection('subscriptions')
        .doc(userId)
        .set(subscription);

      // Update subscription status in Redux
      store.dispatch(setIsSubscribed(true));

      return subscription;
    } catch (error) {
      console.error('Subscribe user error:', error);
      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async (userId: string) => {
    try {
      const subscriptionRef = firestore()
        .collection('subscriptions')
        .doc(userId);

      await subscriptionRef.update({
        autoRenew: false,
        status: 'canceled',
      });

      // Get the updated subscription
      return await subscriptionService.getUserSubscription(userId);
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  },

  // Check if subscription is active
  isSubscriptionActive: async (userId: string) => {
    try {
      const subscription = await subscriptionService.getUserSubscription(
        userId,
      );

      if (!subscription) {
        store.dispatch(setIsSubscribed(false));
        return false;
      }

      const isActive =
        subscription.status === 'active' && subscription.endDate > new Date();

      store.dispatch(setIsSubscribed(isActive));
      return isActive;
    } catch (error) {
      console.error('Check subscription active error:', error);
      store.dispatch(setIsSubscribed(false));
      return false;
    }
  },
};

export default subscriptionService;
