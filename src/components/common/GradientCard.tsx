import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useAuth} from '../../hooks/useRedux';
import {getGreeting} from '../../utils/greeting';

const GradientCard = () => {
  const {subscription} = useAuth();

  return (
    <LinearGradient
      colors={COLORS.gradientCardColors} // Use your gradient stops
      start={{x: 0, y: 1}}
      end={{x: 1, y: 1}}
      style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.profileSection}>
          <View style={styles.agencyCircle}>
            <Image
              source={{
                uri: 'https://img.icons8.com/emoji/48/department-store.png',
              }}
              style={styles.avatar}
            />
          </View>

          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.orgName}>
              {subscription?.contactPersonDetails?.name}
            </Text>
          </View>
        </View>

        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconCircle}>
            <Icon
              name={'progress-question'}
              size={24}
              color={COLORS.textLight}
              style={styles.searchIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <Icon
              name={'bell-ring-outline'}
              size={24}
              color={COLORS.textLight}
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon
          name={'account-search-outline'}
          size={20}
          color={COLORS.textLight}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search here..."
          style={styles.searchInput}
          placeholderTextColor={COLORS.placeholder}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 60,
    borderRadius: 20,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  agencyCircle: {
    backgroundColor: COLORS.background,
    width: 36,
    height: 36,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
  },
  greeting: {
    fontSize: 12,
    color: COLORS.textSemiLight,
  },
  orgName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 10,
  },
  iconCircle: {
    backgroundColor: COLORS.background,
    width: 36,
    height: 36,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    paddingLeft: 4,
  },
  iconText: {
    fontSize: 16,
  },
  searchInput: {
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gradientInput,
    borderRadius: 20,
    marginVertical: wp('5%'),
    marginHorizontal: wp('2%'),
    paddingHorizontal: wp('2%'),
    elevation: 2,
  },
  searchIcon: {
    marginRight: wp('2%'),
  },
});

export default GradientCard;
