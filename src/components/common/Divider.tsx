// src/components/common/Divider.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONT_SIZE, SPACING } from '../../constants/dimensions';

interface DividerProps {
  text?: string;
  containerStyle?: ViewStyle;
}

const Divider: React.FC<DividerProps> = ({ text, containerStyle }) => {
  if (!text) {
    return <View style={[styles.divider, containerStyle]} />;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  text: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.sm,
    marginHorizontal: SPACING.sm,
  },
});

export default Divider;