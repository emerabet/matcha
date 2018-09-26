import axios from 'axios';
import thunk from 'redux-thunk';
export const LOGIN = 'LOGIN';
export const LOGIN_FAIL = 'LOGIN_FAIL';

export const login = async (userName, password) => {
    try {
        const token = await axios.post('/connect', {login: userName, password: password});
        console.log("actions login");
        console.log('token', token.data.token);
        return (dispatch) => {
            return dispatch({
            type: LOGIN, 
            data: token.data.token
        })
    }
    } catch (error) {
        return (dispatch) => {
            return dispatch({
            type: LOGIN_FAIL,
            data: error
        })
    }
    }
}