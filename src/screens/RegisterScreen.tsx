import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import AuthService from '../services/auth/AuthService';
import { THEME } from '../theme/appTheme';

type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGuestUpgrade, setIsGuestUpgrade] = useState(false);

  // --- RESPONSIVE LOGIC ---
  const cardWidth = Math.min(width * 0.9, 450); // Cap width for tablets
  const isShortScreen = height < 750; // Detect smaller devices

  // Dynamic sizing based on screen height
  const headerMargin = isShortScreen ? 16 : 32;
  const logoSize = isShortScreen ? 60 : 80;
  const iconSize = isShortScreen ? 32 : 48;
  const inputSpacing = isShortScreen ? 12 : 20;

  useEffect(() => {
    checkGuestStatus();
  }, []);

  const checkGuestStatus = async () => {
    const isGuest = await AuthService.isGuest();
    setIsGuestUpgrade(isGuest);
  };

  const validateInputs = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields to continue.');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'The passwords you entered do not match.');
      return false;
    }

    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters long.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {
      if (isGuestUpgrade) {
        await AuthService.upgradeGuestAccount({
          email: email.trim().toLowerCase(),
          password,
          name: name.trim(),
        });

        Alert.alert('Account Saved! 🎉', 'Your guest progress has been saved successfully.', [
          {
            text: 'Continue',
            onPress: () => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] })),
          },
        ]);
      } else {
        await AuthService.register({
          email: email.trim().toLowerCase(),
          password,
          name: name.trim(),
        });

        Alert.alert('Welcome! 🎉', 'Your account has been created successfully!', [
          {
            text: 'Get Started',
            onPress: () => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] })),
          },
        ]);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Something went wrong. Please try again.';

      if (error.statusCode === 400) {
        if (error.message?.includes('email')) {
          errorMessage = 'This email is already registered.';
        } else {
          errorMessage = error.message || 'Invalid registration data.';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={THEME.gradients.primary}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative Circles */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                { paddingTop: insets.top > 0 ? 0 : 20 } // Adjust top padding
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              
              {/* Back Button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="chevron-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Header */}
              <View style={[styles.header, { marginBottom: headerMargin }]}>
                <View style={[styles.logoContainer, { width: logoSize, height: logoSize, borderRadius: logoSize / 2 }]}>
                  <Icon name="sparkles" size={iconSize} color="#FFFFFF" />
                </View>
                <Text style={styles.title}>
                  {isGuestUpgrade ? 'Save Progress' : 'Create Account'}
                </Text>
                <Text style={styles.subtitle}>
                  Join us for magical bedtime stories ✨
                </Text>
              </View>

              {/* Form Card */}
              <View style={[styles.formCard, { width: cardWidth }]}>
                
                {/* Name Input */}
                <View style={[styles.inputGroup, { marginBottom: inputSpacing }]}>
                  <Text style={styles.label}>Full Name</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="person-outline" size={20} color={THEME.colors.textMedium} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Your Name"
                      placeholderTextColor={THEME.colors.textLight}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                {/* Email Input */}
                <View style={[styles.inputGroup, { marginBottom: inputSpacing }]}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="mail-outline" size={20} color={THEME.colors.textMedium} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="name@example.com"
                      placeholderTextColor={THEME.colors.textLight}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={[styles.inputGroup, { marginBottom: inputSpacing }]}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="lock-closed-outline" size={20} color={THEME.colors.textMedium} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Create password"
                      placeholderTextColor={THEME.colors.textLight}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      <Icon
                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={THEME.colors.textMedium}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.hint}>Min. 8 characters</Text>
                </View>

                {/* Confirm Password */}
                <View style={[styles.inputGroup, { marginBottom: inputSpacing + 8 }]}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="shield-checkmark-outline" size={20} color={THEME.colors.textMedium} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Repeat password"
                      placeholderTextColor={THEME.colors.textLight}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeButton}
                    >
                      <Icon
                        name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={THEME.colors.textMedium}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Register Button */}
                <TouchableOpacity
                  style={styles.registerButtonWrapper}
                  onPress={handleRegister}
                  disabled={loading}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={THEME.gradients.primary}
                    style={styles.registerButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.registerButtonText}>
                        {isGuestUpgrade ? 'Save Account' : 'Create Account'}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Terms */}
                <Text style={styles.termsText}>
                  By signing up, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>

                {/* Footer Link */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center', // Centers card
  },

  // Background Decorations
  circle1: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  circle2: {
    position: 'absolute',
    bottom: 100,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  // Back Button
  backButton: {
    alignSelf: 'flex-start',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  // Header
  header: {
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    fontFamily: THEME.fonts.heading,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontFamily: THEME.fonts.medium,
  },

  // Form Card
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    ...THEME.shadows.large,
  },

  // Inputs
  inputGroup: {
    // marginBottom handled dynamically
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textDark,
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: THEME.fonts.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.inputBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    height: 56,
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: THEME.colors.textDark,
    fontFamily: THEME.fonts.medium,
    height: '100%',
  },
  eyeButton: {
    padding: 12,
    marginRight: 4,
  },
  hint: {
    fontSize: 12,
    color: THEME.colors.textLight,
    marginTop: 6,
    marginLeft: 4,
    fontFamily: THEME.fonts.medium,
  },

  // Register Button
  registerButtonWrapper: {
    borderRadius: 16,
    marginBottom: 16,
    ...THEME.shadows.glow(THEME.colors.primary),
  },
  registerButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: THEME.fonts.heading,
  },

  // Terms
  termsText: {
    fontSize: 12,
    color: THEME.colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    fontFamily: THEME.fonts.medium,
  },
  termsLink: {
    color: THEME.colors.primary,
    fontWeight: '700',
  },

  // Footer Link
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: THEME.colors.textMedium,
    fontFamily: THEME.fonts.medium,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.primary,
    fontFamily: THEME.fonts.heading,
  },
});

export default RegisterScreen;