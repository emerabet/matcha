import axios from 'axios';
import * as headers from '../../Tools/Header';

import * as actionsActivity from '../../components/Activity/Actions';

export const LOGIN = 'LOGIN';
export const LOGIN_FAIL = 'LOGIN_FAIL';

export const login =(userName, password) => {
    return async dispatch => {
        try {
            const res = await axios.post('/connect', { login: userName, password: password });
            console.log("actions login");
            console.log('data login', res.data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('last_name', res.data.user.lastName);
            localStorage.setItem('first_name', res.data.user.firstName);
            localStorage.setItem('email', res.data.user.email);
            localStorage.setItem('last_visit', res.data.user.last_visit);
            localStorage.setItem('share_location', res.data.user.share_location);
            localStorage.setItem('gender', res.data.user.gender);
            localStorage.setItem('orientation', res.data.user.orientation);
            localStorage.setItem('bio', res.data.user.bio);
            localStorage.setItem('birthdate', res.data.user.birthdate);
            localStorage.setItem('popularity', res.data.user.popularity);
            localStorage.setItem('latitude', res.data.user.latitude);
            localStorage.setItem('longitude', res.data.user.longitude);
            localStorage.setItem('login', res.data.user.login);

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

            //const notif = await axios.post(`/api`, { query: query }, headers.headers());

            actionsActivity.load();

            //dispatch({type: actionsActivity.NOTIFICATION_READ_SUCCESS, data: notif.data.data.getUserNotifications});
            dispatch({ type: LOGIN, data: res.data });
        } catch (err) {
            dispatch({
                type: LOGIN_FAIL,
                data: null
            })
        }
    }
}