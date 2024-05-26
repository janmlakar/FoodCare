import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const StatusBarBackground = () => {
  return (
    <LinearGradient
      colors={['#8A2BE2', '#4B0082']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.statusBar}
    />
  );
};

const styles = StyleSheet.create({
  statusBar: {
    height: getStatusBarHeight(),
    width: '100%',
  },
});

export default StatusBarBackground;
