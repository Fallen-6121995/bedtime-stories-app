import BottomNavigation from "../navigation/bottomNavigation";
import GenerateScreen from "../screens/GenerateScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CategoryScreen from "../screens/CategoryScreen";

export const StackScreens = [
    {
        id: 1, name: "home", component: HomeScreen, options: {
            headerShown: false,
            headerBackTitleVisible: false,
            title: '',
        }
    },
    {
        id: 2, name: "bottomTab", component: BottomNavigation, options: {
            headerShown: false,
            headerBackTitleVisible: false,
            title: '',
        }
    },
    {
        id: 3, name: "profile", component: ProfileScreen, options: {
            headerShown: true,
            headerBackTitleVisible: false,
            title: '',
        }
    },
    {
        id: 4, name: "generate", component: GenerateScreen, options: {
            headerShown: true,
            headerBackTitleVisible: false,
            title: '',
        }
    },
    {
        id: 5, name: "category", component: CategoryScreen, options: {
            headerShown: true,
            headerBackTitleVisible: false,
            title: '',
        }
    }


];

export const BottomTabsScreens = [
    {
        id: 1,
        name: 'home',
        component: HomeScreen,
        position: 'LEFT',
        icon: 'home-outline'
    },
    {
        id: 2,
        name: 'profile',
        component: ProfileScreen,
        position: 'RIGHT',
        icon: 'person-outline'
    },

]