// Settings screen for app configuration

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SettingsScreenProps } from '../types/navigation';
import ScreenContainer from '../components/ScreenContainer';
import Button from '../components/Button';
import { useTheme } from '../hooks/useTheme';
import { useAuthContext } from '../context/AuthContext';

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  navigation 
}) => {
  const { colors, typography, spacing } = useTheme();
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will be handled automatically by the auth context
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral[50],
    },
    content: {
      padding: spacing[4],
    },
    title: {
      fontSize: typography.fontSize['2xl'],
      fontFamily: typography.fontFamily.bold,
      color: colors.neutral[900],
      marginBottom: spacing[6],
      textAlign: 'center',
    },
    section: {
      marginBottom: spacing[6],
    },
    sectionTitle: {
      fontSize: typography.fontSize.lg,
      fontFamily: typography.fontFamily.medium,
      color: colors.neutral[800],
      marginBottom: spacing[3],
    },
    placeholder: {
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.regular,
      color: colors.neutral[500],
      marginBottom: spacing[4],
      fontStyle: 'italic',
    },
  });

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Text style={styles.placeholder}>
            User preferences and account settings will be available here.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          <Text style={styles.placeholder}>
            Theme, font size, and other app preferences will be configurable here.
          </Text>
        </View>

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
        />
      </View>
    </ScreenContainer>
  );
};