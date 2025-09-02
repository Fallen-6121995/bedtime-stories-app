// Production configuration

export const productionConfig = {
  // API Configuration
  apiUrl: 'https://api.bedtimestories.com',
  enableApiLogging: false,
  apiTimeout: 15000,
  
  // Debug Settings
  enableReduxLogger: false,
  enableFlipperIntegration: false,
  showPerformanceMonitor: false,
  
  // Feature Flags
  enableOfflineMode: true,
  enablePushNotifications: true,
  enableAnalytics: true,
  enableCrashReporting: true,
  
  // Storage
  clearStorageOnStart: false,
  enableStorageEncryption: true,
  
  // Authentication
  enableBiometricAuth: true,
  sessionTimeout: 60 * 60 * 1000, // 60 minutes
  
  // UI/UX
  enableAnimations: true,
  enableHapticFeedback: true,
  showDebugInfo: false,
  
  // Story Generation
  enableAIStoryGeneration: true,
  maxStoryLength: 10000,
  
  // Demo Data
  createDemoUser: false,
  loadSampleStories: false,
} as const;