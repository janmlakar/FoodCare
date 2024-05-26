import React, { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useHeaderHeight } from '@react-navigation/elements';
import { StyleSheet, View } from 'react-native';

interface ScreenTemplateProps {
  children: ReactNode;
  headerPadding?: boolean;
}

const ScreenTemplate: React.FC<ScreenTemplateProps> = ({ children, headerPadding = true }) => {
  let headerHeight;
  try {
    headerHeight = useHeaderHeight();
  } catch (e) {
    headerHeight = 0; 
  }

  return (
    <LinearGradient 
      colors={[
        'rgba(10,0,30,1)', 
        'rgba(20,0,40,1)', 
        'rgba(35,0,55,1)', 
        'rgba(50,0,70,1)', 
        'rgba(70,10,90,1)', 
        'rgba(90,20,110,1)', 
        'rgba(50,10,70,1)',  
        'rgba(30,5,50,1)'    
      ]}
      locations={[0, 0.15, 0.35, 0.55, 0.75, 0.9, 0.95, 1]}
      style={[styles.gradientBackground, { paddingTop: headerPadding ? headerHeight : 0 }]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
});

export default ScreenTemplate;
