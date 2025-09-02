// Signup screen with form validation and password confirmation

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
} from '../components';
import { useTheme } from '../hooks/useTheme';

export const SignupScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const { signup, isLoading, error, clearError } = useAuthContext();
  const { theme } = useTheme();
  const [showPassword] = useState(false);
  const [showConfirmPassword] = useState(false);

  const {
    getInputProps,
    handleSubmit,
    isFormValid,
    getFieldValue,
    getFieldError,
    setFieldValue,
    clearFieldError,
    setFieldError,
  } = useForm({
    name: {
      value: '',
      rules: [validationRules.required(), validationRules.name()],
    },
    email: {
      value: '',
      rules: [validationRules.required(), validationRules.email()],
    },
    password: {
      value: '',
      rules: [validationRules.required(), validationRules.password()],
    },
    confirmPassword: {
      value: '',
      rules: [validationRules.required()],
    },
  });

  const handleSignup = async (values: Record<string, string>) => {
    try {
      // Check password confirmation
      if (values.password !== values.confirmPassword) {
        setFieldError('confirmPassword', 'Passwords do not match');
        return;
      }

      clearError();
      await signup(values.email, values.password, values.name);
      // Navigation will be handled by the navigation system based on auth state
    } catch (error) {
      // Error is already handled by the auth context
      console.error('Signup error:', error);
    }
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handlePasswordChange = (value: string) => {
    const confirmPassword = getFieldValue('confirmPassword');
    if (confirmPassword && value !== confirmPassword) {
      setFieldError('confirmPassword', 'Passwords do not match');
    } else if (confirmPassword && value === confirmPassword) {
      clearFieldError('confirmPassword');
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    const password = getFieldValue('password');
    if (password && value !== password) {
      setFieldError('confirmPassword', 'Passwords do not match');
    } else if (password && value === password) {
      clearFieldError('confirmPassword');
    }
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
    signupButton: {
      marginTop: theme.spacing[2],
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
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginText: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.neutral[600],
      fontFamily: theme.typography.fontFamily.regular,
    },
    loginLink: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.primary[600],
      fontFamily: theme.typography.fontFamily.medium,
      marginLeft: theme.spacing[1],
    },
    passwordRequirements: {
      backgroundColor: theme.colors.neutral[100],
      borderRadius: 8,
      padding: theme.spacing[3],
      marginTop: theme.spacing[4],
    },
    requirementsTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.neutral[700],
      marginBottom: theme.spacing[2],
    },
    requirementText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.neutral[600],
      fontFamily: theme.typography.fontFamily.regular,
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.xs,
    },
  });

  if (isLoading) {
    return (
      <ScreenContainer style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LoadingSpinner size="large" />
          <Text style={[styles.subtitle, { marginTop: theme.spacing[4] }]}>
            Creating your account...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
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
            <Text style={styles.title}>Join the Adventure!</Text>
            <Text style={styles.subtitle}>
              Create your account to start exploring magical bedtime stories
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
                {...getInputProps('name')}
                label="Full Name"
                placeholder="Enter your full name"
                autoCapitalize="words"
              />
            </View>

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
                value={getFieldValue('password')}
                onChangeText={(value) => {
                  setFieldValue('password', value);
                  handlePasswordChange(value);
                }}
                label="Password"
                placeholder="Create a password"
                secureTextEntry={!showPassword}
                error={getFieldError('password')}
              />
            </View>

            <View style={styles.inputContainer}>
              <Input
                value={getFieldValue('confirmPassword')}
                onChangeText={(value) => {
                  setFieldValue('confirmPassword', value);
                  handleConfirmPasswordChange(value);
                }}
                label="Confirm Password"
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                error={getFieldError('confirmPassword')}
              />
            </View>

            <Button
              title="Create Account"
              onPress={() => handleSubmit(handleSignup)}
              disabled={!isFormValid() || isLoading}
              loading={isLoading}
              style={styles.signupButton}
            />
          </View>

          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <Text style={styles.requirementText}>
              • At least 8 characters long{'\n'}
              • Contains uppercase and lowercase letters{'\n'}
              • Contains at least one number{'\n'}
              • Passwords must match
            </Text>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Button
              title="Sign In"
              variant="ghost"
              onPress={handleLoginPress}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};