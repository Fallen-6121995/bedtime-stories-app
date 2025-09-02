// Enhanced Input component with validation states

import React, { useState, forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useThemeContext } from '../context/ThemeContext';
import { getInputStyles, getTextStyles } from '../utils/theme';
import { InputProps } from '../types';

const Input = forwardRef<TextInput, InputProps>(({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  disabled = false,
  style,
  testID,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const { theme, isDarkMode } = useThemeContext();
  
  const inputStyles = getInputStyles(!!error, isFocused, theme, isDarkMode);
  const labelStyles = getTextStyles('caption', theme, isDarkMode);
  const errorStyles = getTextStyles('caption', theme, isDarkMode);
  
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[labelStyles, styles.label, error && styles.errorLabel]}>
          {label}
        </Text>
      )}
      
      <View style={[styles.inputContainer, inputStyles, disabled && styles.disabled]}>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={inputStyles.placeholderTextColor}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.textInput, { color: inputStyles.color }]}
          testID={testID}
          accessibilityLabel={label || placeholder}
          accessibilityState={{ disabled }}
          {...props}
        />
        
        {error && (
          <View style={styles.errorIcon}>
            <Icon
              name="error-outline"
              size={20}
              color={theme.colors.error}
            />
          </View>
        )}
      </View>
      
      {error && (
        <Text style={[errorStyles, styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
  },
  errorLabel: {
    // Error label styling handled by color prop
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0, // Remove default padding to use container padding
  },
  errorIcon: {
    marginLeft: 8,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Input;