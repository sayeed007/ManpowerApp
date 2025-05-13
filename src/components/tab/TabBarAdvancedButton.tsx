import {BottomTabBarButtonProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../../constants/colors';

type Props = BottomTabBarButtonProps;

export const TabBarAdvancedButton: React.FC<Props> = ({...props}) => (
  <View style={styles.rootContainer}>
    <View style={[styles.container, {pointerEvents: 'box-none'}]}>
      <TouchableOpacity onPress={props.onPress}>
        <View style={styles.button}>
          <Icon name={'plus'} size={32} color={COLORS.white} />
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  rootContainer: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    position: 'absolute',
    top: -25,
    width: 85,
    borderRadius: '100%',
    alignItems: 'center',
    backgroundColor: COLORS?.background,
    // borderBottomWidth: 1,
    // borderTopColor: COLORS.border,
  },
  background: {
    position: 'absolute',
    top: 0,
  },
  button: {
    top: -5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: '100%',
    backgroundColor: COLORS.blue,
  },
  buttonIcon: {
    fontSize: 16,
    color: COLORS?.white,
  },
});
