// Screen container component with consistent padding and safe area handling

import React from 'react';
import { ScrollView, View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { useResponsive } from '../utils/responsive';
import SafeAreaWrapper from './SafeAreaWrapper';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  backgroundColor?: string;
  padding?: boolean;
  safeArea?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content';
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
  testID?: string;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  backgroundColor,
  padding = true,
  safeArea = true,
  statusBarStyle,
  contentContainerStyle,
  style,
  testID,
}) => {
  const { theme, isDarkMode } = useThemeContext();
  const { getSafePadding } = useResponsive();
  
  const defaultBackgroundColor = backgroundColor || 
    (isDarkMode ? theme.colors.neutral[900] : theme.colors.neutral[50]);
  
  const paddingStyle = padding ? { paddingHorizontal: getSafePadding } : {};
  
  const containerStyle = [
    styles.container,
    { backgroundColor: defaultBackgroundColor },
    style,
  ];
  
  const contentStyle = [
    paddingStyle,
    contentContainerStyle,
  ];

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          style={containerStyle}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          testID={testID ? `${testID}-scroll` : undefined}
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View style={[containerStyle, contentStyle]} testID={testID}>
        {children}
      </View>
    );
  };

  if (safeArea) {
    return (
      <SafeAreaWrapper
        backgroundColor={defaultBackgroundColor}
        statusBarStyle={statusBarStyle}
      >
        {renderContent()}
      </SafeAreaWrapper>
    );
  }

  return renderContent();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default ScreenContainer;