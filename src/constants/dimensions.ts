// src/constants/dimensions.ts
import {Dimensions, Platform, StatusBar} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

const {width, height} = Dimensions.get('window');

export const DIMENSIONS = {
  screenWidth: width,
  screenHeight: height,
  window: {
    width,
    height,
  },
};

export const SPACING = {
  // xs: 4,
  // sm: 8,
  // md: 16,
  // lg: 24,
  // xl: 32,

  xs: wp('2%'),
  sm: wp('4%'),
  md: wp('6%'),
  lg: wp('8%'),
  xl: wp('10%'),
  xxl: 40,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';
export const STATUS_BAR_HEIGHT = IS_IOS ? 20 : StatusBar.currentHeight || 0;
export const HEADER_HEIGHT = 56 + STATUS_BAR_HEIGHT;

export const FONT_SIZE = {
  xs: wp('3%'),
  sm: wp('3.5%'),
  md: wp('4%'),
  lg: wp('5%'),
  xl: wp('6%'),
};
