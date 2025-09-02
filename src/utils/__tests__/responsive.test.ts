// Tests for responsive utilities and layout system

import { Dimensions } from 'react-native';
import {
  getScreenSize,
  isTablet,
  getResponsiveValue,
  getSafePadding,
  getGridColumns,
  getLayoutConfig,
  getResponsiveEdgeInsets,
  createAdaptiveStyles,
} from '../responsive';

// Mock Dimensions
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(),
  },
  PixelRatio: {
    roundToNearestPixel: jest.fn((size) => Math.round(size)),
    getFontScale: jest.fn(() => 1),
  },
}));

const mockDimensions = Dimensions.get as jest.MockedFunction<typeof Dimensions.get>;

describe('Responsive Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getScreenSize', () => {
    it('should return sm for small screens', () => {
      mockDimensions.mockReturnValue({ width: 400, height: 800, scale: 1, fontScale: 1 });
      expect(getScreenSize()).toBe('sm');
    });

    it('should return md for medium screens', () => {
      mockDimensions.mockReturnValue({ width: 800, height: 1000, scale: 1, fontScale: 1 });
      expect(getScreenSize()).toBe('md');
    });

    it('should return lg for large screens', () => {
      mockDimensions.mockReturnValue({ width: 1100, height: 1200, scale: 1, fontScale: 1 });
      expect(getScreenSize()).toBe('lg');
    });

    it('should return xl for extra large screens', () => {
      mockDimensions.mockReturnValue({ width: 1400, height: 1800, scale: 1, fontScale: 1 });
      expect(getScreenSize()).toBe('xl');
    });
  });

  describe('isTablet', () => {
    it('should return true for tablet-sized screens', () => {
      mockDimensions.mockReturnValue({ width: 800, height: 1200, scale: 1, fontScale: 1 });
      expect(isTablet()).toBe(true);
    });

    it('should return false for phone-sized screens', () => {
      mockDimensions.mockReturnValue({ width: 400, height: 800, scale: 1, fontScale: 1 });
      expect(isTablet()).toBe(false);
    });

    it('should return true for landscape tablets', () => {
      mockDimensions.mockReturnValue({ width: 1200, height: 800, scale: 1, fontScale: 1 });
      expect(isTablet()).toBe(true);
    });
  });

  describe('getResponsiveValue', () => {
    beforeEach(() => {
      mockDimensions.mockReturnValue({ width: 800, height: 1000, scale: 1, fontScale: 1 });
    });

    it('should return simple values as-is', () => {
      expect(getResponsiveValue(16)).toBe(16);
      expect(getResponsiveValue('test')).toBe('test');
    });

    it('should return appropriate responsive value for current screen size', () => {
      const responsiveValue = {
        sm: 12,
        md: 16,
        lg: 20,
        xl: 24,
      };
      expect(getResponsiveValue(responsiveValue)).toBe(16); // md screen
    });

    it('should fallback to smaller screen sizes if current size not available', () => {
      const responsiveValue = {
        sm: 12,
        lg: 20,
      };
      expect(getResponsiveValue(responsiveValue)).toBe(20); // fallback to lg (next available)
    });
  });

  describe('getSafePadding', () => {
    it('should return appropriate padding for different screen sizes', () => {
      mockDimensions.mockReturnValue({ width: 400, height: 800, scale: 1, fontScale: 1 });
      expect(getSafePadding()).toBe(16); // sm

      mockDimensions.mockReturnValue({ width: 800, height: 1000, scale: 1, fontScale: 1 });
      expect(getSafePadding()).toBe(20); // md

      mockDimensions.mockReturnValue({ width: 1100, height: 1200, scale: 1, fontScale: 1 });
      expect(getSafePadding()).toBe(24); // lg

      mockDimensions.mockReturnValue({ width: 1400, height: 1800, scale: 1, fontScale: 1 });
      expect(getSafePadding()).toBe(32); // xl
    });
  });

  describe('getGridColumns', () => {
    beforeEach(() => {
      mockDimensions.mockReturnValue({ width: 800, height: 1200, scale: 1, fontScale: 1 });
    });

    it('should calculate appropriate number of columns', () => {
      const columns = getGridColumns(150, 16);
      expect(columns).toBeGreaterThan(0);
      expect(columns).toBeLessThanOrEqual(5); // reasonable maximum
    });

    it('should return at least 1 column', () => {
      const columns = getGridColumns(1000, 16); // Very wide items
      expect(columns).toBe(1);
    });
  });

  describe('getLayoutConfig', () => {
    it('should return appropriate config for phone screens', () => {
      mockDimensions.mockReturnValue({ width: 400, height: 800, scale: 1, fontScale: 1 });
      const config = getLayoutConfig();
      
      expect(config.useCompactLayout).toBe(true);
      expect(config.showSidebar).toBe(false);
      expect(config.useBottomTabs).toBe(true);
      expect(config.storyCardWidth).toBe(140);
    });

    it('should return appropriate config for tablet screens', () => {
      mockDimensions.mockReturnValue({ width: 1200, height: 800, scale: 1, fontScale: 1 }); // landscape tablet
      const config = getLayoutConfig();
      
      expect(config.useCompactLayout).toBe(false);
      expect(config.showSidebar).toBe(true);
      expect(config.useBottomTabs).toBe(false);
      expect(config.storyCardWidth).toBe(200);
    });
  });

  describe('getResponsiveEdgeInsets', () => {
    it('should return appropriate edge insets for different screen sizes', () => {
      mockDimensions.mockReturnValue({ width: 400, height: 800, scale: 1, fontScale: 1 });
      const insets = getResponsiveEdgeInsets();
      
      expect(insets.horizontal).toBe(16);
      expect(insets.vertical).toBe(12);
      expect(insets.small).toBe(8);
      expect(insets.large).toBe(24);
    });

    it('should return larger insets for tablets', () => {
      mockDimensions.mockReturnValue({ width: 1000, height: 1200, scale: 1, fontScale: 1 });
      const insets = getResponsiveEdgeInsets();
      
      expect(insets.section).toBeGreaterThan(24); // tablet multiplier applied
    });
  });

  describe('createAdaptiveStyles', () => {
    beforeEach(() => {
      mockDimensions.mockReturnValue({ width: 800, height: 1000, scale: 1, fontScale: 1 });
    });

    it('should create adaptive styles with appropriate values', () => {
      const styles = createAdaptiveStyles();
      
      expect(styles.container).toHaveProperty('paddingHorizontal');
      expect(styles.container).toHaveProperty('paddingVertical');
      expect(styles.container).toHaveProperty('maxWidth');
      
      expect(styles.button).toHaveProperty('height');
      expect(styles.button).toHaveProperty('borderRadius');
      expect(styles.button).toHaveProperty('minWidth');
      
      expect(styles.heading).toHaveProperty('fontSize');
      expect(styles.body).toHaveProperty('fontSize');
      expect(styles.body).toHaveProperty('lineHeight');
    });

    it('should have consistent touch target sizes', () => {
      const styles = createAdaptiveStyles();
      
      expect(styles.button.minWidth).toBeGreaterThanOrEqual(44); // iOS minimum
      expect(styles.button.height).toBeGreaterThanOrEqual(44);
    });
  });
});

describe('Child-friendly Touch Interactions', () => {
  it('should provide appropriate touch target sizes', () => {
    mockDimensions.mockReturnValue({ width: 400, height: 800, scale: 1, fontScale: 1 });
    const config = getLayoutConfig();
    
    expect(config.minTouchTarget).toBe(44);
    expect(config.buttonHeight).toBeGreaterThanOrEqual(44);
  });

  it('should provide larger touch targets for tablets', () => {
    mockDimensions.mockReturnValue({ width: 1000, height: 1200, scale: 1, fontScale: 1 });
    const config = getLayoutConfig();
    
    expect(config.buttonHeight).toBeGreaterThan(44);
    expect(config.iconSize).toBeGreaterThan(20);
  });
});