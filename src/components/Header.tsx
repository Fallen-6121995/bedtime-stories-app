// Header component with customizable options

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../hooks/useTheme';
import { useNavigation } from '@react-navigation/native';

interface HeaderAction {
  icon: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftAction?: HeaderAction;
  rightActions?: HeaderAction[];
  showBackButton?: boolean;
  onBackPress?: () => void;
  backgroundColor?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  testID?: string;
  variant?: 'default' | 'large' | 'minimal';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightActions = [],
  showBackButton = false,
  onBackPress,
  backgroundColor,
  style,
  titleStyle,
  subtitleStyle,
  testID,
  variant = 'default',
}) => {
  const { colors, typography, spacing } = useTheme();
  const navigation = useNavigation();
  
  const defaultBackgroundColor = backgroundColor || colors.neutral[50];
  const iconColor = colors.neutral[700];

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: variant === 'large' ? spacing[6] : spacing[4],
      paddingHorizontal: spacing[4],
      minHeight: variant === 'large' ? 80 : (variant === 'minimal' ? 48 : 64),
      backgroundColor: defaultBackgroundColor,
      borderBottomWidth: variant === 'minimal' ? 0 : 1,
      borderBottomColor: colors.neutral[200],
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'flex-start',
    },
    centerSection: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'flex-end',
    },
    actionButton: {
      padding: spacing[2],
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionSpacing: {
      marginLeft: spacing[2],
    },
    title: {
      fontSize: variant === 'large' ? typography.fontSize['2xl'] : typography.fontSize.xl,
      fontFamily: typography.fontFamily.bold,
      color: colors.neutral[900],
      textAlign: 'center',
    },
    subtitle: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.regular,
      color: colors.neutral[600],
      marginTop: spacing[1],
      textAlign: 'center',
    },
  });

  return (
    <View style={[styles.container, style]} testID={testID}>
      {/* Left side */}
      <View style={styles.leftSection}>
        {showBackButton && (
          <Pressable
            onPress={handleBackPress}
            style={styles.actionButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon name="arrow-back" size={24} color={iconColor} />
          </Pressable>
        )}
        {leftAction && (
          <Pressable
            onPress={leftAction.onPress}
            style={styles.actionButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={leftAction.accessibilityLabel}
          >
            <Icon name={leftAction.icon} size={24} color={iconColor} />
          </Pressable>
        )}
      </View>

      {/* Center - Title and subtitle */}
      <View style={styles.centerSection}>
        {title && (
          <Text style={[styles.title, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text style={[styles.subtitle, subtitleStyle]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right side */}
      <View style={styles.rightSection}>
        {rightActions.map((action, index) => (
          <Pressable
            key={index}
            onPress={action.onPress}
            style={[styles.actionButton, index > 0 && styles.actionSpacing]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={action.accessibilityLabel}
          >
            <Icon name={action.icon} size={24} color={iconColor} />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default Header;