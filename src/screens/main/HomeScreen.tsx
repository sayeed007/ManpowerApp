// src/screens/main/HomeScreen.tsx
import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import PendingVerification from '../../assets/images/pending_verification.jpg';
import GradientCard from '../../components/common/GradientCard';
import VerticalLine from '../../components/common/VerticalLine';
import {COLORS} from '../../constants/colors';
import {useAuth} from '../../hooks/useRedux';
import VerificationPending from '../../components/home/VerificationPending';
import RecentlyAddedList from '../../components/home/RecentlyAddedList';

const HomeScreen: React.FC = () => {
  // Access auth state from Redux
  const {user, subscription, isSubscribed, initializing} = useAuth();
  console.log(
    user,
    subscription,
    isSubscribed,
    initializing,
    'store data..........',
  );
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar />

      {/* Header */}
      <GradientCard />

      {/* VERTICAL */}
      <VerticalLine width={'90%'} />

      {/* Content */}
      <View style={styles.content}>
        {subscription?.isVerifiedByAdmin ? (
          <VerificationPending />
        ) : (
          <RecentlyAddedList />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: RFValue(20),
    fontWeight: '700',
    color: COLORS.text,
    marginTop: hp('3%'),
    textAlign: 'center',
  },
});

export default HomeScreen;
