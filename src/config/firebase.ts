import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const firebaseConfig = {
  apiKey: 'AIzaSyDDodab8_w1wwIMwzmYDJJQnAHw51mbkgM',
  authDomain: 'manpowerapp-856d0.firebaseapp.com',
  projectId: 'manpowerapp-856d0',
  storageBucket: 'manpowerapp-856d0.firebasestorage.app',
  messagingSenderId: '910557937730',
  appId: '1:910557937730:android:aeec029a655dac080ceddb',
  databaseURL: 'https://manpowerapp-856d0-default-rtdb.firebaseio.com',
};

export const initializeFirebase = async () => {
  if (!firebase.apps.length) {
    await firebase.initializeApp(firebaseConfig);
  }
  return firebase;
};

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId:
      '910557937730-f05ld824oi60fgkns87hujbpac0lk1rc.apps.googleusercontent.com',
  });
};

export {firebase, auth, firestore, storage, GoogleSignin};

export default {
  initializeFirebase,
  configureGoogleSignIn,
  auth,
  firestore,
  storage,
};
