// src/screens/subscription/VerifyDocumentsScreen.tsx

import {useNavigation} from '@react-navigation/native';
import React, {useState, useCallback} from 'react';
import {
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker, {
  types,
  DocumentPickerOptions,
  DocumentPickerResponse,
} from '@react-native-documents/picker';
import {DocumentViewer} from '@react-native-documents/viewer';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

import Stepper from '../../components/common/Stepper';
import FooterButton from '../../components/common/FooterButton';
import {COLORS} from '../../constants/colors';
import {FONT_SIZES, SPACING, SPACING_H} from '../../constants/dimensions';
import {STRINGS} from '../../constants/strings';
import {saveFormData} from '../../utils/storage';

interface Document {
  id: string;
  name: string;
  description: string;
  isUploaded: boolean;
  file?: {
    uri: string;
    type: string;
    name: string;
    size: number;
    downloadUrl?: string;
  };
}

const VerifyDocumentsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'gov_id',
      name: 'Government ID',
      description: "Upload driver's license, NID, or Passport",
      isUploaded: false,
    },
    {
      id: 'trade_license',
      name: 'Trade License',
      description: 'Upload trade license or equivalent document',
      isUploaded: false,
    },
  ]);
  const [selectedDocument, setSelectedDocument] = useState<{
    uri: string;
    type: string;
  } | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>(
    {},
  );

  const steps = {
    [STRINGS.COMPANY_DETAILS_KEY]: STRINGS.COMPANY_DETAILS_VALUE,
    [STRINGS.CONTACT_PERSON_DETAILS_KEY]: STRINGS.CONTACT_PERSON_DETAILS_VALUE,
    [STRINGS.DOCUMENT_VARIFICATION_KEY]: STRINGS.DOCUMENT_VARIFICATION_VALUE,
    [STRINGS.PACKAGE_DETAILS_KEY]: STRINGS.PACKAGE_DETAILS_VALUE,
  };

  // Upload file to Firebase Storage
  const uploadFileToStorage = async (
    documentId: string,
    fileUri: string,
    fileName: string,
    fileType: string,
  ) => {
    try {
      const user = auth().currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create a reference to the location where we'll store the file
      const storagePath = `users/${user.uid}/documents/${documentId}/${fileName}`;
      const reference = storage().ref(storagePath);

      // Upload file
      const task = reference.putFile(fileUri);

      // Update progress
      task.on('state_changed', snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(prev => ({...prev, [documentId]: progress}));
      });

      await task;

      // Get download URL
      const downloadUrl = await reference.getDownloadURL();
      return downloadUrl;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  // const handleUploadDocument = useCallback(async (documentId: string) => {
  //   setIsLoading(true);
  //   setUploadProgress(prev => ({...prev, [documentId]: 0}));

  //   try {
  //     const options: DocumentPickerOptions = {
  //       // type: ['application/pdf', 'image/*'],
  //       type: [types.images, types.pdf],
  //       multiple: false,
  //     };

  //     console.log('try to pick document');
  //     const result: DocumentPickerResponse[] = await DocumentPicker.pick(
  //       options,
  //     );
  //     console.log(result, '.........document');

  //     if (result && result.length > 0) {
  //       const file = result[0];

  //       // Check file size (10MB limit)
  //       if (file.size && file.size > 10 * 1024 * 1024) {
  //         Alert.alert('Error', 'File size exceeds 10MB limit.');
  //         return;
  //       }

  //       // Upload to Firebase Storage
  //       const downloadUrl = await uploadFileToStorage(
  //         documentId,
  //         file.uri,
  //         file.name || 'document',
  //         file.type || 'application/octet-stream',
  //       );

  //       // Update state with file info
  //       setDocuments(docs =>
  //         docs.map(doc =>
  //           doc.id === documentId
  //             ? {
  //                 ...doc,
  //                 isUploaded: true,
  //                 file: {
  //                   uri: file.uri,
  //                   type: file.type || 'application/octet-stream',
  //                   name: file.name || 'document',
  //                   size: file.size || 0,
  //                   downloadUrl,
  //                 },
  //               }
  //             : doc,
  //         ),
  //       );

  //       Alert.alert('Success', 'Document uploaded successfully');
  //     }
  //   } catch (err: any) {
  //     if (DocumentPicker.isCancel(err)) {
  //       console.log('User cancelled document picker');
  //     } else {
  //       console.error('Error picking document:', err);
  //       Alert.alert('Error', `Failed to upload document: ${err.message}`);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //     setUploadProgress(prev => ({...prev, [documentId]: 0}));
  //   }
  // }, []);

  const requestStoragePermission = async () => {
    console.log('Platform.OS:', Platform.OS); // Add this line
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Access Required',
            message: 'App needs access to your storage to upload documents.',
            buttonPositive: 'Grant',
          },
        );
        debugger;
        if (
          granted === PermissionsAndroid.RESULTS.GRANTED ||
          granted === 'never_ask_again'
        ) {
          console.log('Storage permission granted');
          return true;
        } else {
          console.log('Storage permission denied');
          Alert.alert(
            'Permission Denied',
            'You need to grant storage permission to upload documents.',
          );
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // On iOS, no specific storage permission needed for picking
  };

  const handleUploadDocument = useCallback(async (documentId: string) => {
    setIsLoading(true);
    setUploadProgress(prev => ({...prev, [documentId]: 0}));

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      setIsLoading(false);
      return;
    }

    try {
      const options: DocumentPickerOptions = {
        type: [types.images, types.pdf],
        multiple: false,
      };

      console.log('Attempting to pick document for:', documentId);
      const result: DocumentPickerResponse[] = await DocumentPicker.pick(
        options,
      );
      debugger;
      console.log('DocumentPicker.pick result:', result);

      if (result && result.length > 0) {
        const file = result[0];
        console.log('Selected file:', file);

        if (file.size && file.size > 10 * 1024 * 1024) {
          Alert.alert('Error', 'File size exceeds 10MB limit.');
          return;
        }

        console.log('Attempting to upload file to Firebase for:', documentId);
        const downloadUrl = await uploadFileToStorage(
          documentId,
          file.uri,
          file.name || 'document',
          file.type || 'application/octet-stream',
        );
        console.log('File uploaded successfully. Download URL:', downloadUrl);

        setDocuments(docs =>
          docs.map(doc =>
            doc.id === documentId
              ? {
                  ...doc,
                  isUploaded: true,
                  file: {
                    uri: file.uri,
                    type: file.type || 'application/octet-stream',
                    name: file.name || 'document',
                    size: file.size || 0,
                    downloadUrl,
                  },
                }
              : doc,
          ),
        );

        Alert.alert('Success', 'Document uploaded successfully');
      } else {
        console.log('No document was selected.');
      }
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        console.error('Error picking document:', err);
        Alert.alert('Error', `Failed to upload document: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
      setUploadProgress(prev => ({...prev, [documentId]: 0}));
    }
  }, []);

  const handleViewDocument = (documentId: string) => {
    const doc = documents.find(d => d.id === documentId);
    if (doc?.file?.uri) {
      setSelectedDocument({
        uri: doc.file.uri,
        type: doc.file.type,
      });
      setShowViewer(true);
    }
  };

  const handleContinue = async () => {
    try {
      // Save only necessary data
      const documentsData = documents.map(doc => ({
        id: doc.id,
        isUploaded: doc.isUploaded,
        downloadUrl: doc.file?.downloadUrl,
      }));

      await saveFormData('verifyDocuments', {documents: documentsData});
      navigation.navigate('PackageDetails' as never);
    } catch (error) {
      console.error('Error saving form data:', error);
      Alert.alert('Error', 'Failed to save document information');
    }
  };

  const handleSkip = handleContinue;

  const handleStepNavigation = async (step: string) => {
    if (step === 'VerifyDocuments') return;
    if (!documents.every(d => d.isUploaded)) return;

    try {
      const documentsData = documents.map(doc => ({
        id: doc.id,
        isUploaded: doc.isUploaded,
        downloadUrl: doc.file?.downloadUrl,
      }));

      await saveFormData('verifyDocuments', {documents: documentsData});
      navigation.navigate(step as never);
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const allDocumentsUploaded = documents.every(d => d.isUploaded);

  return (
    <SafeAreaView style={styles.container}>
      {showViewer && selectedDocument ? (
        <>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowViewer(false)}>
            <Icon name="arrow-left" size={24} color={COLORS.text} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <DocumentViewer
            document={{
              uri: selectedDocument.uri,
              fileType: selectedDocument.type,
            }}
            style={styles.documentViewer}
          />
        </>
      ) : (
        <>
          <Stepper
            steps={steps}
            currentStep="VerifyDocuments"
            onStepPress={handleStepNavigation}
            isValid={allDocumentsUploaded}
          />
          <ScrollView
            contentContainerStyle={[
              styles.scrollContainer,
              {paddingBottom: 100},
            ]}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {STRINGS.VERIFY_DOCUMENTS}{' '}
                <Text style={styles.handEmoji}>👋</Text>
              </Text>
              <Text style={styles.subtitle}>
                {STRINGS.DOCUMENT_VARIFICATION_DESCRIPTION}
              </Text>
            </View>

            {documents.map(doc => (
              <View
                key={doc.id}
                style={[
                  styles.documentCard,
                  doc.isUploaded && styles.uploadedDocumentCard,
                ]}>
                {doc.isUploaded ? (
                  <>
                    <View style={styles.uploadSuccessHeader}>
                      <View style={styles.checkCircle}>
                        <Icon name="check" size={20} color={COLORS.white} />
                      </View>
                      <Text style={styles.uploadedDocumentName}>
                        {doc.name}
                      </Text>
                    </View>
                    <Text style={styles.uploadSuccessText}>
                      Document uploaded successfully
                    </Text>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => handleViewDocument(doc.id)}>
                      <Icon name="eye" size={18} color={COLORS.white} />
                      <Text style={styles.viewText}>View Document</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.documentHeader}>
                      <Icon
                        name={
                          doc.id === 'gov_id'
                            ? 'card-account-details'
                            : 'file-document'
                        }
                        size={24}
                        color={COLORS.primary}
                        style={styles.documentIcon}
                      />
                      <Text style={styles.documentName}>{doc.name}</Text>
                    </View>
                    <Text style={styles.documentDescription}>
                      {doc.description}
                    </Text>
                    {uploadProgress[doc.id] > 0 &&
                      uploadProgress[doc.id] < 100 && (
                        <View style={styles.progressContainer}>
                          <View
                            style={[
                              styles.progressBar,
                              {width: `${uploadProgress[doc.id]}%`},
                            ]}
                          />
                          <Text style={styles.progressText}>
                            {Math.round(uploadProgress[doc.id])}%
                          </Text>
                        </View>
                      )}
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={() => handleUploadDocument(doc.id)}
                      disabled={isLoading}>
                      {isLoading && uploadProgress[doc.id] > 0 ? (
                        <ActivityIndicator
                          size="small"
                          color={COLORS.primary}
                        />
                      ) : (
                        <>
                          <Icon
                            name="upload"
                            size={18}
                            color={COLORS.primary}
                          />
                          <Text style={styles.uploadText}>Upload Document</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ))}
          </ScrollView>
          <FooterButton
            onContinue={handleContinue}
            onSkip={handleSkip}
            isContinueDisabled={!allDocumentsUploaded}
            isSkipVisible
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: SPACING.sm,
  },
  header: {
    marginBottom: hp('3%'),
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginBottom: SPACING_H.one,
    color: COLORS.text,
  },
  handEmoji: {
    fontSize: FONT_SIZES.xxl,
  },
  subtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    lineHeight: FONT_SIZES.xl,
  },
  documentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  uploadedDocumentCard: {
    backgroundColor: COLORS.primary,
  },
  documentHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  documentIcon: {
    backgroundColor: COLORS.background,
    padding: SPACING.xs,
    borderRadius: 8,
  },
  documentName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginLeft: SPACING.xs,
    color: COLORS.text,
  },
  uploadedDocumentName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginLeft: SPACING.xs,
    color: COLORS.white,
  },
  documentDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.placeholder,
    marginBottom: SPACING.md,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
  },
  uploadText: {
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
  uploadSuccessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  checkCircle: {
    backgroundColor: COLORS.success,
    borderRadius: 15,
    padding: 5,
  },
  uploadSuccessText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  viewText: {
    color: COLORS.white,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
  documentViewer: {
    flex: 1,
    width: '100%',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  backButtonText: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
  },
  progressContainer: {
    height: 20,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    position: 'absolute',
    right: 5,
    color: COLORS.white,
    alignSelf: 'center',
    fontWeight: '600',
    fontSize: FONT_SIZES.xs,
    top: 2,
  },
});

export default VerifyDocumentsScreen;
