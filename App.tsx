/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './src/navigation/stackNavigation';

function App() {
  return (
    <NavigationContainer>
      <RootStack/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});

export default App;
