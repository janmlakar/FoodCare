import React from 'react';
import GradientHeader from 'react-native-gradient-header';
import { LinearGradient } from 'expo-linear-gradient';

const CustomHeader = ({ title = "Today", subtitle = "Have a nice day Kuray", gradientColors = ['#9b6ed6', '#f287bc'], imageSource }) => (
  <GradientHeader
    title={title}
    subtitle={subtitle}
    gradientColors={gradientColors}
    imageSource={imageSource || require('../assets/images/NutriGo.png')}
    gradientComponent={LinearGradient}
  />
);

export default GradientHeader;
