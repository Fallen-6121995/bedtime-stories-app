import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { useResponsive } from '../utils/responsive';
import SafeAreaWrapper from './SafeAreaWrapper';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  padding?: boolean;
  safeArea?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content';
  testID?: string;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  backgroundColor,
  padding = true,
  safeArea = true,
  statusBarStyle,
  testID,
}) => {
  const { theme, isDarkMode } = useThemeContext();
  const { getSafePadding } = useResponsive();
  
  const defaultBackgroundColor = backgroundColor || 
    (isDarkMode ? theme.colors.neutral[900] : theme.colors.neutral[50]);
  
  const contentStyle = [
    styles.content,
    { backgroundColor: defaultBackgroundColor },
    padding && { paddingHorizontal: getSafePadding },
    style,
  ];

  if (safeArea) {
    return (
      <SafeAreaWrapper
        backgroundColor={defaultBackgroundColor}
        statusBarStyle={statusBarStyle}
        testID={testID}
      >
        <View style={contentStyle}>
          {children}
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <View style={[styles.container, contentStyle]} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default ScreenWrapper;
