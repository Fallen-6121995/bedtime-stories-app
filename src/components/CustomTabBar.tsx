import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../hooks/useTheme';
import { createButtonPressAnimation, ANIMATION_DURATION, EASING } from '../utils/animations';

const { width } = Dimensions.get('window');

// Tab configuration with icons and labels
const tabConfig = {
  Home: { icon: 'home-outline', activeIcon: 'home', label: 'Home' },
  Categories: { icon: 'grid-outline', activeIcon: 'grid', label: 'Categories' },
  Generate: { icon: 'add-circle-outline', activeIcon: 'add-circle', label: 'Create' },
  Favorites: { icon: 'heart-outline', activeIcon: 'heart', label: 'Favorites' },
  Profile: { icon: 'person-outline', activeIcon: 'person', label: 'Profile' },
};

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { colors, typography, spacing } = useTheme();
  const animatedValues = useRef(
    state.routes.map(() => new Animated.Value(1))
  ).current;
  const indicatorAnimation = useRef(new Animated.Value(0)).current;

  // Animate indicator position when tab changes
  useEffect(() => {
    Animated.timing(indicatorAnimation, {
      toValue: state.index,
      duration: ANIMATION_DURATION.normal,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }).start();
  }, [state.index, indicatorAnimation]);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.neutral[50],
      height: 80,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: spacing[2],
      paddingTop: spacing[2],
      paddingBottom: spacing[4],
      justifyContent: 'space-around',
      alignItems: 'center',
      shadowColor: colors.neutral[900],
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: -2 },
      shadowRadius: 8,
      elevation: 10,
      borderTopWidth: 1,
      borderTopColor: colors.neutral[200],
    },
    tab: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing[1],
      paddingHorizontal: spacing[2],
      minWidth: 60,
    },
    activeTab: {
      backgroundColor: colors.primary[100],
      borderRadius: 16,
    },
    label: {
      fontSize: typography.fontSize.xs,
      fontFamily: typography.fontFamily.medium,
      marginTop: spacing[1],
      textAlign: 'center',
    },
    activeLabel: {
      color: colors.primary[600],
    },
    inactiveLabel: {
      color: colors.neutral[500],
    },
    createTab: {
      backgroundColor: colors.primary[500],
      borderRadius: 20,
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[3],
      marginTop: -spacing[2],
    },
    createLabel: {
      color: colors.neutral[50],
      fontFamily: typography.fontFamily.bold,
    },
  });

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const config = tabConfig[route.name as keyof typeof tabConfig];
        
        if (!config) return null;

        const onPress = () => {
          // Animate button press
          createButtonPressAnimation(animatedValues[index]).start();

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Special styling for the Create tab
        const isCreateTab = route.name === 'Generate';
        const tabStyle = [
          styles.tab,
          isFocused && !isCreateTab && styles.activeTab,
          isCreateTab && styles.createTab,
        ];

        const labelStyle = [
          styles.label,
          isCreateTab ? styles.createLabel : (isFocused ? styles.activeLabel : styles.inactiveLabel),
        ];

        const iconColor = isCreateTab 
          ? colors.neutral[50] 
          : (isFocused ? colors.primary[600] : colors.neutral[500]);

        const iconName = isFocused ? config.activeIcon : config.icon;

        return (
          <Animated.View
            key={route.key}
            style={{
              transform: [{ scale: animatedValues[index] }],
            }}
          >
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={tabStyle}
              activeOpacity={0.7}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: isFocused
                        ? indicatorAnimation.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [1, 1.1, 1],
                            extrapolate: 'clamp',
                          })
                        : 1,
                    },
                  ],
                }}
              >
                <Icon
                  name={iconName}
                  size={isCreateTab ? 28 : 24}
                  color={iconColor}
                />
              </Animated.View>
              <Animated.Text
                style={[
                  labelStyle,
                  {
                    opacity: isFocused
                      ? indicatorAnimation.interpolate({
                          inputRange: [index - 1, index, index + 1],
                          outputRange: [0.7, 1, 0.7],
                          extrapolate: 'clamp',
                        })
                      : 0.7,
                  },
                ]}
              >
                {config.label}
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
};

