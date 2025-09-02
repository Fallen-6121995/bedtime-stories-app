// Tab bar icon component with consistent styling

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../hooks/useTheme';

interface TabBarIconProps {
  name: string;
  focused: boolean;
  size?: number;
  badge?: number;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({
  name,
  focused,
  size = 24,
  badge,
}) => {
  const { colors, spacing } = useTheme();

  const iconColor = focused ? colors.primary[600] : colors.neutral[500];

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    badge: {
      position: 'absolute',
      top: -spacing[1],
      right: -spacing[1],
      backgroundColor: colors.error,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing[1],
    },
    badgeText: {
      color: colors.neutral[50],
      fontSize: 12,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <Icon name={name} size={size} color={iconColor} />
      {badge && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badge > 99 ? '99+' : badge.toString()}
          </Text>
        </View>
      )}
    </View>
  );
};