// Root navigator that handles authentication flow

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthContext } from '../context/AuthContext';
import { RootStackParamList } from '../types/navigation';
import { 
  SplashScreen, 
  StoryDetailScreen,
  SettingsScreen
} from '../screens';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { screenTransitions, transitionSpecs } from '../utils/animations';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      {/* Always show splash screen first */}
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen}
        options={{
          animation: 'fade',
          animationDuration: 500,
        }}
      />
      
      {isAuthenticated ? (
        // Authenticated user screens
        <>
          <Stack.Screen 
            name="Main" 
            component={MainTabNavigator}
            options={{
              animation: 'fade',
              animationDuration: 400,
            }}
          />
          <Stack.Screen 
            name="StoryDetail" 
            component={StoryDetailScreen}
            options={{
              headerShown: true,
              headerTitle: '',
              headerStyle: {
                backgroundColor: '#f8fafc',
              },
              headerTintColor: '#374151',
              animation: 'slide_from_bottom',
              animationDuration: 350,
              presentation: 'modal',
              gestureEnabled: true,
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              headerShown: true,
              headerTitle: 'Settings',
              headerStyle: {
                backgroundColor: '#f8fafc',
              },
              headerTintColor: '#374151',
              animation: 'slide_from_right',
              animationDuration: 300,
            }}
          />
        </>
      ) : (
        // Authentication screens
        <Stack.Screen 
          name="Auth" 
          component={AuthNavigator}
          options={{
            animation: 'fade',
            animationDuration: 400,
          }}
        />
      )}
    </Stack.Navigator>
  );
};