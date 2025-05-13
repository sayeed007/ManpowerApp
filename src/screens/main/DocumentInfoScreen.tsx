// src/screens/main/DocumentInfoScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Input from '../../components/common/Input';
import {colors} from '../../constants/colors';
import {dimensions} from '../../constants/dimensions';

const DocumentInfoScreen = () => {
  const navigation = useNavigation();
  const [documentType, setDocumentType] = useState('');
  const [issuingCountry, setIssuingCountry] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [visaCategory, setVisaCategory] = useState('');
  const [workPermit, setWorkPermit] = useState('');
  const [workPermitExpiryDate, setWorkPermitExpiryDate] = useState(new Date());
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);
  const [showWorkPermitExpiryDatePicker, setShowWorkPermitExpiryDatePicker] =
    useState(false);

  const handleDocumentTypeSelect = () => {
    // Implementation for document type dropdown
    console.log('Select document type');
  };

  const handleIssuingCountrySelect = () => {
    // Implementation for issuing country dropdown
    console.log('Select issuing country');
  };

  const handleVisaCategorySelect = () => {
    // Implementation for visa category dropdown
    console.log('Select visa category');
  };

  const handleWorkPermitSelect = () => {
    // Implementation for work permit dropdown
    console.log('Select work permit');
  };

  const handleExpiryDateChange = (event, selectedDate) => {
    setShowExpiryDatePicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  const handleWorkPermitExpiryDateChange = (event, selectedDate) => {
    setShowWorkPermitExpiryDatePicker(false);
    if (selectedDate) {
      setWorkPermitExpiryDate(selectedDate);
    }
  };

  const handleContinue = () => {
    navigation.navigate('BasicInfo');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Document Information 👏</Text>
          <Text style={styles.subtitle}>
            Lorem ipsum dolor sit amet consectetur. At pulvinar ultrices eget
            ullamcorper mi cras.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={handleDocumentTypeSelect}>
          <Text style={styles.inputLabel}>Document Type</Text>
          <View style={styles.dropdownInput}>
            <Text
              style={[
                styles.inputText,
                !documentType && styles.placeholderText,
              ]}>
              {documentType || 'Select Document Type'}
            </Text>
            <Icon name="chevron-down" size={24} color={colors.text.secondary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={handleIssuingCountrySelect}>
          <Text style={styles.inputLabel}>Document Issuing Country</Text>
          <View style={styles.dropdownInput}>
            <Text
              style={[
                styles.inputText,
                !issuingCountry && styles.placeholderText,
              ]}>
              {issuingCountry || 'Select Country'}
            </Text>
            <Icon name="chevron-down" size={24} color={colors.text.secondary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowExpiryDatePicker(true)}>
          <Text style={styles.inputLabel}>Expiry Date</Text>
          <View style={styles.dropdownInput}>
            <Text style={styles.inputText}>
              {expiryDate.toLocaleDateString()}
            </Text>
            <Icon name="calendar" size={24} color={colors.text.secondary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={handleVisaCategorySelect}>
          <Text style={styles.inputLabel}>Visa Category</Text>
          <View style={styles.dropdownInput}>
            <Text
              style={[
                styles.inputText,
                !visaCategory && styles.placeholderText,
              ]}>
              {visaCategory || 'Select Visa Category'}
            </Text>
            <Icon name="chevron-down" size={24} color={colors.text.secondary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={handleWorkPermitSelect}>
          <Text style={styles.inputLabel}>Work Permit</Text>
          <View style={styles.dropdownInput}>
            <Text
              style={[styles.inputText, !workPermit && styles.placeholderText]}>
              {workPermit || 'Select Work Permit'}
            </Text>
            <Icon name="chevron-down" size={24} color={colors.text.secondary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowWorkPermitExpiryDatePicker(true)}>
          <Text style={styles.inputLabel}>Work Permit Expiration Date</Text>
          <View style={styles.dropdownInput}>
            <Text style={styles.inputText}>
              {workPermitExpiryDate.toLocaleDateString()}
            </Text>
            <Icon name="calendar" size={24} color={colors.text.secondary} />
          </View>
        </TouchableOpacity>

        {showExpiryDatePicker && (
          <DateTimePicker
            value={expiryDate}
            mode="date"
            display="default"
            onChange={handleExpiryDateChange}
          />
        )}

        {showWorkPermitExpiryDatePicker && (
          <DateTimePicker
            value={workPermitExpiryDate}
            mode="date"
            display="default"
            onChange={handleWorkPermitExpiryDateChange}
          />
        )}

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: dimensions.padding.lg,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: dimensions.radius.md,
    padding: dimensions.padding.md,
  },
  inputText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  placeholderText: {
    color: colors.text.placeholder,
  },
  continueButton: {
    width: '100%',
    padding: dimensions.padding.md,
    backgroundColor: colors.primary,
    borderRadius: dimensions.radius.md,
    alignItems: 'center',
    marginTop: 32,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DocumentInfoScreen;
