import axios from 'axios';
import * as headers from '../../Tools/Header';

export const NOTIFICATION_READ_SUCCESS = 'NOTIFICATION_READ_SUCCESS';
export const NOTIFICATION_READ_FAIL = 'NOTIFICATION_READ_FAIL';
export const LOAD_FAILED = 'LOAD_FAILED';
export const NOTIFICATION_LOADED = 'NOTIFICATION_LOADED';

export const remove = (id) => {
    return async dispatch => {
        try {

            // Traitement à faire ici
            
            dispatch({ type: NOTIFICATION_READ_SUCCESS, data: '' });
        } catch (err) {
            dispatch({
                type: NOTIFICATION_READ_FAIL,
                data: null
            })
        }
    }
}

export const load = async () => {
    return async dispatch => {
        try {
            console.log("loaddddddddddddddddd");
            const query = `query getUserNotifications { 
                                    getUserNotifications { 
                                            notification_id,
                                            type,
                                            user_id_from,
                                            user_id_to,
                                            date,
                                            is_read,
                                            login
                                        } 
                                    }`;

            const notif = await axios.post(`/api`, { query: query }, headers.headers());
            console.log("loaddddddddddddddddd");
            console.log(notif);

            dispatch({ type: NOTIFICATION_LOADED, data: notif.data.data.getUserNotifications });
        } catch (err) {
            dispatch({
                type: LOAD_FAILED,
                data: null
            })
        }
    }
}