import API from '../api';
import TOKEN from '../token';
import Values from '../../constants/Values';

class UserService {

    static fetchUserData = async () => {
        return TOKEN.get(Values.accessToken).then((data) => {
            return API.getUserData(data).response()
                .then((userData) => {
                    return userData;
                });
        });
    }

    static updateUserData = async (userName, userData, callback=null) => {
        return await TOKEN.get(Values.accessToken).then((token) => {
            const response = API.updateUserData(userName, userData, token).response();
            return response.then((data) => {
                !callback || callback(response.isError === true, data);
                return data;
            });
        });
    }
}

export default UserService;
