import React from 'react';
import { ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export const GRADIENT_COLORS = {
  primary: ['#2ADB7F', '#9FFF64'],
  secondary: ['#FF6B6B', '#FFE66D'],
  purple: ['#A020F0', '#8B5CF6'],
};

export const PrimaryGradient: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ children, style }) => (
  <LinearGradient
    colors={GRADIENT_COLORS.primary}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={style}
  >
    {children}
  </LinearGradient>
);

export const PrimaryGradientBackground: React.FC<{ style?: ViewStyle; children?: React.ReactNode }> = ({ style, children }) => (
  <LinearGradient
    colors={GRADIENT_COLORS.primary}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={[{ flex: 1 }, style]}
  >
    {children}
  </LinearGradient>
); 