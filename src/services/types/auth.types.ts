// Authentication Types

export interface User {
  id: string;
  email?: string;
  name?: string;
  mobileNumber?: string;
  isGuest: boolean;
  deviceId?: string;
  upgradedFromGuest?: boolean;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark';
  notifications?: boolean;
  autoPlay?: boolean;
  downloadOnWifi?: boolean;
  audioQuality?: 'low' | 'medium' | 'high';
  fontSize?: 'small' | 'medium' | 'large' | 'xlarge';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  mobileNumber?: string;
  deviceId?: string;
}

export interface GuestRegistration {
  deviceId: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken?: string;
}

export interface ApiError {
  message: string;
  errors?: string[];
  statusCode?: number;
}
