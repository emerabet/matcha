import axios from 'axios';

export const LOGIN = 'LOGIN';
export const LOGIN_FAIL = 'LOGIN_FAIL';

export const login =(userName, password) => {
    return async dispatch => {
        try {
            const res = await axios.post('/connect', { login: userName, password: password });
            console.log("actions login");
            console.log('data login', res.data);
            sessionStorage.setItem('token', res.data.token);
            sessionStorage.setItem('last_name', res.data.user.lastName);
            sessionStorage.setItem('first_name', res.data.user.firstName);
            sessionStorage.setItem('email', res.data.user.email);
            sessionStorage.setItem('last_visit', res.data.user.last_visit);
            sessionStorage.setItem('share_location', res.data.user.share_location);
            sessionStorage.setItem('gender', res.data.user.gender);
            sessionStorage.setItem('orientation', res.data.user.orientation);
            sessionStorage.setItem('bio', res.data.user.bio);
            sessionStorage.setItem('birthdate', res.data.user.birthdate);
            sessionStorage.setItem('popularity', res.data.user.popularity);
            sessionStorage.setItem('latitude', res.data.user.latitude);
            sessionStorage.setItem('longitude', res.data.user.longitude);
            sessionStorage.setItem('login', res.data.user.login);
            dispatch({ type: LOGIN, data: res.data });
        } catch (err) {
            dispatch({
                type: LOGIN_FAIL,
                data: null
            })
        }
    }
}