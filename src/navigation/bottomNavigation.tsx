import { View, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import { BottomTabsScreens } from '../common/Routes';
import MyCustomTabBar from '../components/CustomTabBar';

const BottomNavigation = () => {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator initialRouteName='home' tabBar={(props) => <MyCustomTabBar {...props} />} screenOptions={{
            headerShown:false,
            sceneStyle: {backgroundColor: "#fff"}
        }}>
            {BottomTabsScreens?.map(({id,name,component}) => (
            <Tab.Screen key={id} name={name} component={component} options={{ headerShown: false }} />
            ))}
        </Tab.Navigator>
    )
}

export default BottomNavigation