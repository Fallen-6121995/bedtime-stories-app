import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { THEME } from '../theme/appTheme';

interface TabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const tabs = [
  // Fixed: Added '-outline' to ensure inactive state looks correct
  { id: 'home', icon: 'home', iconOutline: 'home-outline' }, 
  { id: 'stories', icon: 'book', iconOutline: 'book-outline' },
  // Center Tab (Dynamic)
  { id: 'create', icon: 'sparkles', iconOutline: 'sparkles-outline', isCenter: true }, 
  { id: 'favorites', icon: 'heart', iconOutline: 'heart-outline' },
  { id: 'profile', icon: 'person', iconOutline: 'person-outline' },
];

const BottomTabBar: React.FC<TabBarProps> = ({ activeTab, onTabPress }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Split tabs logic
  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(3, 5);
  const centerTab = tabs[2];

  // Helper to render side tabs to avoid code duplication
  const renderSideTab = (tab: typeof tabs[0]) => {
    const isActive = activeTab === tab.id;
    return (
      <TouchableOpacity
        key={tab.id}
        style={styles.tabButton}
        onPress={() => onTabPress(tab.id)}
        activeOpacity={0.7}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
          <Icon
            name={isActive ? tab.icon : tab.iconOutline}
            size={26}
            color={isActive ? THEME.colors.primary : THEME.colors.textLight}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 24 }]}>
      
      {/* --- Floating Center Button (The "Magic" Button) --- */}
      {/* Position calculation ensures it stays perfectly centered */}
      <View style={[styles.centerButtonContainer, { left: (width / 2) - 36 }]}>
        <TouchableOpacity
          onPress={() => onTabPress(centerTab.id)}
          activeOpacity={0.9}
          style={styles.centerButtonWrapper}
        >
          <LinearGradient
            colors={THEME.gradients.primary}
            style={styles.centerButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* FIXED: Now uses the icon from the config array instead of hardcoded 'search' */}
            <Icon name={centerTab.icon} size={32} color={THEME.colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* --- Floating Island Bar --- */}
      <View style={styles.islandContainer}>
        {/* Left Group */}
        <View style={styles.sideGroup}>
          {leftTabs.map(renderSideTab)}
        </View>

        {/* Center Spacer (Keeps gap for the button) */}
        <View style={styles.centerSpacer} />

        {/* Right Group */}
        <View style={styles.sideGroup}>
          {rightTabs.map(renderSideTab)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    pointerEvents: 'box-none', // Allows touches to pass through empty areas
  },
  
  // Center Button
  centerButtonContainer: {
    position: 'absolute',
    top: -30, 
    zIndex: 10,
    elevation: 10,
  },
  centerButtonWrapper: {
    ...THEME.shadows.glow(THEME.colors.primary),
  },
  centerButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: THEME.colors.background, // Matches screen bg to create "cutout" effect
  },

  // Island Bar
  islandContainer: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: THEME.colors.white,
    borderRadius: 35,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    // Premium Shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },

  sideGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    alignItems: 'center',
  },
  centerSpacer: {
    width: 70, 
  },

  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
  },
  
  iconContainer: {
    width: 44, 
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  
  activeIconContainer: {
    backgroundColor: THEME.colors.primary + '15', 
    borderRadius: 100,
    transform: [{ scale: 1.05 }], 
  },
});

export default BottomTabBar;