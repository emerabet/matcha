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
            dispatch({ type: LOGIN, data: res.data });
        } catch (err) {
            dispatch({
                type: LOGIN_FAIL,
                data: null
            })
        }
    }
}