import axios from 'axios';
import * as headers from '../../Tools/Header';

export const NOTIFICATION_READ_SUCCESS = 'NOTIFICATION_READ_SUCCESS';
export const NOTIFICATION_READ_FAIL = 'NOTIFICATION_READ_FAIL';
export const LOAD_FAILED = 'LOAD_FAILED';
export const NOTIFICATION_LOADED = 'NOTIFICATION_LOADED';
export const NOTIFICATION_DELETED_SUCCESS = 'NOTIFICATION_DELETED_SUCCESS';

export const remove = (id) => {
    return async dispatch => {
        try {

            const query = `mutation removeNotification($notification_id: Int!) { 
                removeNotification(notification_id: $notification_id)
                            }`;

            const res = await axios.post(`/api`, { query: query, 
                                                variables: {
                                                    notification_id:id
                                                }}, headers.headers());
            if (res && res.data.data.removeNotification === true)
                dispatch({ type: NOTIFICATION_DELETED_SUCCESS, data: id });
            else
                dispatch({
                    type: NOTIFICATION_READ_FAIL,
                    data: null
                });
        } catch (err) {
            dispatch({
                type: NOTIFICATION_READ_FAIL,
                data: null
            });
        }
    }
}

export const check = (id) => {
    return async dispatch => {
        try {

            const query = `mutation checkNotification($notification_id: Int!) { 
                checkNotification(notification_id: $notification_id)
                            }`;

            const res = await axios.post(`/api`, { query: query, 
                                                variables: {
                                                    notification_id:id
                                                }}, headers.headers());
            if (res && res.data.data.checkNotification === true) {
                dispatch({ type: NOTIFICATION_READ_SUCCESS, data: id });
            }
            else
                dispatch({
                    type: NOTIFICATION_READ_FAIL,
                    data: null
                });
        } catch (err) {
            dispatch({
                type: NOTIFICATION_READ_FAIL,
                data: null
            });
        }
    }
}

export const load = (type) => {
    return async dispatch => {
        try {
            const query = `query getUserNotifications($search: String) { 
                                    getUserNotifications(search: $search) { 
                                            notification_id,
                                            type,
                                            user_id_from,
                                            user_id_to,
                                            date,
                                            is_read,
                                            login, 
                                            src
                                        } 
                                    }`;

            const notif = await axios.post(`/api`, { query: query, variables: {
                search:type
            } }, headers.headers());

            dispatch({ type: NOTIFICATION_LOADED, data: notif.data.data.getUserNotifications });
        } catch (err) {
            dispatch({
                type: LOAD_FAILED,
                data: null
            })
        }
    }
}