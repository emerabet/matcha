import axios from 'axios';

export const LOGIN = 'LOGIN';
export const LOGIN_FAIL = 'LOGIN_FAIL';

export const login =(userName, password) => {
    return async dispatch => {
        try {
            const token = await axios.post('/connect', { login: userName, password: password });
            console.log("actions login");
            console.log('token', token.data.token);
            localStorage.setItem('token', token.data.token);
            dispatch({ type: LOGIN, data: token.data.token });
        } catch (err) {
            dispatch({
                type: LOGIN_FAIL,
                data: null
            })
        }
    }
}