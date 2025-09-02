// Login screen with email/password authentication

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { ScreenProps } from '../types';
import { useAuthContext } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validationRules } from '../utils/validation';
import {
  ScreenContainer,
  Input,
  Button,
  LoadingSpinner,
  FeedbackAnimation,
} from '../components';
import { useTheme, useFeedback } from '../hooks';

export const LoginScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const { login, isLoading, error, clearError } = useAuthContext();
  const { theme } = useTheme();
  const { feedback, showSuccess, showError } = useFeedback();
  const [showPassword] = useState(false);

  const {
    getInputProps,
    handleSubmit,
    isFormValid,
  } = useForm({
    email: {
      value: '',
      rules: [validationRules.required(), validationRules.email()],
    },
    password: {
      value: '',
      rules: [validationRules.required()],
    },
  });

  const handleLogin = async (values: Record<string, string>) => {
    try {
      clearError();
      await login(values.email, values.password);
      showSuccess('Welcome back! Redirecting to your stories...', 2000);
      // Navigation will be handled by the navigation system based on auth state
    } catch (error) {
      // Error is already handled by the auth context
      showError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', error);
    }
  };

  const handleSignupPress = () => {
    navigation.navigate('Signup');
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Demo App',
      'In a real app, this would navigate to password reset. For demo purposes, try:\n\nEmail: demo@bedtimestories.com\nPassword: Demo123!',
      [{ text: 'OK' }]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.neutral[50],
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: theme.spacing[6],
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing[8],
    },
    title: {
      fontSize: theme.typography.fontSize['3xl'],
      fontFamily: theme.typography.fontFamily.playful,
      color: theme.colors.primary[600],
      marginBottom: theme.spacing[2],
      textAlign: 'center',
    },
    subtitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.neutral[600],
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.lg,
    },
    form: {
      marginBottom: theme.spacing[6],
    },
    inputContainer: {
      marginBottom: theme.spacing[4],
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginTop: theme.spacing[2],
      marginBottom: theme.spacing[6],
    },
    forgotPasswordText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.primary[600],
      fontFamily: theme.typography.fontFamily.medium,
    },
    loginButton: {
      marginBottom: theme.spacing[4],
    },
    errorContainer: {
      backgroundColor: theme.colors.error + '10',
      borderRadius: 8,
      padding: theme.spacing[3],
      marginBottom: theme.spacing[4],
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: theme.spacing[6],
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.neutral[200],
    },
    dividerText: {
      marginHorizontal: theme.spacing[4],
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.neutral[500],
      fontFamily: theme.typography.fontFamily.regular,
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    signupText: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.neutral[600],
      fontFamily: theme.typography.fontFamily.regular,
    },
    signupLink: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.primary[600],
      fontFamily: theme.typography.fontFamily.medium,
      marginLeft: theme.spacing[1],
    },
    demoInfo: {
      backgroundColor: theme.colors.info + '10',
      borderRadius: 8,
      padding: theme.spacing[3],
      marginTop: theme.spacing[4],
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.info,
    },
    demoText: {
      color: theme.colors.info,
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
    },
  });

  if (isLoading) {
    return (
      <ScreenContainer style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LoadingSpinner size="large" />
          <Text style={[styles.subtitle, { marginTop: theme.spacing[4] }]}>
            Signing you in...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      {feedback && (
        <FeedbackAnimation
          type={feedback.type}
          message={feedback.message}
          visible={feedback.visible}
        />
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your bedtime story adventure
            </Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error?.toString() || 'An error occurred'}</Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Input
                {...getInputProps('email')}
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Input
                {...getInputProps('password')}
                label="Password"
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
              />
            </View>

            <Button
              title="Forgot Password?"
              variant="ghost"
              onPress={handleForgotPassword}
              style={styles.forgotPassword}
            />

            <Button
              title="Sign In"
              onPress={() => handleSubmit(handleLogin)}
              disabled={!isFormValid() || isLoading}
              loading={isLoading}
              style={styles.loginButton}
            />
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <Button
              title="Sign Up"
              variant="ghost"
              onPress={handleSignupPress}
            />
          </View>

          <View style={styles.demoInfo}>
            <Text style={styles.demoText}>
              Demo Account:{'\n'}
              Email: demo@bedtimestories.com{'\n'}
              Password: Demo123!
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};