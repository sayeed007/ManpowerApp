// src/components/common/FooterButton.tsx
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {BORDER_RADIUS, SPACING} from '../../constants/dimensions';
import Button from './Button';
import {COLORS} from '../../constants/colors';

interface FooterButtonProps {
  onContinue: () => void;
  onSkip?: () => void;
  isContinueDisabled?: boolean;
  isSkipVisible?: boolean;
}

const FooterButton: React.FC<FooterButtonProps> = ({
  onContinue,
  onSkip,
  isContinueDisabled = false,
  isSkipVisible = false,
}) => {
  const {height} = Dimensions.get('window');
  const footerHeight = 80; // Fixed height for the footer

  return (
    <View
      style={[
        styles.actionContainer,
        isContinueDisabled && styles.disabledButton,
      ]}>
      <Button
        variant={isContinueDisabled ? 'outline' : 'primary'}
        title="Continue"
        onPress={onContinue}
        disabled={isContinueDisabled}
      />
      {/* <Button
            title="Skip"
            onPress={handleSkip}
            style={{backgroundColor: COLORS.textLight, marginTop: SPACING.xs}}
          /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    marginHorizontal: SPACING.sm,
    marginVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
    color: COLORS.white,
  },
  skipButton: {
    flex: 1,
  },
});

export default FooterButton;
