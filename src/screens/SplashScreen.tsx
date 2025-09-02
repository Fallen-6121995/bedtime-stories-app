// Animated splash screen with app branding

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { ScreenProps } from '../types';
import { useAuthContext } from '../context/AuthContext';
import { ScreenContainer } from '../components';
import { useTheme } from '../hooks/useTheme';

const { width, height } = Dimensions.get('window');

export const SplashScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const { theme } = useTheme();
  const [animationComplete, setAnimationComplete] = useState(false);

  // Animation values
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(50)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleScale = useRef(new Animated.Value(0.8)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;
  const starsOpacity = useRef(new Animated.Value(0)).current;
  const starsScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Start splash animation sequence
    const animationSequence = Animated.sequence([
      // Stars appear first
      Animated.parallel([
        Animated.timing(starsOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(starsScale, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]),
      
      // Logo animation with bounce effect
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(logoScale, {
            toValue: 1.3,
            duration: 600,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        // Gentle rotation for playfulness
        Animated.timing(logoRotation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      
      // Title animation with slide up effect
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]),
      
      // Subtitle animation
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(subtitleScale, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]),
    ]);

    // Gentle background color animation
    const backgroundAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundColorAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(backgroundColorAnim, {
          toValue: 2,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(backgroundColorAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );

    // Start animations
    animationSequence.start(() => {
      setAnimationComplete(true);
    });
    backgroundAnimation.start();

    // Navigate after minimum splash time and animation completes
    const timer = setTimeout(() => {
      if (animationComplete || !isLoading) {
        if (isAuthenticated) {
          navigation.navigate('Main' as never);
        } else {
          navigation.navigate('Login' as never);
        }
      }
    }, 2800); // Slightly less than 3 seconds to ensure smooth transition

    return () => {
      clearTimeout(timer);
      backgroundAnimation.stop();
    };
  }, [isAuthenticated, isLoading, navigation, animationComplete]);

  // Navigate when auth state is ready and minimum time has passed
  useEffect(() => {
    if (!isLoading && animationComplete) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigation.navigate('Main' as never);
        } else {
          navigation.navigate('Login' as never);
        }
      }, 500); // Small delay for smooth transition

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isAuthenticated, isLoading, navigation, animationComplete]);

  const backgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      '#FFF7ED', // Warm peach
      '#F0FDF4', // Soft mint
      '#EFF6FF', // Light sky blue
    ],
  });

  const logoRotate = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing[8],
    },
    logoCircle: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: theme.colors.primary[500],
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.primary[600],
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 16,
      borderWidth: 4,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    logoText: {
      fontSize: 56,
      color: 'white',
      fontFamily: theme.typography.fontFamily.playful,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },
    titleContainer: {
      alignItems: 'center',
    },
    title: {
      fontSize: theme.typography.fontSize['4xl'],
      fontFamily: theme.typography.fontFamily.playful,
      color: theme.colors.primary[600],
      textAlign: 'center',
      marginBottom: theme.spacing[3],
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.secondary[600],
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.xl,
      fontStyle: 'italic',
    },
    loadingContainer: {
      position: 'absolute',
      bottom: theme.spacing[12],
      alignItems: 'center',
    },
    loadingText: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.neutral[500],
      fontFamily: theme.typography.fontFamily.regular,
      marginTop: theme.spacing[4],
    },
    decorativeElements: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
    },
    star: {
      position: 'absolute',
      fontSize: 28,
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    star1: {
      top: height * 0.12,
      left: width * 0.08,
      color: '#FFD700', // Gold
    },
    star2: {
      top: height * 0.22,
      right: width * 0.12,
      color: '#87CEEB', // Sky blue
    },
    star3: {
      bottom: height * 0.18,
      left: width * 0.15,
      color: '#98FB98', // Pale green
    },
    star4: {
      bottom: height * 0.28,
      right: width * 0.08,
      color: '#DDA0DD', // Plum
    },
    star5: {
      top: height * 0.35,
      left: width * 0.05,
      color: '#F0E68C', // Khaki
    },
    star6: {
      bottom: height * 0.35,
      right: width * 0.05,
      color: '#FFB6C1', // Light pink
    },
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <ScreenContainer style={styles.container}>
        {/* Decorative elements */}
        <Animated.View 
          style={[
            styles.decorativeElements,
            {
              opacity: starsOpacity,
              transform: [{ scale: starsScale }],
            },
          ]}
        >
          <Text style={[styles.star, styles.star1]}>⭐</Text>
          <Text style={[styles.star, styles.star2]}>🌙</Text>
          <Text style={[styles.star, styles.star3]}>✨</Text>
          <Text style={[styles.star, styles.star4]}>⭐</Text>
          <Text style={[styles.star, styles.star5]}>🌟</Text>
          <Text style={[styles.star, styles.star6]}>💫</Text>
        </Animated.View>

        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                { scale: logoScale },
                { rotate: logoRotate },
              ],
              opacity: logoOpacity,
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>📚</Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              transform: [{ translateY: titleTranslateY }],
              opacity: titleOpacity,
            },
          ]}
        >
          <Text style={styles.title}>Bedtime Stories</Text>
          <Animated.View
            style={[
              {
                transform: [{ scale: subtitleScale }],
                opacity: subtitleOpacity,
              },
            ]}
          >
            <Text style={styles.subtitle}>
              Magical adventures await...
            </Text>
          </Animated.View>
        </Animated.View>

        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {isLoading ? 'Loading magical stories...' : animationComplete ? 'Welcome!' : 'Preparing your adventure...'}
          </Text>
        </View>
      </ScreenContainer>
    </Animated.View>
  );
};