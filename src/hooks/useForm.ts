// Form management hook

import { useState, useCallback } from 'react';
import { FormState, ValidationRule } from '../types';
import { 
  validateForm, 
  createFormField, 
  updateFormField, 
  validateFieldOnBlur,
  getFieldProps 
} from '../utils/validation';

export const useForm = (initialFields: Record<string, { value?: string; rules?: ValidationRule[] }>) => {
  const [formState, setFormState] = useState<FormState>(() => {
    const state: FormState = {};
    Object.entries(initialFields).forEach(([key, config]) => {
      state[key] = createFormField(config.value || '', config.rules || []);
    });
    return state;
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const updateField = useCallback((fieldName: string, value: string, shouldValidate: boolean = false) => {
    setFormState(prev => ({
      ...prev,
      [fieldName]: updateFormField(prev[fieldName], value, shouldValidate),
    }));
  }, []);

  const validateField = useCallback((fieldName: string) => {
    setFormState(prev => ({
      ...prev,
      [fieldName]: validateFieldOnBlur(prev[fieldName]),
    }));
  }, []);

  const validateAllFields = useCallback(() => {
    const { isValid, errors } = validateForm(formState);
    
    // Update all fields with their errors and mark as touched
    setFormState(prev => {
      const newState: FormState = {};
      Object.entries(prev).forEach(([key, field]) => {
        newState[key] = {
          ...field,
          error: errors[key] as string | undefined,
          touched: true,
        };
      });
      return newState;
    });

    return isValid;
  }, [formState]);

  const resetForm = useCallback(() => {
    setFormState(prev => {
      const newState: FormState = {};
      Object.entries(prev).forEach(([key, field]) => {
        newState[key] = {
          ...field,
          value: '',
          error: undefined as string | undefined,
          touched: false,
        };
      });
      return newState;
    });
  }, []);

  const setFieldValue = useCallback((fieldName: string, value: string) => {
    updateField(fieldName, value, false);
  }, [updateField]);

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        error,
        touched: true,
      },
    }));
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        error: undefined,
      },
    }));
  }, []);

  const getFieldValue = useCallback((fieldName: string): string => {
    return formState[fieldName]?.value || '';
  }, [formState]);

  const getFieldError = useCallback((fieldName: string): string | undefined => {
    const field = formState[fieldName];
    return field?.touched ? field.error : undefined;
  }, [formState]);

  const hasFieldError = useCallback((fieldName: string): boolean => {
    const field = formState[fieldName];
    return field?.touched && !!field.error;
  }, [formState]);

  const getInputProps = useCallback((fieldName: string) => {
    const field = formState[fieldName];
    if (!field) {
      return {
        value: '',
        onChangeText: (value: string) => updateField(fieldName, value, false),
        onBlur: () => validateField(fieldName),
        error: undefined,
      };
    }

    return getFieldProps(
      field,
      (value: string) => updateField(fieldName, value, false),
      () => validateField(fieldName)
    );
  }, [formState, updateField, validateField]);

  const handleSubmit = useCallback(async (onSubmit: (values: Record<string, string>) => Promise<void> | void) => {
    if (isSubmitting) return;

    const isValid = validateAllFields();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const values: Record<string, string> = {};
      Object.entries(formState).forEach(([key, field]) => {
        values[key] = field.value;
      });

      await onSubmit(values);
    } catch (error) {
      // Handle submission error
      console.error('Form submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, isSubmitting, validateAllFields]);

  const isFormValid = useCallback((): boolean => {
    const { isValid } = validateForm(formState);
    return isValid;
  }, [formState]);

  const hasAnyErrors = useCallback((): boolean => {
    return Object.values(formState).some(field => field.touched && field.error);
  }, [formState]);

  const isFormDirty = useCallback((): boolean => {
    return Object.values(formState).some(field => field.touched);
  }, [formState]);

  return {
    formState,
    isSubmitting,
    updateField,
    validateField,
    validateAllFields,
    resetForm,
    setFieldValue,
    setFieldError,
    clearFieldError,
    getFieldValue,
    getFieldError,
    hasFieldError,
    getInputProps,
    handleSubmit,
    isFormValid,
    hasAnyErrors,
    isFormDirty,
  };
};