// src/screens/main/HomeScreen.tsx
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {COLORS} from '../../constants/colors';
import {useAuth} from '../../hooks/useRedux';

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

  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      const subscriber = firestore()
        .collection('subscriptions')
        .doc(user.uid)
        .onSnapshot(
          doc => {
            const data = doc.data();
            setVerificationStatus(data?.verificationStatus || 'pending');
            setLoading(false);
          },
          error => {
            console.error('Error fetching verification status:', error);
            setVerificationStatus('pending'); // Default to pending on error
            setLoading(false);
          },
        );
      return () => subscriber();
    } else {
      setVerificationStatus('pending');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Icon name="home" size={20} color={COLORS.textLight} />
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.appName}>PEFC Global</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="help-outline" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="notifications" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={20}
          color={COLORS.textLight}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search here..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.textLight}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {verificationStatus === 'pending' ? (
          <>
            <View style={styles.illustration}>
              {/* Placeholder for illustration (use an image or SVG component) */}
              <Icon name="folder" size={100} color={COLORS.primary} />
              <Icon
                name="cloud"
                size={80}
                color={COLORS.primary}
                style={styles.cloud}
              />
              <Icon
                name="search"
                size={60}
                color={COLORS.primary}
                style={styles.magnifyingGlass}
              />
              <Icon
                name="insert-chart"
                size={50}
                color={COLORS.primary}
                style={styles.chart}
              />
            </View>
            <Text style={styles.title}>Verification Pending!!</Text>
            <Text style={styles.subtitle}>
              Please wait for admin to approve your profile
            </Text>
          </>
        ) : (
          <Text style={styles.title}>Welcome to Your Dashboard!</Text>
          // Add dashboard content here when verified
        )}
      </View>

      {/* Bottom Navigation Placeholder (Handled by AppNavigator) */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('5%'),
    backgroundColor: '#E6F0FA',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: RFValue(16),
    color: COLORS.textLight,
    marginLeft: wp('2%'),
  },
  appName: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginLeft: wp('1%'),
  },
  headerIcons: {
    flexDirection: 'row',
    gap: wp('3%'),
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    borderRadius: 20,
    margin: wp('5%'),
    paddingHorizontal: wp('3%'),
    elevation: 2,
  },
  searchIcon: {
    marginRight: wp('2%'),
  },
  searchInput: {
    flex: 1,
    height: hp('6%'),
    fontSize: RFValue(14),
    color: COLORS.textDark,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('5%'),
  },
  illustration: {
    position: 'relative',
    alignItems: 'center',
  },
  cloud: {
    position: 'absolute',
    top: -20,
    left: 20,
  },
  magnifyingGlass: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  chart: {
    position: 'absolute',
    bottom: 20,
    left: 30,
  },
  title: {
    fontSize: RFValue(24),
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: hp('3%'),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: RFValue(16),
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: hp('2%'),
  },
});

export default HomeScreen;
