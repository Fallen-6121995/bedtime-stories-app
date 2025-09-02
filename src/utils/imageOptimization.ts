import { Dimensions, PixelRatio } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const pixelRatio = PixelRatio.get();

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface OptimizedImageParams {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Calculate optimal image dimensions based on display size and pixel ratio
 */
export const calculateOptimalDimensions = (
  displayWidth: number,
  displayHeight: number,
  maxWidth?: number,
  maxHeight?: number
): ImageDimensions => {
  // Account for pixel ratio but cap at 2x to avoid excessive memory usage
  const effectivePixelRatio = Math.min(pixelRatio, 2);
  
  let optimalWidth = displayWidth * effectivePixelRatio;
  let optimalHeight = displayHeight * effectivePixelRatio;

  // Apply maximum constraints if provided
  if (maxWidth && optimalWidth > maxWidth) {
    const ratio = maxWidth / optimalWidth;
    optimalWidth = maxWidth;
    optimalHeight = optimalHeight * ratio;
  }

  if (maxHeight && optimalHeight > maxHeight) {
    const ratio = maxHeight / optimalHeight;
    optimalHeight = maxHeight;
    optimalWidth = optimalWidth * ratio;
  }

  return {
    width: Math.round(optimalWidth),
    height: Math.round(optimalHeight),
  };
};

/**
 * Generate optimized image URL for CDN services (like Cloudinary, ImageKit, etc.)
 */
export const generateOptimizedImageUrl = (
  originalUrl: string,
  params: OptimizedImageParams,
  cdnType: 'cloudinary' | 'imagekit' | 'generic' = 'generic'
): string => {
  if (!originalUrl.startsWith('http')) {
    return originalUrl; // Local images don't need optimization
  }

  const { width, height, quality = 80, format = 'webp' } = params;

  switch (cdnType) {
    case 'cloudinary':
      // Cloudinary URL transformation
      const cloudinaryParams = [];
      if (width) cloudinaryParams.push(`w_${width}`);
      if (height) cloudinaryParams.push(`h_${height}`);
      cloudinaryParams.push(`q_${quality}`);
      cloudinaryParams.push(`f_${format}`);
      cloudinaryParams.push('c_fill'); // Crop to fill dimensions
      
      return originalUrl.replace(
        '/upload/',
        `/upload/${cloudinaryParams.join(',')}/`
      );

    case 'imagekit':
      // ImageKit URL transformation
      const imagekitParams = new URLSearchParams();
      if (width) imagekitParams.set('tr', `w-${width}`);
      if (height) imagekitParams.append('tr', `h-${height}`);
      imagekitParams.append('tr', `q-${quality}`);
      imagekitParams.append('tr', `f-${format}`);
      
      return `${originalUrl}?${imagekitParams.toString()}`;

    case 'generic':
    default:
      // Generic query parameters (works with many CDNs)
      const genericParams = new URLSearchParams();
      if (width) genericParams.set('w', width.toString());
      if (height) genericParams.set('h', height.toString());
      genericParams.set('q', quality.toString());
      genericParams.set('f', format);
      
      const separator = originalUrl.includes('?') ? '&' : '?';
      return `${originalUrl}${separator}${genericParams.toString()}`;
  }
};

/**
 * Get appropriate image size based on usage context
 */
export const getImageSizeForContext = (
  context: 'thumbnail' | 'card' | 'hero' | 'fullscreen'
): ImageDimensions => {
  switch (context) {
    case 'thumbnail':
      return calculateOptimalDimensions(80, 80, 160, 160);
    
    case 'card':
      return calculateOptimalDimensions(200, 150, 400, 300);
    
    case 'hero':
      return calculateOptimalDimensions(screenWidth, 250, screenWidth * 2, 500);
    
    case 'fullscreen':
      return calculateOptimalDimensions(screenWidth, screenHeight, screenWidth * 2, screenHeight * 2);
    
    default:
      return calculateOptimalDimensions(200, 200, 400, 400);
  }
};

/**
 * Generate multiple image sizes for responsive images
 */
export const generateResponsiveImageSizes = (
  originalUrl: string,
  contexts: Array<'thumbnail' | 'card' | 'hero' | 'fullscreen'> = ['thumbnail', 'card', 'hero']
): Record<string, string> => {
  const sizes: Record<string, string> = {};

  contexts.forEach(context => {
    const dimensions = getImageSizeForContext(context);
    sizes[context] = generateOptimizedImageUrl(originalUrl, {
      width: dimensions.width,
      height: dimensions.height,
      quality: context === 'thumbnail' ? 70 : 80,
      format: 'webp',
    });
  });

  return sizes;
};

/**
 * Preload critical images for better perceived performance
 */
export const preloadCriticalImages = async (imageUrls: string[]): Promise<void> => {
  const { Image } = require('react-native');
  
  const preloadPromises = imageUrls.map(url => {
    return new Promise<void>((resolve) => {
      Image.prefetch(url)
        .then(() => resolve())
        .catch(() => resolve()); // Don't fail if one image fails
    });
  });

  await Promise.all(preloadPromises);
};

/**
 * Calculate memory usage for an image
 */
export const calculateImageMemoryUsage = (
  width: number,
  height: number,
  bytesPerPixel: number = 4 // RGBA
): number => {
  return width * height * bytesPerPixel;
};

/**
 * Check if image dimensions are reasonable for mobile
 */
export const validateImageDimensions = (
  width: number,
  height: number,
  maxMemoryMB: number = 50
): boolean => {
  const memoryUsage = calculateImageMemoryUsage(width, height);
  const memoryUsageMB = memoryUsage / (1024 * 1024);
  
  return memoryUsageMB <= maxMemoryMB;
};