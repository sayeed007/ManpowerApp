// src/screens/main/DocumentUploadScreen.tsx
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/colors';
import {dimensions} from '../../constants/dimensions';

const DocumentUploadScreen = () => {
  const navigation = useNavigation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileBrowse = () => {
    // Implement document picker functionality
    // This is a placeholder - you would use react-native-document-picker
    console.log('Browse files');
  };

  const handleContinue = () => {
    if (selectedFile) {
      navigation.navigate('DocumentInfo');
    }
  };

  const handleCancelUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Attach Document 👏</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet consectetur. At pulvinar ultrices eget
          ullamcorper mi cras.
        </Text>
      </View>

      <View style={styles.uploadContainer}>
        <View style={styles.uploadArea}>
          <Icon name="folder-upload-outline" size={48} color={colors.primary} />
          <Text style={styles.uploadText}>
            Drag your file(s) to start uploading
          </Text>
          <Text style={styles.orText}>OR</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={handleFileBrowse}>
            <Text style={styles.browseButtonText}>Browse files</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.supportText}>
        Only support .jpg, .png and .pdf files
      </Text>

      {selectedFile && (
        <View style={styles.fileItem}>
          <View style={styles.fileInfo}>
            <Icon name="file-pdf-box" size={24} color="red" />
            <View style={styles.fileDetails}>
              <Text style={styles.fileName}>passport.pdf</Text>
              <Text style={styles.fileSize}>5.3MB</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleRemoveFile}>
            <Icon name="close-circle" size={24} color={colors.gray} />
          </TouchableOpacity>
        </View>
      )}

      {isUploading && (
        <View style={styles.fileItem}>
          <View style={styles.fileDetails}>
            <Text style={styles.fileName}>Uploading...</Text>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                {uploadProgress}% • 30 seconds remaining
              </Text>
              <View style={styles.progressBarBackground}>
                <View
                  style={[styles.progressBar, {width: `${uploadProgress}%`}]}
                />
              </View>
            </View>
          </View>
          <View style={styles.uploadControls}>
            <TouchableOpacity style={styles.pauseButton}>
              <Icon name="pause-circle" size={24} color={colors.gray} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelUpload}>
              <Icon name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.continueButton,
          !selectedFile && !isUploading && styles.disabledButton,
        ]}
        onPress={handleContinue}
        disabled={!selectedFile && !isUploading}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  uploadContainer: {
    marginVertical: 16,
  },
  uploadArea: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: dimensions.radius.md,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: colors.text.primary,
    marginTop: 16,
  },
  orText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginVertical: 16,
  },
  browseButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: dimensions.radius.sm,
  },
  browseButtonText: {
    color: colors.primary,
    fontSize: 16,
  },
  supportText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginVertical: 16,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: dimensions.radius.sm,
    marginBottom: 16,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileDetails: {
    marginLeft: 12,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  fileSize: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  progressContainer: {
    marginTop: 4,
    width: '100%',
  },
  progressText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 2,
  },
  uploadControls: {
    flexDirection: 'row',
  },
  pauseButton: {
    marginRight: 8,
  },
  cancelButton: {},
  continueButton: {
    width: '100%',
    padding: dimensions.padding.md,
    backgroundColor: colors.primary,
    borderRadius: dimensions.radius.md,
    alignItems: 'center',
    marginTop: 'auto',
  },
  disabledButton: {
    backgroundColor: colors.gray,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DocumentUploadScreen;
