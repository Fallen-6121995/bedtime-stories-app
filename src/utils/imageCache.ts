import { Image, ImageSourcePropType } from 'react-native';

interface CacheEntry {
  uri: string;
  timestamp: number;
  size?: number;
}

class ImageCacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private maxCacheSize = 50; // Maximum number of cached images
  private maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  /**
   * Preload an image and add it to cache
   */
  async preloadImage(source: ImageSourcePropType): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof source === 'object' && 'uri' in source && source.uri) {
        const uri = source.uri;
        
        // Check if already cached and not expired
        if (this.isCached(uri)) {
          resolve(true);
          return;
        }

        Image.prefetch(uri)
          .then(() => {
            this.addToCache(uri);
            resolve(true);
          })
          .catch(() => {
            resolve(false);
          });
      } else {
        // Local images don't need caching
        resolve(true);
      }
    });
  }

  /**
   * Preload multiple images
   */
  async preloadImages(sources: ImageSourcePropType[]): Promise<boolean[]> {
    const promises = sources.map(source => this.preloadImage(source));
    return Promise.all(promises);
  }

  /**
   * Check if an image is cached and not expired
   */
  isCached(uri: string): boolean {
    const entry = this.cache.get(uri);
    if (!entry) return false;

    const now = Date.now();
    const isExpired = now - entry.timestamp > this.maxAge;
    
    if (isExpired) {
      this.cache.delete(uri);
      return false;
    }

    return true;
  }

  /**
   * Add an image to cache
   */
  private addToCache(uri: string): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      this.cleanupOldEntries();
    }

    this.cache.set(uri, {
      uri,
      timestamp: Date.now(),
    });
  }

  /**
   * Remove expired and oldest entries
   */
  private cleanupOldEntries(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());

    // Remove expired entries
    entries.forEach(([uri, entry]) => {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(uri);
      }
    });

    // If still over limit, remove oldest entries
    if (this.cache.size >= this.maxCacheSize) {
      const sortedEntries = entries
        .filter(([uri]) => this.cache.has(uri)) // Only include non-expired entries
        .sort((a, b) => a[1].timestamp - b[1].timestamp);

      const entriesToRemove = sortedEntries.slice(0, this.cache.size - this.maxCacheSize + 1);
      entriesToRemove.forEach(([uri]) => {
        this.cache.delete(uri);
      });
    }
  }

  /**
   * Clear all cached images
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; maxSize: number; entries: string[] } {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      entries: Array.from(this.cache.keys()),
    };
  }

  /**
   * Set maximum cache size
   */
  setMaxCacheSize(size: number): void {
    this.maxCacheSize = size;
    if (this.cache.size > size) {
      this.cleanupOldEntries();
    }
  }
}

// Export singleton instance
export const imageCache = new ImageCacheManager();

/**
 * Hook for preloading images in components
 */
export const useImagePreloader = () => {
  const preloadImage = (source: ImageSourcePropType) => {
    return imageCache.preloadImage(source);
  };

  const preloadImages = (sources: ImageSourcePropType[]) => {
    return imageCache.preloadImages(sources);
  };

  return {
    preloadImage,
    preloadImages,
    getCacheStats: () => imageCache.getCacheStats(),
    clearCache: () => imageCache.clearCache(),
  };
};