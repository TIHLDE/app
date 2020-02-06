import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import AUTH from '../auth';
import TOKEN from '../token';
import UserService from './UserService';
import Values from '../../constants/Values';
import { NavigationActions } from 'react-navigation';

class AuthService {

    static logIn = (username, password) => {
        const response = AUTH.authenticate(username, password).response();
        return response.then((data) => {
            if(data && data.token) {
                this.setUserPushToken(username);
                return TOKEN.set(Values.accessToken, data.token).then(() => {return data});
            }
            return null;
        });
    };

    static setUserPushToken = async (username) => {
        await Permissions.askAsync(Permissions.NOTIFICATIONS);

        if (Platform.OS === 'android') {
            Notifications.createChannelAndroidAsync('new-event', {
                name: 'Nytt arrangement',
                sound: true,
            });
            Notifications.createChannelAndroidAsync('event-signup-start', {
                name: 'Arrangementspåmelding åpnet',
                sound: true,
            });
            Notifications.createChannelAndroidAsync('signup-status-changed', {
                name: 'Påmeldingsstatus endret',
                sound: true,
            });
            Notifications.createChannelAndroidAsync('announcements', {
                name: 'Annonseringer',
                sound: true,
            });
        }

        let token = await Notifications.getExpoPushTokenAsync();

        UserService.updateUserData(username.toLowerCase(), {"app_token": token});
    };

    static isAuthenticated () {
        return TOKEN.get(Values.accessToken).then((data) => {
            return data;
        });
    }

    static logOut(navigation) {
        // Log out and go to homescreen
        TOKEN.remove(Values.accessToken);
        navigation.reset([NavigationActions.navigate({ routeName: 'Home' })], 0);
        return;
    }
}

export default AuthService;