import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../theme/appTheme';

// Expanded Categories
const CATEGORIES = [
  { id: 'adventure', label: 'Adventure', icon: 'map-outline', color: '#F97316' }, 
  { id: 'fantasy', label: 'Fantasy', icon: 'sparkles-outline', color: '#8B5CF6' }, 
  { id: 'animals', label: 'Animals', icon: 'paw-outline', color: '#10B981' }, 
  { id: 'space', label: 'Space', icon: 'rocket-outline', color: '#3B82F6' }, 
  { id: 'princess', label: 'Royal', icon: 'rose-outline', color: '#EC4899' }, 
  { id: 'funny', label: 'Funny', icon: 'happy-outline', color: '#F59E0B' }, 
  { id: 'bedtime', label: 'Bedtime', icon: 'moon-outline', color: '#6366F1' },
  { id: 'history', label: 'History', icon: 'hourglass-outline', color: '#92400E' },
];

const CreateStoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isTablet = width > 600;
  const contentWidth = isTablet ? 550 : '100%';

  const handleGenerate = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please give your story a name!');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Missing Theme', 'Please pick a world for your story.');
      return;
    }

    setLoading(true);
    
    // Simulate AI Call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('✨ Magic Complete!', `Your story "${title}" is ready.`);
    }, 2500);
  };

  return (
    <View style={[styles.container, { backgroundColor: THEME.colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} // 'height' can cause issues on Android with scrollviews
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            
            {/* --- TOP NAVIGATION --- */}
            <View style={[styles.navBar, { width: contentWidth, alignSelf: 'center' }]}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                >
                  <Icon name="chevron-back" size={24} color={THEME.colors.textDark} />
                </TouchableOpacity>
            </View>

            <View style={{ width: contentWidth, alignSelf: 'center' }}>
              
              {/* --- HEADER --- */}
              <View style={styles.header}>
                {/* DESIGN TRICK: Overlapping Badge 
                   The zIndex ensures it sits ON TOP of the card
                   The marginBottom pull it down INTO the card
                */}
                <View style={styles.iconRing}>
                    <LinearGradient
                      colors={THEME.gradients.primary}
                      style={styles.iconGradient}
                    >
                      <Icon name="color-wand" size={32} color="#FFF" />
                    </LinearGradient>
                </View>

                {/* Title sits outside */}
                <Text style={styles.title}>Story Creator</Text>
                <Text style={styles.subtitle}>
                  Name your tale and choose a world.{'\n'}We'll do the rest! 🪄
                </Text>
              </View>

              {/* --- MAIN CARD --- */}
              <View style={styles.card}>
                
                {/* Step 1: Title Input */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                      <View style={styles.stepNumber}><Text style={styles.stepText}>1</Text></View>
                      <Text style={styles.label}>Name Your Story</Text>
                  </View>
                  
                  <View style={styles.inputWrapper}>
                    <Icon name="pencil" size={20} color={THEME.colors.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. The Talking Cave..."
                      placeholderTextColor={THEME.colors.textLight}
                      value={title}
                      onChangeText={setTitle}
                      maxLength={60}
                    />
                  </View>
                  <Text style={styles.helperText}>A great title starts a great adventure!</Text>
                </View>

                <View style={styles.divider} />

                {/* Step 2: Category Selection */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                      <View style={styles.stepNumber}><Text style={styles.stepText}>2</Text></View>
                      <Text style={styles.label}>Choose a World</Text>
                  </View>

                  <View style={styles.categoryGrid}>
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <TouchableOpacity
                          key={cat.id}
                          style={[
                            styles.categoryChip,
                            isSelected && { 
                              backgroundColor: cat.color + '15', 
                              borderColor: cat.color,
                              transform: [{scale: 1.05}] 
                            },
                          ]}
                          onPress={() => setSelectedCategory(cat.id)}
                          activeOpacity={0.7}
                        >
                          <Icon 
                            name={isSelected ? cat.icon.replace('-outline', '') : cat.icon} 
                            size={18} 
                            color={isSelected ? cat.color : THEME.colors.textMedium} 
                          />
                          <Text style={[
                            styles.categoryText,
                            isSelected && { color: cat.color, fontWeight: '700' }
                          ]}>
                            {cat.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* --- ACTION AREA --- */}
              <View style={styles.actionArea}>
                <TouchableOpacity
                  style={styles.generateButtonWrapper}
                  onPress={handleGenerate}
                  disabled={loading}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={loading ? [THEME.colors.textLight, THEME.colors.textLight] : THEME.gradients.primary}
                    style={styles.generateButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <View style={styles.loadingState}>
                        <ActivityIndicator color="#FFF" />
                        <Text style={styles.buttonText}>Writing Magic...</Text>
                      </View>
                    ) : (
                      <>
                        <Icon name="sparkles" size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.buttonText}>Generate Story</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* TRUST BADGE */}
                <View style={styles.trustBadge}>
                    <Icon name="shield-checkmark" size={14} color={THEME.colors.textLight} />
                    <Text style={styles.trustText}>Kid-Safe AI Filter Active</Text>
                </View>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    // CRITICAL FIX: Increased padding bottom so content isn't hidden behind the Tab Bar
    paddingBottom: 130, 
  },

  // Navbar
  navBar: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.small,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 0, // Removed margin to let icon overlap card
    zIndex: 10, // Ensure header sits on top visually
  },
  iconRing: {
    padding: 6,
    backgroundColor: THEME.colors.background, // Match bg to create 'cutout' effect
    borderRadius: 50,
    marginBottom: 12,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.glow(THEME.colors.primary),
  },
  title: {
    fontSize: 28,
    fontFamily: THEME.fonts.heading,
    color: THEME.colors.textDark,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: THEME.colors.textMedium,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: 24, // Push the card down
  },

  // Main Card
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: 32,
    padding: 24,
    // Add extra top padding if you want the icon to overlap, 
    // but here we kept them separate for clarity based on your screenshot preference.
    ...THEME.shadows.large, 
    marginBottom: 24,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  
  // Section Headers
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textDark,
    fontFamily: THEME.fonts.heading,
  },

  // Input Styling
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    height: 60,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: THEME.colors.textDark,
    fontFamily: THEME.fonts.medium,
    height: '100%',
  },
  helperText: {
    fontSize: 12,
    color: THEME.colors.textLight,
    marginTop: 8,
    marginLeft: 4,
    fontStyle: 'italic',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: 24,
    opacity: 0.5,
  },

  // Category Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 14,
    color: THEME.colors.textMedium,
    fontWeight: '600',
  },

  // Action Area
  actionArea: {
    alignItems: 'center',
    gap: 16,
  },
  generateButtonWrapper: {
    width: '100%',
    borderRadius: 20,
    ...THEME.shadows.glow(THEME.colors.primary),
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    fontFamily: THEME.fonts.heading,
    letterSpacing: 0.5,
  },
  
  // Trust Badge
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.8,
  },
  trustText: {
    fontSize: 12,
    color: THEME.colors.textLight,
    fontWeight: '600',
  },
  
  loadingState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

export default CreateStoryScreen;