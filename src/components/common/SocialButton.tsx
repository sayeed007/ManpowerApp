// src/components/common/SocialButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {COLORS} from '../../constants/colors';
import {FONT_SIZES, SPACING} from '../../constants/dimensions';

interface SocialButtonProps extends TouchableOpacityProps {
  title: string;
  icon: ImageSourcePropType;
  containerStyle?: ViewStyle;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  title,
  icon,
  containerStyle,
  ...rest
}) => {
  return (
    <TouchableOpacity style={[styles.button, containerStyle]} {...rest}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 64,
    marginVertical: SPACING.xs,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: SPACING.sm,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
});

export default SocialButton;
