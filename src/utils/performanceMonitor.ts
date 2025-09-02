import { InteractionManager } from 'react-native';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private listeners: Set<(metric: PerformanceMetric) => void> = new Set();

  /**
   * Start measuring a performance metric
   */
  startMeasure(name: string, metadata?: Record<string, any>): void {
    const startTime = performance.now();
    this.metrics.set(name, {
      name,
      startTime,
      metadata,
    });
  }

  /**
   * End measuring a performance metric
   */
  endMeasure(name: string): PerformanceMetric | null {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric "${name}" was not started`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    const completedMetric: PerformanceMetric = {
      ...metric,
      endTime,
      duration,
    };

    this.metrics.set(name, completedMetric);
    this.notifyListeners(completedMetric);

    return completedMetric;
  }

  /**
   * Measure a function execution time
   */
  measureFunction<T>(name: string, fn: () => T, metadata?: Record<string, any>): T {
    this.startMeasure(name, metadata);
    try {
      const result = fn();
      this.endMeasure(name);
      return result;
    } catch (error) {
      this.endMeasure(name);
      throw error;
    }
  }

  /**
   * Measure an async function execution time
   */
  async measureAsyncFunction<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.startMeasure(name, metadata);
    try {
      const result = await fn();
      this.endMeasure(name);
      return result;
    } catch (error) {
      this.endMeasure(name);
      throw error;
    }
  }

  /**
   * Measure time to interactive (when all interactions are complete)
   */
  measureTimeToInteractive(name: string, callback?: () => void): void {
    this.startMeasure(name);
    
    InteractionManager.runAfterInteractions(() => {
      this.endMeasure(name);
      callback?.();
    });
  }

  /**
   * Get a specific metric
   */
  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get metrics by pattern
   */
  getMetricsByPattern(pattern: RegExp): PerformanceMetric[] {
    return Array.from(this.metrics.values()).filter(metric =>
      pattern.test(metric.name)
    );
  }

  /**
   * Clear a specific metric
   */
  clearMetric(name: string): void {
    this.metrics.delete(name);
  }

  /**
   * Clear all metrics
   */
  clearAllMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Add a listener for completed metrics
   */
  addListener(listener: (metric: PerformanceMetric) => void): void {
    this.listeners.add(listener);
  }

  /**
   * Remove a listener
   */
  removeListener(listener: (metric: PerformanceMetric) => void): void {
    this.listeners.delete(listener);
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    totalMetrics: number;
    averageDuration: number;
    slowestMetric: PerformanceMetric | null;
    fastestMetric: PerformanceMetric | null;
  } {
    const completedMetrics = Array.from(this.metrics.values()).filter(
      metric => metric.duration !== undefined
    );

    if (completedMetrics.length === 0) {
      return {
        totalMetrics: 0,
        averageDuration: 0,
        slowestMetric: null,
        fastestMetric: null,
      };
    }

    const durations = completedMetrics.map(metric => metric.duration!);
    const averageDuration = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
    
    const slowestMetric = completedMetrics.reduce((slowest, current) =>
      (current.duration! > slowest.duration!) ? current : slowest
    );
    
    const fastestMetric = completedMetrics.reduce((fastest, current) =>
      (current.duration! < fastest.duration!) ? current : fastest
    );

    return {
      totalMetrics: completedMetrics.length,
      averageDuration,
      slowestMetric,
      fastestMetric,
    };
  }

  /**
   * Log performance summary to console
   */
  logSummary(): void {
    const summary = this.getSummary();
    console.group('Performance Summary');
    console.log(`Total Metrics: ${summary.totalMetrics}`);
    console.log(`Average Duration: ${summary.averageDuration.toFixed(2)}ms`);
    
    if (summary.slowestMetric) {
      console.log(`Slowest: ${summary.slowestMetric.name} (${summary.slowestMetric.duration!.toFixed(2)}ms)`);
    }
    
    if (summary.fastestMetric) {
      console.log(`Fastest: ${summary.fastestMetric.name} (${summary.fastestMetric.duration!.toFixed(2)}ms)`);
    }
    
    console.groupEnd();
  }

  private notifyListeners(metric: PerformanceMetric): void {
    this.listeners.forEach(listener => {
      try {
        listener(metric);
      } catch (error) {
        console.error('Error in performance metric listener:', error);
      }
    });
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Hook for component-level performance monitoring
 */
export const usePerformanceMonitor = () => {
  const startMeasure = (name: string, metadata?: Record<string, any>) => {
    performanceMonitor.startMeasure(name, metadata);
  };

  const endMeasure = (name: string) => {
    return performanceMonitor.endMeasure(name);
  };

  const measureFunction = <T>(name: string, fn: () => T, metadata?: Record<string, any>) => {
    return performanceMonitor.measureFunction(name, fn, metadata);
  };

  const measureAsyncFunction = <T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ) => {
    return performanceMonitor.measureAsyncFunction(name, fn, metadata);
  };

  return {
    startMeasure,
    endMeasure,
    measureFunction,
    measureAsyncFunction,
    getMetric: (name: string) => performanceMonitor.getMetric(name),
    getSummary: () => performanceMonitor.getSummary(),
    logSummary: () => performanceMonitor.logSummary(),
  };
};