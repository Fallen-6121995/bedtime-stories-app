import React from 'react';
import { ActivityIndicator, GestureResponderEvent, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GRADIENT_COLORS } from '../constants/gradients';

type PrimaryButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, onPress, disabled = false, loading = false, style }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.pressable,
        style,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      <LinearGradient
        colors={GRADIENT_COLORS.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#0A2E1A" />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 14,
    overflow: 'hidden',
    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.6,
  },
  gradient: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A2E1A',
    letterSpacing: 0.4,
  },
});


