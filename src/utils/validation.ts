// Form validation utilities

import { ValidationRule, FormField, FormState } from '../types';
import { isValidEmail, isValidPassword } from './helpers';

// Validate a single field based on its rules
export const validateField = (value: string, rules: ValidationRule[] = []): string | undefined => {
  for (const rule of rules) {
    // Required validation
    if (rule.required && (!value || value.trim().length === 0)) {
      return 'This field is required';
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim().length === 0) {
      continue;
    }

    // Minimum length validation
    if (rule.minLength && value.length < rule.minLength) {
      return `Must be at least ${rule.minLength} characters`;
    }

    // Maximum length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      return `Must be no more than ${rule.maxLength} characters`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return 'Invalid format';
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      return 'Invalid value';
    }
  }

  return undefined;
};

// Validate entire form
export const validateForm = (formState: FormState): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [fieldName, field] of Object.entries(formState)) {
    const error = validateField(field.value, field.rules);
    if (error) {
      errors[fieldName] = error;
      isValid = false;
    }
  }

  return { isValid, errors };
};

// Common validation rules
export const validationRules = {
  required: (): ValidationRule => ({
    required: true,
  }),

  email: (): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => isValidEmail(value),
  }),

  password: (): ValidationRule => ({
    minLength: 8,
    custom: (value: string) => isValidPassword(value),
  }),

  minLength: (length: number): ValidationRule => ({
    minLength: length,
  }),

  maxLength: (length: number): ValidationRule => ({
    maxLength: length,
  }),

  pattern: (regex: RegExp): ValidationRule => ({
    pattern: regex,
  }),

  custom: (validator: (value: string) => boolean): ValidationRule => ({
    custom: validator,
  }),

  confirmPassword: (originalPassword: string): ValidationRule => ({
    custom: (value: string) => value === originalPassword,
  }),

  name: (): ValidationRule => ({
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
  }),

  age: (): ValidationRule => ({
    pattern: /^\d+$/,
    custom: (value: string) => {
      const age = parseInt(value, 10);
      return age >= 1 && age <= 120;
    },
  }),
};

// Create form field with validation
export const createFormField = (
  initialValue: string = '',
  rules: ValidationRule[] = []
): FormField => ({
  value: initialValue,
  error: undefined as string | undefined,
  touched: false,
  rules,
});

// Update form field value and validate
export const updateFormField = (
  field: FormField,
  value: string,
  shouldValidate: boolean = false
): FormField => {
  const error = shouldValidate ? validateField(value, field.rules) : undefined;
  
  return {
    ...field,
    value,
    error: error as string | undefined,
    touched: true,
  };
};

// Validate field on blur
export const validateFieldOnBlur = (field: FormField): FormField => {
  const error = validateField(field.value, field.rules);
  
  return {
    ...field,
    error: error as string | undefined,
    touched: true,
  };
};

// Get field error message
export const getFieldError = (field: FormField): string | undefined => {
  return field.touched ? field.error : undefined;
};

// Check if field has error
export const hasFieldError = (field: FormField): boolean => {
  return field.touched && !!field.error;
};

// Get form field props for input components
export const getFieldProps = (
  field: FormField,
  onChangeText: (value: string) => void,
  onBlur?: () => void
) => ({
  value: field.value,
  onChangeText,
  onBlur,
  error: getFieldError(field),
});

// Validation messages
export const validationMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  password: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  passwordMismatch: 'Passwords do not match',
  minLength: (length: number) => `Must be at least ${length} characters`,
  maxLength: (length: number) => `Must be no more than ${length} characters`,
  invalidFormat: 'Invalid format',
  invalidName: 'Name must contain only letters and spaces',
  invalidAge: 'Please enter a valid age between 1 and 120',
};