// Theme utility functions and helpers

import { Theme } from '../types';
import { getColorWithOpacity, getContrastTextColor, getSemanticColors } from '../constants/theme';

// Create theme-aware styles
export const createThemedStyles = (theme: Theme, isDarkMode: boolean) => {
    const backgroundColor = isDarkMode ? theme.colors.neutral[900] : theme.colors.neutral[50];
    const textColor = isDarkMode ? theme.colors.neutral[100] : theme.colors.neutral[900];
    const cardBackground = isDarkMode ? theme.colors.neutral[800] : theme.colors.neutral[100];
    const borderColor = isDarkMode ? theme.colors.neutral[700] : theme.colors.neutral[200];

    return {
        backgroundColor,
        textColor,
        cardBackground,
        borderColor,
        primary: theme.colors.primary[500],
        secondary: theme.colors.secondary[500],
        semantic: getSemanticColors(theme),
    };
};

// Get button styles based on variant and theme
export const getButtonStyles = (
    variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon',
    theme: Theme,
    isDarkMode: boolean
) => {
    const baseStyles = {
        borderRadius: 12,
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[3],
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexDirection: 'row' as const,
    };

    switch (variant) {
        case 'primary':
            return {
                ...baseStyles,
                backgroundColor: theme.colors.primary[500],
                borderWidth: 0,
            };
        case 'secondary':
            return {
                ...baseStyles,
                backgroundColor: theme.colors.secondary[500],
                borderWidth: 0,
            };
        case 'outline':
            return {
                ...baseStyles,
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: theme.colors.primary[500],
            };
        case 'ghost':
            return {
                ...baseStyles,
                backgroundColor: 'transparent',
                borderWidth: 0,
            };
        case 'icon':
            return {
                ...baseStyles,
                backgroundColor: 'transparent',
                borderWidth: 0,
                paddingHorizontal: theme.spacing[2],
                paddingVertical: theme.spacing[2],
                borderRadius: theme.spacing[6],
            };
        default:
            return baseStyles;
    }
};

// Get text styles based on variant and theme
export const getTextStyles = (
    variant: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'button',
    theme: Theme,
    isDarkMode: boolean
) => {
    const textColor = isDarkMode ? theme.colors.neutral[100] : theme.colors.neutral[900];

    const baseStyles = {
        color: textColor,
        fontFamily: theme.typography.fontFamily.regular,
    };

    switch (variant) {
        case 'h1':
            return {
                ...baseStyles,
                fontSize: theme.typography.fontSize['4xl'],
                fontFamily: theme.typography.fontFamily.bold,
                lineHeight: theme.typography.fontSize['4xl'] * theme.typography.lineHeight.tight,
            };
        case 'h2':
            return {
                ...baseStyles,
                fontSize: theme.typography.fontSize['3xl'],
                fontFamily: theme.typography.fontFamily.bold,
                lineHeight: theme.typography.fontSize['3xl'] * theme.typography.lineHeight.tight,
            };
        case 'h3':
            return {
                ...baseStyles,
                fontSize: theme.typography.fontSize['2xl'],
                fontFamily: theme.typography.fontFamily.medium,
                lineHeight: theme.typography.fontSize['2xl'] * theme.typography.lineHeight.normal,
            };
        case 'h4':
            return {
                ...baseStyles,
                fontSize: theme.typography.fontSize.xl,
                fontFamily: theme.typography.fontFamily.medium,
                lineHeight: theme.typography.fontSize.xl * theme.typography.lineHeight.normal,
            };
        case 'body':
            return {
                ...baseStyles,
                fontSize: theme.typography.fontSize.base,
                lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
            };
        case 'caption':
            return {
                ...baseStyles,
                fontSize: theme.typography.fontSize.sm,
                color: isDarkMode ? theme.colors.neutral[400] : theme.colors.neutral[600],
                lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
            };
        case 'button':
            return {
                ...baseStyles,
                fontSize: theme.typography.fontSize.base,
                fontFamily: theme.typography.fontFamily.medium,
                lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.tight,
            };
        default:
            return baseStyles;
    }
};

// Get card styles based on variant and theme
export const getCardStyles = (
    variant: 'horizontal' | 'grid' | 'featured' | 'compact',
    theme: Theme,
    isDarkMode: boolean,
    shadow: boolean = true
) => {
    const backgroundColor = isDarkMode ? theme.colors.neutral[800] : theme.colors.neutral[100];
    const borderColor = isDarkMode ? theme.colors.neutral[700] : theme.colors.neutral[200];

    const baseStyles = {
        backgroundColor,
        borderRadius: 16,
        borderWidth: 1,
        borderColor,
        overflow: 'hidden' as const,
    };

    const shadowStyles = shadow ? {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    } : {};

    switch (variant) {
        case 'horizontal':
            return {
                ...baseStyles,
                ...shadowStyles,
                flexDirection: 'row' as const,
                padding: theme.spacing[4],
                marginVertical: theme.spacing[2],
            };
        case 'grid':
            return {
                ...baseStyles,
                ...shadowStyles,
                padding: theme.spacing[3],
                margin: theme.spacing[2],
                flex: 1,
            };
        case 'featured':
            return {
                ...baseStyles,
                ...shadowStyles,
                padding: theme.spacing[5],
                marginVertical: theme.spacing[3],
                borderRadius: 20,
            };
        case 'compact':
            return {
                ...baseStyles,
                ...shadowStyles,
                padding: theme.spacing[2],
                marginVertical: theme.spacing[1],
                borderRadius: 12,
            };
        default:
            return baseStyles;
    }
};

// Get input styles based on state and theme
export const getInputStyles = (
    hasError: boolean,
    isFocused: boolean,
    theme: Theme,
    isDarkMode: boolean
) => {
    const backgroundColor = isDarkMode ? theme.colors.neutral[800] : theme.colors.neutral[100];
    const textColor = isDarkMode ? theme.colors.neutral[100] : theme.colors.neutral[900];
    const placeholderColor = isDarkMode ? theme.colors.neutral[500] : theme.colors.neutral[400];

    let borderColor = isDarkMode ? theme.colors.neutral[600] : theme.colors.neutral[300];

    if (hasError) {
        borderColor = theme.colors.error;
    } else if (isFocused) {
        borderColor = theme.colors.primary[500];
    }

    return {
        backgroundColor,
        color: textColor,
        borderColor,
        placeholderTextColor: placeholderColor,
        borderWidth: 2,
        borderRadius: 12,
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[3],
        fontSize: theme.typography.fontSize.base,
        fontFamily: theme.typography.fontFamily.regular,
    };
};

export {
    getColorWithOpacity,
    getContrastTextColor,
    getSemanticColors,
};