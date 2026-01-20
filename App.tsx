import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { hasCompletedOnboarding } from './src/utils/onboarding';
import AuthService from './src/services/auth/AuthService';

// Import Screens
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import CategoriesListScreen from './src/screens/CategoriesListScreen';
import SearchScreen from './src/screens/SearchScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import StoryDetailScreen from './src/screens/StoryDetailScreen';
import CategoryStoriesListScreen from './src/screens/CategoryStoriesListScreen';
import AgeGroupScreen from './src/screens/AgeGroupScreen';
import CreateStoryScreen from './src/screens/CreateStoryScreen';

// Import Custom Bottom Tab Bar
import BottomTabBar from './src/components/BottomTabBar';

const Stack = createStackNavigator();

// Main Tab Navigator Component
const MainTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'stories':
        return <CategoriesListScreen />;
      case 'create':
        return <CreateStoryScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };



  return (
    <View style={styles.container}>
      {renderScreen()}
      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
};

// Main App Component
const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Onboarding' | 'Login' | 'MainTabs'>('Onboarding');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    console.log('🚀 App initialization started...');
    
    try {
      // Show splash screen for at least 2 seconds for better UX
      const minSplashTime = new Promise<void>(resolve => setTimeout(() => resolve(), 2000));

      // Step 1: Check if onboarding is completed
      console.log('📋 Step 1: Checking onboarding status...');
      const onboardingCompleted = await hasCompletedOnboarding();
      console.log('📋 Onboarding completed:', onboardingCompleted);

      if (!onboardingCompleted) {
        console.log('➡️ Navigating to Onboarding');
        await minSplashTime;
        setInitialRoute('Onboarding');
        setIsLoading(false);
        return;
      }

      // Step 2: Check if user has a saved token
      console.log('🔐 Step 2: Checking authentication status...');
      const isAuthenticated = await AuthService.isAuthenticated();
      console.log('🔐 Is authenticated:', isAuthenticated);

      if (!isAuthenticated) {
        console.log('➡️ No token found, navigating to Login');
        await minSplashTime;
        setInitialRoute('Login');
        setIsLoading(false);
        return;
      }

      // Step 3: Token exists - validate and fetch user details
      console.log('🔑 Step 3: Token found, validating session...');
      const isValid = await AuthService.validateSession();
      console.log('🔑 Session valid:', isValid);

      if (isValid) {
        // Step 4: Fetch user details from server
        console.log('👤 Step 4: Fetching user details from /user/me...');
        
        try {
          const user = await AuthService.fetchUserDetails();
          console.log('👤 User fetch result:', user ? 'Success' : 'Failed');

          if (user) {
            console.log('✅ User details fetched successfully:', user.name);
            await minSplashTime;
            setInitialRoute('MainTabs');
          } else {
            console.log('⚠️ User fetch returned null, going to login');
            await minSplashTime;
            setInitialRoute('Login');
          }
        } catch (fetchError) {
          console.error('❌ Error fetching user details:', fetchError);
          console.log('➡️ Fetch failed, navigating to Login');
          await minSplashTime;
          setInitialRoute('Login');
        }
      } else {
        // Session expired and couldn't refresh, go to login
        console.log('❌ Session validation failed, navigating to Login');
        await minSplashTime;
        setInitialRoute('Login');
      }
    } catch (error) {
      console.error('💥 Critical error in initializeApp:', error);
      console.log('➡️ Error occurred, defaulting to Login');
      // On error, default to login after minimum splash time
      const minSplashTime = new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
      await minSplashTime;
      setInitialRoute('Login');
    } finally {
      console.log('🏁 App initialization complete, hiding splash screen');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#FAFAF9' },
          }}
          initialRouteName={initialRoute}
        >
          {/* Onboarding & Auth Screens */}
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />

          {/* Main Tab Screen */}
          <Stack.Screen name="MainTabs" component={MainTabs} />

          {/* Detail Screens */}
          <Stack.Screen
            name="AllCategories"
            component={CategoriesListScreen}
          />
          <Stack.Screen
            name="StoryDetail"
            component={StoryDetailScreen}
            options={{
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="Category"
            component={CategoryStoriesListScreen}
          />
          <Stack.Screen
            name="AgeGroup"
            component={AgeGroupScreen}
          />
          <Stack.Screen
            name="CreateStory"
            component={CreateStoryScreen}
            options={{
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
