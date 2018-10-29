import axios from 'axios';

import * as actionsActivity from '../../components/Activity/Actions';

export const LOGIN = 'LOGIN';
export const LOGIN_FAIL = 'LOGIN_FAIL';

export const login = (userName, password, socket, callBackLogin) => {
    return async dispatch => {
        try {
            socket.disconnect();
            const res = await axios.post('/connect', { login: userName, password: password });
            if (res.data.auth){
                socket.connect();
                socket.emit('login', userName);
                localStorage.setItem('csrf_token', res.data.csrf_token);
                localStorage.setItem('logged', true);
                localStorage.setItem('user_id', res.data.user.user_id);
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
                localStorage.setItem('address', res.data.user.address);
                localStorage.setItem('role', res.data.user.role);
                dispatch(actionsActivity.load('unread'));
                dispatch({ type: LOGIN, data: res.data });
            } else callBackLogin("Authentification failed, maybe your account is not yet validated, check your email");
            
        } catch (err) {
            callBackLogin("Authentification failed, maybe your account is not yet validated, check your email");
            dispatch({
                type: LOGIN_FAIL,
                data: null
            })
        }
    }
}