import API from '../api';
import TOKEN from '../token';
import Values from '../../constants/Values';

class EventService {

    // Fetches events
    static getEvents = async (filters=null, orderBy=null, callback=null) => {

        // Fetch events
        const response = API.getEventItems(filters).response();
        return response.then((data) => {
            data = data || {};
            let results = data.results || [];

            // If orderby is provided, sort the data
            if(orderBy && response.isError === false) {
                for(const key in orderBy) {
                    results = results.sort((a, b) => (a[key] === b[key])? 0 : a[key] ? 1 : -1)
                }
                if(data.results) {
                  data.results = results;
                }
            }
            if(response.isError === false) {
                // EventActions.addEvents(data)(store.dispatch);
            }
            !callback || callback(response.isError === true, data);
            return response.isError === false ? Promise.resolve(data) : Promise.reject(data);
        });
    }

    // Get event by id
    static getEventById = async (id, callback=null) => {
        const response = API.getEventItem(id).response();
        return response.then((data) => {
            !callback || callback(response.isError === true, data);
            if (response.isError === false) {
                return Promise.resolve(data);
            } else {
                return Promise.reject(null);
            }
        });
    }
    
    static putAttended = async (event_id, item, username) => {
        return TOKEN.get(Values.accessToken).then((token) => {
            const response = API.putAttended(event_id, item, username, token).response();
            return response.then((data) => {
                return data;
            });
        });
    }

    static putUserOnEventList = (id, userData) => {
        return TOKEN.get(Values.accessToken).then((token) => {
            userData = {user_id: userData.user_id, event: id};
            const response = API.putUserOnEventList(id,userData, token).response();
            return response.then((data) => {
                return data
            })
        });
    }

    static deleteUserFromEventList = (id, userData) => {
        return TOKEN.get(Values.accessToken).then((token) => {
            userData = {user_id: userData.user_id, event: id};
            const response = API.deleteUserFromEventList(id, userData, token).response();
            return response.then((data) => {
                return data
            })
        });
    }

    static getUserEventObject = (id, userData) => {
        return TOKEN.get(Values.accessToken).then((token) => {
            userData = {...userData, event: id};
            const response = API.getUserEventObject(id, userData, token).response();
            return response.then((data) => {
                return data
            })
        });
    }
}

export default EventService;
