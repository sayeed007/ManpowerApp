// src/components/common/Input.tsx
import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {COLORS} from '../../constants/colors';
import {FONT_SIZE, SPACING} from '../../constants/dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: string;
  rightIcon?: string;
  isPassword?: boolean;
  onRightIconPress?: () => void;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  isPassword = false,
  onRightIconPress,
  ...rest
}) => {
  const [secureTextEntry, setSecureTextEntry] = React.useState(isPassword);

  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    return (
      <View style={styles.leftIconContainer}>
        <Icon name={leftIcon} size={20} color={COLORS.textLight} />
      </View>
    );
  };

  const renderRightIcon = () => {
    if (isPassword) {
      return (
        <TouchableOpacity
          style={styles.rightIconContainer}
          onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <Icon
            name={secureTextEntry ? 'eye-off' : 'eye'}
            size={20}
            color={COLORS.textLight}
          />
        </TouchableOpacity>
      );
    }

    if (!rightIcon) return null;

    return (
      <TouchableOpacity
        style={styles.rightIconContainer}
        onPress={onRightIconPress}>
        <Icon name={rightIcon} size={20} color={COLORS.textLight} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          error ? styles.inputError : null,
          leftIcon ? styles.inputWithLeftIcon : null,
        ]}>
        {renderLeftIcon()}
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={secureTextEntry}
          {...rest}
        />
        {renderRightIcon()}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    marginBottom: SPACING.xs,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.inputBackground,
    height: 48,
    alignItems: 'center',
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    paddingHorizontal: SPACING.sm,
    fontSize: FONT_SIZE.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
  leftIconContainer: {
    paddingHorizontal: SPACING.sm,
  },
  rightIconContainer: {
    paddingHorizontal: SPACING.sm,
  },
});

export default Input;
