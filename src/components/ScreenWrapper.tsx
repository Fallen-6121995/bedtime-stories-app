import { SafeAreaView, StyleSheet, View, Platform, StatusBar } from 'react-native';

type ScreenWrapperProps = {
  children: React.ReactNode;
  style?: object;
  isHome?:Boolean;
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style, isHome = false }) => {
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20,
    // paddingHorizontal: 20,
  },
});

export default ScreenWrapper;
