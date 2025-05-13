import React from 'react';
import {View, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

const VerticalLine = ({
  height = '2',
  width = '100%',
  color = '#ccc',
  marginHorizontal = 10,
}) => {
  return (
    <View style={styles.lineContainer}>
      <View
        style={{
          height: height,
          backgroundColor: COLORS.border,
          marginVertical: 10,
          width: width,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  lineContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginVertical: 10,
  },
});

export default VerticalLine;
