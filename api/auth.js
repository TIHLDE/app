import {IRequest} from './httphandler';

export default {
    authenticate: (username, password) => {
        return new IRequest('POST', 'auth/login/', {user_id: username, password: password}, false);
    },
}