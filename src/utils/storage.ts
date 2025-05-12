// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const FORM_STORAGE_KEY = 'multiStepFormData';

export const saveFormData = async (step: string, data: any) => {
  try {
    const existingData = await AsyncStorage.getItem(FORM_STORAGE_KEY);
    const parsedData = existingData ? JSON.parse(existingData) : {};
    const updatedData = {
      ...parsedData,
      [step]: data,
    };
    await AsyncStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving form data:', error);
  }
};

export const loadFormData = async (step: string) => {
  try {
    const data = await AsyncStorage.getItem(FORM_STORAGE_KEY);
    if (data) {
      const parsedData = JSON.parse(data);
      return parsedData[step] || null;
    }
    return null;
  } catch (error) {
    console.error('Error loading form data:', error);
    return null;
  }
};

export const getAllFormData = async () => {
  try {
    const data = await AsyncStorage.getItem(FORM_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading all form data:', error);
    return {};
  }
};

export const clearFormData = async () => {
  try {
    await AsyncStorage.removeItem(FORM_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing form data:', error);
  }
};
