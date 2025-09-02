/**
 * Bedtime Stories App
 * Main App component with authentication and navigation
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './src/context/AppProvider';
import { 
  RootNavigator, 
  navigationRef, 
  linkingConfig, 
  NavigationListeners 
} from './src/navigation';

function App() {
  return (
    <AppProvider>
      <NavigationContainer
        ref={navigationRef}
        linking={linkingConfig}
        onStateChange={NavigationListeners.onStateChange}
        onReady={NavigationListeners.onReady}
      >
        <RootNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}

export default App;
