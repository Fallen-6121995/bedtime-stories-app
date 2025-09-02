// Enhanced Story Reader component with child-friendly fonts and reading features

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { EnhancedStory } from '../types';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import storyService from '../services/StoryService';

interface StoryReaderProps {
  story: EnhancedStory;
  onReadingProgressUpdate?: (progress: number) => void;
  onReadingComplete?: () => void;
  fontSize?: 'small' | 'medium' | 'large';
  testID?: string;
}

const { height } = Dimensions.get('window');

const StoryReader: React.FC<StoryReaderProps> = ({
  story,
  onReadingProgressUpdate,
  onReadingComplete,
  fontSize = 'medium',
  testID,
}) => {
  const { colors, typography, spacing } = useTheme();
  const { isAuthenticated } = useAuth();
  
  // State management
  const [readingProgress, setReadingProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [showReadingControls, setShowReadingControls] = useState(true);
  const [autoScroll, setAutoScroll] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(200); // words per minute
  
  // Animation refs
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const autoScrollInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Font size configurations
  const fontSizeConfig = {
    small: {
      content: typography.fontSize.base,
      lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
    },
    medium: {
      content: typography.fontSize.lg,
      lineHeight: typography.lineHeight.relaxed * typography.fontSize.lg,
    },
    large: {
      content: typography.fontSize.xl,
      lineHeight: typography.lineHeight.relaxed * typography.fontSize.xl,
    },
  };

  // Calculate reading time and auto-scroll speed
  const wordCount = story.content.trim().split(/\s+/).length;
  const estimatedReadingTime = Math.ceil(wordCount / readingSpeed);
  const scrollSpeed = (height * 0.8) / (estimatedReadingTime * 60); // pixels per second

  useEffect(() => {
    // Auto-hide controls after 3 seconds of inactivity
    const hideControlsTimer = setTimeout(() => {
      if (isReading) {
        Animated.timing(controlsOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowReadingControls(false));
      }
    }, 3000);

    return () => clearTimeout(hideControlsTimer);
  }, [isReading, controlsOpacity]);

  useEffect(() => {
    // Handle auto-scroll
    if (autoScroll && isReading) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }

    return () => stopAutoScroll();
  }, [autoScroll, isReading]);

  const startAutoScroll = () => {
    if (autoScrollInterval.current) return;
    
    autoScrollInterval.current = setInterval(() => {
      scrollViewRef.current?.scrollTo({
        y: readingProgress * scrollSpeed * 1000,
        animated: true,
      });
    }, 1000);
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const progress = Math.min(contentOffset.y / (contentSize.height - layoutMeasurement.height), 1);
    const progressPercent = Math.max(0, progress);
    
    setReadingProgress(progressPercent);
    onReadingProgressUpdate?.(progressPercent);

    // Mark as reading complete when reaching 90%
    if (progressPercent >= 0.9 && !isReading) {
      setIsReading(true);
      onReadingComplete?.();
      updateReadingProgress();
    }
  };

  const updateReadingProgress = async () => {
    if (isAuthenticated) {
      try {
        await storyService.updateReadingProgress(story.id);
      } catch (error) {
        console.error('Error updating reading progress:', error);
      }
    }
  };

  const toggleReadingMode = () => {
    setIsReading(!isReading);
    
    if (!isReading) {
      // Entering reading mode - fade out distractions
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Exiting reading mode - restore normal view
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setShowReadingControls(true);
      Animated.timing(controlsOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const toggleAutoScroll = () => {
    setAutoScroll(!autoScroll);
  };

  const adjustReadingSpeed = (delta: number) => {
    const newSpeed = Math.max(100, Math.min(400, readingSpeed + delta));
    setReadingSpeed(newSpeed);
  };

  const showControls = () => {
    setShowReadingControls(true);
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleContentPress = () => {
    if (isReading && !showReadingControls) {
      showControls();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral[50],
    },
    scrollContent: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[6],
      paddingBottom: spacing[12], // Extra space for reading controls
    },
    storyContent: {
      fontSize: fontSizeConfig[fontSize].content,
      fontFamily: typography.fontFamily.regular,
      color: colors.neutral[800],
      lineHeight: fontSizeConfig[fontSize].lineHeight,
      textAlign: 'left',
      letterSpacing: 0.3,
    },
    readingModeContent: {
      fontSize: fontSizeConfig[fontSize].content + 2,
      lineHeight: fontSizeConfig[fontSize].lineHeight + 4,
      color: colors.neutral[900],
    },
    readingControls: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.neutral[100],
      borderTopWidth: 1,
      borderTopColor: colors.neutral[200],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    controlsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing[2],
    },
    controlButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      borderRadius: 20,
      backgroundColor: colors.primary[100],
    },
    activeControlButton: {
      backgroundColor: colors.primary[500],
    },
    controlButtonText: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.medium,
      color: colors.primary[700],
      marginLeft: spacing[1],
    },
    activeControlButtonText: {
      color: '#FFFFFF',
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[2],
    },
    progressBar: {
      flex: 1,
      height: 4,
      backgroundColor: colors.neutral[200],
      borderRadius: 2,
      marginHorizontal: spacing[3],
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary[500],
      borderRadius: 2,
    },
    progressText: {
      fontSize: typography.fontSize.xs,
      fontFamily: typography.fontFamily.medium,
      color: colors.neutral[600],
      minWidth: 40,
      textAlign: 'center',
    },
    speedControls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    speedButton: {
      padding: spacing[2],
      borderRadius: 16,
      backgroundColor: colors.secondary[100],
      marginHorizontal: spacing[1],
    },
    speedText: {
      fontSize: typography.fontSize.xs,
      fontFamily: typography.fontFamily.medium,
      color: colors.neutral[600],
      marginHorizontal: spacing[2],
      minWidth: 60,
      textAlign: 'center',
    },
    readingModeOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    readingModeButton: {
      backgroundColor: colors.primary[500],
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[4],
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
    },
    readingModeButtonText: {
      color: '#FFFFFF',
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.bold,
      marginLeft: spacing[2],
    },
  });

  return (
    <View style={styles.container} testID={testID}>
      <Pressable onPress={handleContentPress} style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={!isReading}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <Text
            style={[
              styles.storyContent,
              isReading && styles.readingModeContent,
            ]}
          >
            {story.content}
          </Text>
        </ScrollView>
      </Pressable>

      {/* Reading Controls */}
      {showReadingControls && (
        <Animated.View
          style={[
            styles.readingControls,
            { opacity: controlsOpacity },
          ]}
        >
          <View style={styles.controlsRow}>
            <Pressable
              onPress={toggleReadingMode}
              style={[
                styles.controlButton,
                isReading && styles.activeControlButton,
              ]}
            >
              <Icon
                name={isReading ? 'visibility-off' : 'visibility'}
                size={16}
                color={isReading ? '#FFFFFF' : colors.primary[700]}
              />
              <Text
                style={[
                  styles.controlButtonText,
                  isReading && styles.activeControlButtonText,
                ]}
              >
                {isReading ? 'Exit Reading' : 'Reading Mode'}
              </Text>
            </Pressable>

            <Pressable
              onPress={toggleAutoScroll}
              style={[
                styles.controlButton,
                autoScroll && styles.activeControlButton,
              ]}
            >
              <Icon
                name={autoScroll ? 'pause' : 'play-arrow'}
                size={16}
                color={autoScroll ? '#FFFFFF' : colors.primary[700]}
              />
              <Text
                style={[
                  styles.controlButtonText,
                  autoScroll && styles.activeControlButtonText,
                ]}
              >
                Auto Scroll
              </Text>
            </Pressable>

            <View style={styles.speedControls}>
              <Pressable
                onPress={() => adjustReadingSpeed(-25)}
                style={styles.speedButton}
              >
                <Icon
                  name="remove"
                  size={14}
                  color={colors.secondary[700]}
                />
              </Pressable>
              
              <Text style={styles.speedText}>
                {readingSpeed} wpm
              </Text>
              
              <Pressable
                onPress={() => adjustReadingSpeed(25)}
                style={styles.speedButton}
              >
                <Icon
                  name="add"
                  size={14}
                  color={colors.secondary[700]}
                />
              </Pressable>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {Math.round(readingProgress * 100)}%
            </Text>
            
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { width: `${readingProgress * 100}%` }
                ]}
              />
            </View>
            
            <Text style={styles.progressText}>
              {Math.round((1 - readingProgress) * estimatedReadingTime)}m
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default StoryReader;