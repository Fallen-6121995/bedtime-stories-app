import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  FlatList,
  ViewToken,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { setOnboardingCompleted } from '../utils/onboarding';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive sizing
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
const isLargeDevice = SCREEN_WIDTH >= 414;

const getResponsiveSize = (small: number, medium: number, large: number) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface OnboardingSlide {
  id: string;
  icon: string;
  title: string;
  description: string;
  colors: string[];
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'moon',
    title: '✨ Magical Bedtime Stories',
    description: 'Discover thousands of enchanting stories to spark imagination and wonder! 🌟',
    colors: ['#8B5CF6', '#7C3AED'],
  },
  {
    id: '2',
    icon: 'headset',
    title: '🎧 Listen & Read Together',
    description: 'Enjoy stories with beautiful narration or read along at your own pace! 📖',
    colors: ['#3B82F6', '#2563EB'],
  },
  {
    id: '3',
    icon: 'heart',
    title: '💖 Made Just for You',
    description: 'Age-appropriate stories tailored to your interests and imagination! 🎨',
    colors: ['#EC4899', '#DB2777'],
  },
];

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  // Get current slide colors for background
  const currentColors = slides[currentIndex].colors;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.navigate('Register');
    }
  };

  const handleSkip = async () => {
    await setOnboardingCompleted();
    navigation.navigate('MainTabs');
  };

  const handleGetStarted = async () => {
    await setOnboardingCompleted();
    navigation.navigate('Register');
  };

  const handleLogin = async () => {
    await setOnboardingCompleted();
    navigation.navigate('Login');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      {/* Decorative Stars */}
      <View style={styles.decorativeStars}>
        <Text style={[styles.star, styles.star1]}>⭐</Text>
        <Text style={[styles.star, styles.star2]}>✨</Text>
        <Text style={[styles.star, styles.star3]}>🌟</Text>
      </View>

      {/* Icon Container */}
      <Animated.View 
        style={[
          styles.iconContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconCircle}>
          <View style={styles.iconInnerCircle}>
            <Icon name={item.icon} size={getResponsiveSize(60, 70, 80)} color="#FFFFFF" />
          </View>
        </View>
      </Animated.View>

      {/* Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <LinearGradient
      colors={currentColors}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Slides */}
        <View style={styles.slidesContainer}>
          <FlatList
            ref={flatListRef}
            data={slides}
            renderItem={renderSlide}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            keyExtractor={(item) => item.id}
            style={styles.flatList}
          />
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            {isLastSlide ? (
              <>
                <TouchableOpacity
                  style={styles.getStartedButton}
                  onPress={handleGetStarted}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonContent}>
                    <Text style={styles.getStartedText}>Get Started 🚀</Text>
                    <Icon name="arrow-forward" size={20} color="#1F2937" />
                  </View>
                </TouchableOpacity>

                <View style={styles.bottomLinks}>
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={handleLogin}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.linkText}>Already have an account? </Text>
                    <Text style={[styles.linkText, styles.linkTextBold]}>Login</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.guestButton}
                    onPress={handleSkip}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.guestText}>Continue as Guest</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <View style={styles.nextButtonContent}>
                  <Icon name="arrow-forward" size={getResponsiveSize(22, 24, 26)} color={currentColors[0]} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  // Skip Button
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  skipText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // Slides Container
  slidesContainer: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },

  // Slide
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: getResponsiveSize(30, 40, 50),
    paddingVertical: 40,
  },

  // Decorative Stars
  decorativeStars: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    fontSize: getResponsiveSize(20, 24, 28),
    opacity: 0.6,
  },
  star1: {
    top: '15%',
    left: '10%',
  },
  star2: {
    top: '25%',
    right: '15%',
  },
  star3: {
    top: '60%',
    left: '15%',
  },

  // Icon
  iconContainer: {
    alignItems: 'center',
    marginBottom: getResponsiveSize(40, 50, 60),
  },
  iconCircle: {
    width: getResponsiveSize(160, 180, 200),
    height: getResponsiveSize(160, 180, 200),
    borderRadius: getResponsiveSize(80, 90, 100),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconInnerCircle: {
    width: getResponsiveSize(130, 145, 160),
    height: getResponsiveSize(130, 145, 160),
    borderRadius: getResponsiveSize(65, 72.5, 80),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content
  content: {
    alignItems: 'center',
    paddingHorizontal: getResponsiveSize(10, 15, 20),
  },
  title: {
    fontSize: getResponsiveSize(28, 32, 34),
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: getResponsiveSize(14, 16, 18),
    lineHeight: getResponsiveSize(34, 38, 40),
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: getResponsiveSize(16, 17, 18),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: getResponsiveSize(24, 26, 28),
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Bottom Section
  bottomSection: {
    paddingHorizontal: getResponsiveSize(30, 40, 50),
    paddingBottom: Platform.OS === 'ios' ? 20 : 30,
  },

  // Pagination
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getResponsiveSize(24, 28, 32),
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dotActive: {
    width: 28,
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },

  // Actions
  actions: {
    alignItems: 'center',
  },

  // Next Button (for slides 1-2)
  nextButton: {
    width: getResponsiveSize(64, 68, 72),
    height: getResponsiveSize(64, 68, 72),
    borderRadius: getResponsiveSize(32, 34, 36),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  nextButtonContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Get Started Button (last slide)
  getStartedButton: {
    width: '100%',
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsiveSize(18, 19, 20),
    gap: 10,
  },
  getStartedText: {
    fontSize: getResponsiveSize(18, 19, 20),
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: 0.5,
  },

  // Bottom Links
  bottomLinks: {
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  linkButton: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  linkText: {
    fontSize: getResponsiveSize(15, 15, 16),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
  },
  linkTextBold: {
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Guest Button
  guestButton: {
    paddingVertical: 12,
    marginTop: 8,
  },
  guestText: {
    fontSize: getResponsiveSize(14, 14, 15),
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default OnboardingScreen;
