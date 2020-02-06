import React from 'react';
import { Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { enableScreens } from 'react-native-screens';

import * as Sentry from 'sentry-expo';

import TabBarIcon from './components/TabBarIcon';
 
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import GamesScreen from './screens/GamesScreen';
import EventScreen from './screens/EventScreen';
import EventRegistrationScreen from './screens/EventRegistrationScreen';
import SettingsScreen from './screens/SettingsScreen';

import Colors from './constants/Colors';

enableScreens();

Sentry.init({
  dsn: 'https://b8089d6ff0a649d58d30414d36fc6f8f@sentry.io/2187549',
  enableInExpoDevelopment: false,
  debug: true
});

const MaterialBottomTabNavigator = createMaterialBottomTabNavigator({
    ProfileScreen: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} name={'person-outline'} />),
      },
    },
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (focused ? <Image source={require('./assets/images/tihlde_logo_blaa_liten.png')} style={{width: 36, height: 36, marginTop: -8}}/> : <Image source={require('./assets/images/tihlde_logo_graa_liten.png')} style={{width: 36, height: 36, marginTop: -8}}/>),
      },
    },
    GamesScreen: {
      screen: GamesScreen,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} name={'play-arrow'} />),
      },
    },
  }, {
    initialRouteName: 'HomeScreen',
    activeColor: Colors.tabIconSelected,
    inactiveColor: Colors.tabIconDefault,
    barStyle: { backgroundColor: '#ffffff' },
  }
);

const AppStack = createStackNavigator({
    Home: {
        screen: MaterialBottomTabNavigator,
        navigationOptions: {
          headerShown: false
        }
    },
    Event: {
        screen: EventScreen,
        navigationOptions: {
          headerShown: false
        }
    },
    EventRegistration: {
        screen: EventRegistrationScreen,
        navigationOptions: {
          headerShown: false
        }
    },
    Settings: {
        screen: SettingsScreen,
        navigationOptions: {
          headerShown: false
        }
    },
  },
  {
      headerMode: 'none',
      navigationOptions: {
          headerVisible: false,
      },
      initialRouteName: 'Home',
});
export default createAppContainer(AppStack);