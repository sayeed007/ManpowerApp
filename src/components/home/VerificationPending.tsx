import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import PendingVerification from '../../assets/images/pending_verification.jpg';
import {COLORS} from '../../constants/colors';

const VerificationPending: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={PendingVerification}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Verification Pending!!!</Text>
      <Text style={styles.subtitle}>
        Please wait for admin to approve your profile
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  image: {
    height: hp('35%'),
  },
  title: {
    fontSize: RFValue(20),
    fontWeight: '700',
    color: COLORS.text,
    marginTop: hp('3%'),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: RFValue(12),
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: hp('2%'),
  },
});

export default VerificationPending;
