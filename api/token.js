import { AsyncStorage } from 'react-native';

export default {
    async set(key, value) {
        try {
            return await AsyncStorage.setItem(key, value);
        } catch (error) {
            return null;
        }
    },

    async get(key) {
        try {
            return await AsyncStorage.getItem(key);
          } catch (error) {
            return null;
          }
    },

    async remove(key) {
        try {
            return AsyncStorage.removeItem(key);
        } catch (error) {
            return null;
        }
    }
}