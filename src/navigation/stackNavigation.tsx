import { View, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import BottomNavigation from './bottomNavigation';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackScreens } from '../common/Routes';

function RootStack() {
    const navigation = useNavigation()
    useEffect(() => {
        checkToken()

    }, [])

    const checkToken = () => {
        let abc = "Vikas"
        if (abc == "Vikas") {
            navigation.navigate('bottomTab');
        } else {
            navigation.navigate('Home');
        }
    }

    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName="home">
            {StackScreens?.map(({id,name,component,options}) => (
            <Stack.Screen key={id} name={name} component={component} options={options} />
            ))}
        </Stack.Navigator>
    );
}

export default RootStack