import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLORS} from '../../constants/colors';

interface Props {
  role: string;
  name: string;
  profileImage: string;
  cardId: string;
  passes: string[];
  isActive?: boolean;
}

const UserCard: React.FC<Props> = ({
  role,
  name,
  profileImage,
  cardId,
  passes,
  isActive,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{uri: profileImage}} style={styles.avatar} />
        <View style={{flex: 1}}>
          <Text style={styles.role}>{role}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
        <View
          style={[
            styles.statusDot,
            {backgroundColor: isActive ? 'green' : 'gold'},
          ]}
        />
      </View>

      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cardId}</Text>
        </View>
        {passes.map((p, i) => (
          <View key={i} style={styles.badge}>
            <Text style={styles.badgeText}>{p}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  role: {
    fontSize: RFValue(12),
    color: COLORS.textLight,
  },
  name: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 6,
  },
  badge: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: RFValue(10),
    color: COLORS.text,
  },
});

export default UserCard;
