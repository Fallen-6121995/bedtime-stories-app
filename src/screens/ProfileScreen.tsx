import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect, CommonActions } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import AuthService from '../services/auth/AuthService';
import type { User } from '../services/types/auth.types';
import { THEME } from '../theme/appTheme';

type RootStackParamList = {
  Login: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Responsive Layout Logic
  const isTablet = width > 600;
  const contentMaxWidth = isTablet ? 500 : '100%';

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      setLoading(true);
      const guestStatus = await AuthService.isGuest();
      setIsGuest(guestStatus);
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive', 
          onPress: () => {
            // 1. OPTIMISTIC UPDATE: Navigate to Login IMMEDIATELY
            // This makes the app feel instant to the user.
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            );

            // 2. BACKGROUND CLEANUP
            // We trigger this but do NOT await it. It runs while the user is already on the login screen.
            AuthService.logout().catch(error => {
               // Even if the server call fails, the user is locally logged out
               console.log("Background logout error (non-blocking):", error);
            });
          } 
        },
      ]
    );
  };

  const userName = user?.name || (isGuest ? 'Guest Explorer' : 'Friend');
  const userEmail = user?.email || (isGuest ? 'Sign up to save progress' : '');

  // Mock Stats (Gamification)
  const stats = [
    { label: 'Stories Read', value: '12', icon: 'book-outline' },
    { label: 'Favorites', value: '5', icon: 'heart-outline' },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background Decoration */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { alignItems: 'center' } 
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: contentMaxWidth }}>
            
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>My Profile</Text>
            </View>

            {/* PROFILE CARD */}
            <View style={styles.profileSection}>
              <LinearGradient
                colors={THEME.gradients.primary}
                style={styles.avatarRing}
              >
                <View style={styles.avatarContainer}>
                  {user?.photoURL ? (
                    <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
                  ) : (
                    <Icon name="person" size={48} color={THEME.colors.primary} />
                  )}
                </View>
              </LinearGradient>

              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userEmail}>{userEmail}</Text>

              {isGuest && (
                <View style={styles.guestBadge}>
                  <Text style={styles.guestBadgeText}>Guest Mode</Text>
                </View>
              )}
            </View>

            {/* STATS ROW */}
            <View style={styles.statsRow}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: THEME.colors.primary + '10' }]}>
                    <Icon name={stat.icon} size={20} color={THEME.colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* MENU ACTIONS */}
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => Alert.alert("About", "StoryTime App v1.0.0\nMade with ❤️ for kids.")}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconBox, { backgroundColor: THEME.colors.secondary + '15' }]}>
                  <Icon name="information" size={22} color={THEME.colors.secondary} />
                </View>
                <Text style={styles.menuText}>About the App</Text>
                <Icon name="chevron-forward" size={20} color={THEME.colors.textLight} />
              </TouchableOpacity>
            </View>

            {/* LOGOUT BUTTON */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Icon name="log-out-outline" size={20} color={THEME.colors.rose} />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },

  // Background Decoration
  bgCircle1: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: THEME.colors.primary + '08',
  },
  bgCircle2: {
    position: 'absolute',
    top: 100,
    left: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: THEME.colors.secondary + '08',
  },

  // Header
  header: {
    marginTop: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: THEME.fonts.heading,
    color: THEME.colors.textDark,
    fontWeight: '800',
  },

  // Profile Section
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...THEME.shadows.glow(THEME.colors.primary),
  },
  avatarContainer: {
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: THEME.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 24,
    fontFamily: THEME.fonts.heading,
    fontWeight: '800',
    color: THEME.colors.textDark,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: THEME.fonts.medium,
    color: THEME.colors.textMedium,
  },
  guestBadge: {
    marginTop: 8,
    backgroundColor: THEME.colors.accent + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  guestBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.accent,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 16,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.white,
    padding: 16,
    borderRadius: THEME.borderRadius.xl,
    gap: 12,
    ...THEME.shadows.soft,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textDark,
    fontFamily: THEME.fonts.heading,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.colors.textMedium,
    fontFamily: THEME.fonts.medium,
  },

  // Menu Section
  menuContainer: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.borderRadius.xl,
    padding: 8,
    marginBottom: 24,
    ...THEME.shadows.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: THEME.colors.textDark,
    fontFamily: THEME.fonts.medium,
    fontWeight: '600',
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.rose + '10',
    paddingVertical: 16,
    borderRadius: THEME.borderRadius.xl,
    gap: 8,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.rose,
    fontFamily: THEME.fonts.medium,
  },
  versionText: {
    textAlign: 'center',
    color: THEME.colors.textLight,
    fontSize: 12,
  },
});

export default ProfileScreen;