// Favorites screen for displaying user's favorite stories

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FavoritesScreenProps } from '../types/navigation';
import ScreenContainer from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { useTheme } from '../hooks/useTheme';

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ 
  navigation 
}) => {
  const { colors, typography, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral[50],
    },
    content: {
      flex: 1,
      padding: spacing[4],
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: typography.fontSize['2xl'],
      fontFamily: typography.fontFamily.bold,
      color: colors.neutral[900],
      marginBottom: spacing[4],
      textAlign: 'center',
    },
    placeholder: {
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.regular,
      color: colors.neutral[500],
      textAlign: 'center',
      fontStyle: 'italic',
    },
  });

  return (
    <ScreenContainer style={styles.container}>
      <Header title="Favorites" />
      <View style={styles.content}>
        <Text style={styles.title}>❤️ Your Favorite Stories</Text>
        <Text style={styles.placeholder}>
          Your favorite stories will appear here once you start marking stories as favorites.
        </Text>
      </View>
    </ScreenContainer>
  );
};