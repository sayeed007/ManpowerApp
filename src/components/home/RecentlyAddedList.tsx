import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {COLORS} from '../../constants/colors';
import {boxStyle} from '../../constants/boxStyle';
import UserCard from './UserCard';

const mockData = [
  {
    id: '1',
    role: 'Student',
    name: 'Joshep Daniel',
    profileImage: 'https://i.pravatar.cc/100?img=1',
    cardId: 'AG3456789',
    passes: ['Student Pass', 'EP'],
    isActive: false,
  },
  {
    id: '2',
    role: 'Worker',
    name: 'Jitu Miah',
    profileImage: 'https://i.pravatar.cc/100?img=2',
    cardId: 'AG3456789',
    passes: ['TEP'],
    isActive: true,
  },
  {
    id: '3',
    role: 'Student',
    name: 'Joshep Daniel',
    profileImage: 'https://i.pravatar.cc/100?img=3',
    cardId: 'AG3456789',
    passes: ['Student Pass', 'TEP'],
    isActive: false,
  },
];

const RecentlyAddedList = () => {
  return (
    <View style={[styles.root]}>
      <Text style={styles.heading}>Recently Added</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {mockData.map(user => (
          <UserCard key={user.id} {...user} />
        ))}
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeText}>Upgrade your plan now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    paddingHorizontal: wp('5%'),
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heading: {
    fontSize: RFValue(14),
    fontWeight: '600',
    marginBottom: 12,
    color: COLORS.text,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: wp('5%'),
    width: '100%',
    paddingHorizontal: wp('5%'),
    backgroundColor: COLORS.background,
    paddingBottom: 10,
  },
  upgradeButton: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  upgradeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: RFValue(14),
  },
});

export default RecentlyAddedList;
