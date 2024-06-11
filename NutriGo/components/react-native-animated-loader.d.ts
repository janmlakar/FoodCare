declare module 'react-native-animated-loader' {
    import { Component } from 'react';
    import { ViewStyle } from 'react-native';
    import { AnimatedLottieViewProps } from 'lottie-react-native';
  
    export interface AnimatedLoaderProps extends AnimatedLottieViewProps {
      visible: boolean;
      overlayColor?: string;
      source: object | string;
      animationStyle?: ViewStyle;
      speed?: number;
    }
  
    export default class AnimatedLoader extends Component<AnimatedLoaderProps> {}
  }
  