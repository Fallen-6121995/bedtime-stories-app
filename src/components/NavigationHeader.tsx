// Navigation-specific header component for screens

import React from 'react';
import { Header } from './Header';
import { NavigationUtils } from '../navigation/navigationUtils';
import { useNavigation } from '@react-navigation/native';

interface NavigationHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  showSettings?: boolean;
  onSettingsPress?: () => void;
  variant?: 'default' | 'large' | 'minimal';
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  showSettings = false,
  onSettingsPress,
  variant = 'default',
}) => {
  const navigation = useNavigation();

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      NavigationUtils.navigateToSettings();
    }
  };

  const rightActions = showSettings ? [
    {
      icon: 'settings-outline',
      onPress: handleSettingsPress,
      accessibilityLabel: 'Open settings',
    },
  ] : [];

  return (
    <Header
      title={title}
      subtitle={subtitle}
      showBackButton={showBackButton}
      rightActions={rightActions}
      variant={variant}
    />
  );
};