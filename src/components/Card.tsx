// Enhanced Card component with multiple variants

import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { getCardStyles } from '../utils/theme';
import { CardProps } from '../types';

const Card: React.FC<CardProps> = ({
  children,
  variant = 'grid',
  onPress,
  shadow = true,
  style,
  testID,
}) => {
  const { theme, isDarkMode } = useThemeContext();
  
  const cardStyles = getCardStyles(variant, theme, isDarkMode, shadow);
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const CardContent = (
    <View
      style={[cardStyles, style]}
      testID={testID}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
      >
        {CardContent}
      </Pressable>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
});

export default Card;