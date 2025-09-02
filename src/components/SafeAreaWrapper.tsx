// Safe area wrapper component for consistent screen layouts

import React from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import { useThemeContext } from '../context/ThemeContext';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: ViewStyle;
  testID?: string;
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  backgroundColor,
  statusBarStyle,
  edges = ['top', 'bottom'],
  style,
  testID,
}) => {
  const { theme, isDarkMode } = useThemeContext();
  
  const defaultBackgroundColor = backgroundColor || 
    (isDarkMode ? theme.colors.neutral[900] : theme.colors.neutral[50]);
  
  const defaultStatusBarStyle = statusBarStyle || 
    (isDarkMode ? 'light-content' : 'dark-content');

  // For iOS, we use SafeAreaView
  if (Platform.OS === 'ios') {
    return (
      <>
        <StatusBar
          barStyle={defaultStatusBarStyle}
          backgroundColor={defaultBackgroundColor}
        />
        <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: defaultBackgroundColor },
            style,
          ]}
          testID={testID}
        >
          {children}
        </SafeAreaView>
      </>
    );
  }

  // For Android, we use View with appropriate padding
  return (
    <>
      <StatusBar
        barStyle={defaultStatusBarStyle}
        backgroundColor={defaultBackgroundColor}
        translucent={false}
      />
      <View
        style={[
          styles.container,
          { backgroundColor: defaultBackgroundColor },
          edges.includes('top') && styles.topPadding,
          edges.includes('bottom') && styles.bottomPadding,
          style,
        ]}
        testID={testID}
      >
        {children}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topPadding: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  bottomPadding: {
    paddingBottom: Platform.OS === 'android' ? 16 : 0,
  },
});

export default SafeAreaWrapper;