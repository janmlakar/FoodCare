declare module 'react-native-gauge' {
    import { Component } from 'react';
    import { ViewStyle } from 'react-native';
  
    interface GaugeProps {
      size?: number;
      progress?: number;
      animated?: boolean;
      alwaysUseEndAngle?: boolean;
      endAngle?: number;
      unfilledEndAngle?: number;
      thickness?: number;
      borderWidth?: number;
      needleWidth?: number;
      needleHeight?: number;
      needleBorderRadius?: number;
      colors?: string[];
      backgroundColor?: string;
      needleColor?: string;
      style?: ViewStyle;
    }
  
    export default class Gauge extends Component<GaugeProps> {}
  }
  