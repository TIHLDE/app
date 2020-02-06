import {IRequest} from './httphandler';

export default {
    // Events
    getEventItem: (id) => {
        return new IRequest('GET', 'events/'.concat(id, '/'), undefined);
    },
    getEventItems: (filters) => {
        return new IRequest('GET', 'events/', filters || {});
    },
    putAttended: (event_id, item, username, token) => {
        return new IRequest('PUT', 'events/'.concat(event_id, '/users/'.concat(username, '/')), item, true, null, token);
    },
    putUserOnEventList: (id, item, token) => {
        return new IRequest('POST', 'events/'.concat(id,'/users/'), item, true, null, token);
    },
    deleteUserFromEventList: (id, item, token) => {
        return new IRequest('DELETE', 'events/'.concat(id,'/users/', item.user_id, '/'), undefined, true, null, token);
    },
    getUserEventObject: (id, item, token) => {
        return new IRequest('GET', 'events/'.concat(id, '/users/', item.user_id, '/'), undefined, true);
    },

    // User
    getUserData: (token) => {
        return new IRequest('GET', 'user/userdata/', undefined, true, null, token);
    },
    updateUserData: (userName, item, token) => {
        return new IRequest('PUT', 'user/'.concat(userName, '/'), item, true, null, token);
    },
};
