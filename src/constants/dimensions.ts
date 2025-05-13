// src/constants/dimensions.ts
import {Dimensions, Platform, StatusBar} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';

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

export const SPACING_H = {
  one: hp('1%'),
};

export const FONT_SIZES = {
  xs: RFValue(12),
  sm: RFValue(14),
  md: RFValue(16),
  lg: RFValue(18),
  xl: RFValue(20),
  xxl: RFValue(24),
  xxxl: RFValue(30),
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

// This file should be added to your project's constants directory

// export const dimensions = {
//   // Spacing
//   padding: {
//     xs: 4,
//     sm: 8,
//     md: 16,
//     lg: 24,
//     xl: 32,
//     xxl: 48,
//   },
//   margin: {
//     xs: 4,
//     sm: 8,
//     md: 16,
//     lg: 24,
//     xl: 32,
//     xxl: 48,
//   },

//   // Border radius
//   borderRadius: {
//     sm: 4,
//     md: 8,
//     lg: 16,
//     xl: 24,
//     round: 9999,
//   },

//   // Font sizes
//   fontSize: {
//     xs: 12,
//     sm: 14,
//     md: 16,
//     lg: 18,
//     xl: 20,
//     xxl: 24,
//     xxxl: 28,
//   },

//   // Line heights
//   lineHeight: {
//     sm: 16,
//     md: 20,
//     lg: 24,
//     xl: 28,
//     xxl: 32,
//   },

//   // Icon sizes
//   iconSize: {
//     sm: 16,
//     md: 24,
//     lg: 32,
//     xl: 40,
//   },

//   // Component specific dimensions
//   button: {
//     height: 56,
//     borderRadius: 8,
//   },
//   input: {
//     height: 56,
//     borderRadius: 8,
//   },
// };
