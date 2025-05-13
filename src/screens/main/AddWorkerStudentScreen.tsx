import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import constants from your project
import {colors} from '../../constants/colors';
import {dimensions} from '../../constants/dimensions';
import Button from '../../components/common/Button';

type UserType = 'student' | 'worker' | null;

const AddWorkerStudentScreen: React.FC = () => {
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const navigation = useNavigation();

  const handleContinue = () => {
    if (selectedType) {
      // Navigate to the appropriate form based on selection
      if (selectedType === 'student') {
        // Replace with your actual navigation route
        navigation.navigate('StudentRegistration');
      } else {
        // Replace with your actual navigation route
        navigation.navigate('WorkerRegistration');
      }
    }
  };

  const renderSelectionCard = (
    type: UserType,
    title: string,
    iconName: string,
  ) => {
    const isSelected = selectedType === type;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          isSelected && {
            backgroundColor: type === 'student' ? colors.black : colors.white,
            borderColor: isSelected ? colors.primary : colors.borderColor,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        onPress={() => setSelectedType(type)}
        activeOpacity={0.8}>
        <View style={styles.cardContent}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: type === 'student' ? '#E6F2FF' : '#E6F9ED'},
            ]}>
            <Icon
              name={iconName}
              size={24}
              color={type === 'student' ? '#3498DB' : '#2ECC71'}
            />
          </View>

          <Text
            style={[
              styles.cardTitle,
              isSelected && type === 'student' && {color: colors.white},
            ]}>
            {title}
          </Text>
        </View>

        <Text
          style={[
            styles.cardDescription,
            isSelected && type === 'student' && {color: colors.white},
          ]}>
          Lorem ipsum dolor sit amet consectetur.Lorem
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Worker/Student 👋</Text>
          <Text style={styles.subtitle}>
            Lorem ipsum dolor sit amet consectetur. At pulvinar ultrices eget
            ullamcorper mi cras.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {renderSelectionCard('student', 'Student', 'school')}
          {renderSelectionCard('worker', 'Worker', 'hard-hat')}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedType}
          style={
            selectedType
              ? {backgroundColor: colors.primary}
              : {backgroundColor: colors.lightGray}
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: dimensions.padding.lg,
  },
  header: {
    marginTop: dimensions.margin.xl,
    marginBottom: dimensions.margin.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: dimensions.margin.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  cardsContainer: {
    marginTop: dimensions.margin.lg,
  },
  card: {
    borderRadius: 16,
    padding: dimensions.padding.lg,
    marginBottom: dimensions.margin.md,
    backgroundColor: colors.white,
    borderColor: colors.borderColor,
    borderWidth: 1,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: dimensions.margin.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: dimensions.margin.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: dimensions.padding.lg,
  },
});

export default AddWorkerStudentScreen;
