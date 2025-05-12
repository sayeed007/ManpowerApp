// src/components/common/Stepper.tsx
import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Toast from 'react-native-toast-message';
import {COLORS} from '../../constants/colors';
import {FONT_SIZES, SPACING} from '../../constants/dimensions';

interface Steps {
  [key: string]: string;
}

interface StepperProps {
  steps: Steps;
  currentStep: string;
  onStepPress: (step: string) => void;
  isValid?: boolean;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepPress,
  isValid = false,
}) => {
  const stepsKey = Object.keys(steps);
  const {width} = Dimensions.get('window');
  const carouselRef = useRef<Carousel<string>>(null);
  const currentIndex = stepsKey.indexOf(currentStep);

  // evenly divide the screen (minus side-padding) among steps
  const SIDE_PADDING = SPACING.lg;
  const availableWidth = width - SIDE_PADDING * 2;
  const itemWidth = availableWidth / stepsKey.length;

  useEffect(() => {
    if (carouselRef.current && currentIndex >= 0) {
      carouselRef.current.snapToItem(currentIndex, true);
    }
  }, [currentIndex]);

  const toastBlock = () => {
    Toast.show({
      type: 'info',
      text1: 'Hold up!',
      text2: 'Complete the current step before moving on.',
      position: 'top',
      visibilityTime: 1500,
    });
  };

  const renderItem = ({item, index}) => {
    const isActive = index === currentIndex;
    const canGo = index <= currentIndex || (index > currentIndex && isValid);

    return (
      <TouchableOpacity
        style={styles.slide}
        onPress={() => (canGo ? onStepPress(item) : toastBlock())}>
        <View
          style={[
            styles.pill,
            isActive ? styles.pillActive : styles.pillInactive,
          ]}>
          <Text
            style={[
              styles.label,
              isActive ? styles.labelActive : styles.labelInactive,
            ]}>
            {index + 1}. {steps[item]}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <Carousel
        ref={carouselRef}
        data={stepsKey}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width * 0.6}
        firstItem={currentIndex}
        activeSlideAlignment="start"
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        enableMomentum={true}
        enableSnap={false}
        onSnapToItem={idx => {
          const canGo = idx <= currentIndex || (idx > currentIndex && isValid);
          if (canGo) onStepPress(stepsKey[idx]);
          else {
            toastBlock();
            carouselRef.current?.snapToItem(currentIndex, true);
          }
        }}
      />

      {/* {steps.length > 1 && (
        <Pagination
          dotsLength={steps.length}
          activeDotIndex={currentIndex}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.dot}
          inactiveDotStyle={styles.dotInactive}
          dotContainerStyle={styles.dotContainer}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.8}
        />
      )} */}

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // marginBottom: SPACING.md,
  },
  carouselContainer: {
    paddingHorizontal: SPACING.lg,
  },
  carouselContent: {
    alignItems: 'center',
  },
  slideStyle: {
    justifyContent: 'center',
  },
  slide: {
    width: '100%',
    alignItems: 'center',
  },
  pill: {
    minHeight: 40,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    justifyContent: 'center',
  },
  pillActive: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  pillInactive: {
    borderWidth: 1,
    borderColor: COLORS.textLight,
    backgroundColor: COLORS.background,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  labelInactive: {
    color: COLORS.textLight,
  },
  paginationContainer: {
    paddingVertical: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotContainer: {
    marginHorizontal: SPACING.xs / 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  dotInactive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textLight,
  },
});

export default Stepper;
