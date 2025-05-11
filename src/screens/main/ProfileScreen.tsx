import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {COLORS} from '../../constants/colors';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';

const DEFAULT_AVATAR = 'https://via.placeholder.com/100';

const ProfileScreen = () => {
  const {signOut, loading} = useAuth();
  const user = auth().currentUser;

  const [isEditing, setIsEditing] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  const handleEditPress = () => {
    // Toggle editing mode - to be implemented
    setIsEditing(!isEditing);
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Would you like to change your password?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Continue',
        onPress: () => {
          // Send password reset email
          auth()
            .sendPasswordResetEmail(user?.email || '')
            .then(() => {
              Alert.alert(
                'Email Sent',
                'Check your email for instructions to reset your password.',
              );
            })
            .catch(error => {
              Alert.alert('Error', error.message);
            });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <Text style={styles.editButtonText}>
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{uri: user?.photoURL || DEFAULT_AVATAR}}
              style={styles.avatar}
            />
            {isEditing && (
              <TouchableOpacity style={styles.cameraIcon}>
                <Icon name="camera-alt" size={20} color={COLORS.white} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoItem}>
            <Icon
              name="person"
              size={20}
              color={COLORS.primary}
              style={styles.infoIcon}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>
                {user?.displayName || 'Not set'}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Icon
              name="email"
              size={20}
              color={COLORS.primary}
              style={styles.infoIcon}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Icon
              name="phone"
              size={20}
              color={COLORS.primary}
              style={styles.infoIcon}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>
                {user?.phoneNumber || 'Not set'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>

          <TouchableOpacity
            style={styles.securityItem}
            onPress={handleChangePassword}>
            <Icon
              name="lock"
              size={20}
              color={COLORS.primary}
              style={styles.securityIcon}
            />
            <Text style={styles.securityText}>Change Password</Text>
            <Icon name="chevron-right" size={24} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>

        <Button
          title="Sign Out"
          onPress={handleSignOut}
          loading={loading}
          style={styles.signOutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
  },
  editButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.border,
  },
  cameraIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  securityIcon: {
    marginRight: 15,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  signOutButton: {
    marginVertical: 20,
  },
});

export default ProfileScreen;
