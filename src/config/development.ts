// Development configuration

export const developmentConfig = {
  // API Configuration
  apiUrl: 'http://localhost:3000/api',
  enableApiLogging: true,
  apiTimeout: 10000,
  
  // Debug Settings
  enableReduxLogger: true,
  enableFlipperIntegration: true,
  showPerformanceMonitor: true,
  
  // Feature Flags
  enableOfflineMode: true,
  enablePushNotifications: false,
  enableAnalytics: false,
  enableCrashReporting: false,
  
  // Storage
  clearStorageOnStart: false,
  enableStorageEncryption: false,
  
  // Authentication
  enableBiometricAuth: false,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  
  // UI/UX
  enableAnimations: true,
  enableHapticFeedback: true,
  showDebugInfo: true,
  
  // Story Generation
  enableAIStoryGeneration: true,
  maxStoryLength: 10000,
  
  // Demo Data
  createDemoUser: true,
  loadSampleStories: true,
} as const;