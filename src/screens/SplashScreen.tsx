import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Icon name="moon" size={80} color="#FFFFFF" />
          <View style={styles.starContainer}>
            <Icon name="star" size={20} color="#FCD34D" style={styles.star1} />
            <Icon name="star" size={16} color="#FCD34D" style={styles.star2} />
            <Icon name="star" size={12} color="#FCD34D" style={styles.star3} />
          </View>
        </View>
        
        <Text style={styles.title}>Bedtime Stories</Text>
        <Text style={styles.subtitle}>Sweet dreams await...</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  starContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
  },
  star1: {
    position: 'absolute',
    top: 10,
    right: -10,
  },
  star2: {
    position: 'absolute',
    top: 40,
    right: -20,
  },
  star3: {
    position: 'absolute',
    bottom: 20,
    left: -15,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
});

export default SplashScreen;
